// controllers/agendamiento.controller.js - CORREGIDO con validación de novedades
const { Agendamientos, Agendamiento_Servicios, Servicios, Empleados, Clientes, Novedades_Horarios, Empleado_Servicio } = require('../models');
const { sequelize } = require("../config/db");
const { Op } = require('sequelize');
const { addMinutes } = require('../utils/timeHelpers');

// Función para crear agendamientos con múltiples servicios
exports.crearAgendamientos = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { Id_Cliente, Id_Empleados, Fecha, Hora_Inicio, serviciosAgendados } = req.body;

    if (!Hora_Inicio) {
      return res.status(400).json({ status: 'error', message: 'Hora_Inicio es requerida (ej: "09:30")' });
    }
    if (!Array.isArray(serviciosAgendados) || serviciosAgendados.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Debes enviar al menos un servicio' });
    }

    // 1) Obtener datos reales de servicios desde DB (duracion y precio)
    const idsServicios = serviciosAgendados.map(s => s.Id_Servicios);
    const serviciosDB = await Servicios.findAll({
      where: { Id_Servicios: idsServicios },
      transaction: t
    });

    if (serviciosDB.length !== idsServicios.length) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'Uno o más servicios no existen' });
    }

    // 2) Calcular duración total (en minutos) y subtotal (precio)
    let totalDuration = 0;
    let subtotal = 0;
    const itemsToInsert = serviciosDB.map(s => {
      totalDuration += Number(s.Duracion);
      subtotal += Number(s.Precio);
      return {
        Id_Servicios: s.Id_Servicios,
        Precio: s.Precio,
        Duracion: s.Duracion
      };
    });

    // 3) Calcular hora fin
    const Hora_Fin = addMinutes(Fecha, Hora_Inicio, totalDuration); // devuelve 'HH:MM:SS'

    // 4) Validar solapamientos con agendamientos existentes
    const conflicto = await Agendamientos.findOne({
      where: {
        Id_Empleados,
        Fecha,
        [Op.and]: [
          { Hora_Inicio: { [Op.lt]: Hora_Fin } },
          { Hora_Fin: { [Op.gt]: Hora_Inicio } }
        ]
      },
      transaction: t
    });

    if (conflicto) {
      await t.rollback();
      return res.status(409).json({
        status: 'error',
        message: 'Horario no disponible para ese empleado en la franja seleccionada',
        conflict: {
          Id_Agendamientos: conflicto.Id_Agendamientos,
          Fecha: conflicto.Fecha,
          Hora_Inicio: conflicto.Hora_Inicio,
          Hora_Fin: conflicto.Hora_Fin
        }
      });
    }

    // 5) Validar solapamientos con novedades del empleado
    const novedad = await Novedades_Horarios.findOne({
      where: {
        Id_Empleados,
        Fecha,
        [Op.and]: [
          { Hora_Inicio: { [Op.lt]: Hora_Fin } },
          { Hora_Fin: { [Op.gt]: Hora_Inicio } }
        ]
      },
      transaction: t
    });

    if (novedad) {
      await t.rollback();
      return res.status(409).json({
        status: 'error',
        message: `El empleado tiene una novedad en ese horario (${novedad.Motivo})`,
        conflict: {
          Id_Novedades_Horarios: novedad.Id_Novedades_Horarios,
          Fecha: novedad.Fecha,
          Hora_Inicio: novedad.Hora_Inicio,
          Hora_Fin: novedad.Hora_Fin,
          Motivo: novedad.Motivo
        }
      });
    }

    // 6) Crear agendamiento
    const nuevoAgendamiento = await Agendamientos.create({
      Id_Cliente,
      Id_Empleados,
      Fecha,
      Hora_Inicio,
      Hora_Fin,
      Subtotal: subtotal,
    }, { transaction: t });

    // 7) Insertar registros en la tabla relación
    for (const item of itemsToInsert) {
      await Agendamiento_Servicios.create({
        Id_Agendamientos: nuevoAgendamiento.Id_Agendamientos,
        Id_Servicios: item.Id_Servicios,
        Precio: item.Precio
      }, { transaction: t });
    }

    await t.commit();

    // 8) Respuesta estructurada
    const respuesta = {
      Id_Agendamientos: nuevoAgendamiento.Id_Agendamientos,
      Fecha: nuevoAgendamiento.Fecha,
      Hora_Inicio: nuevoAgendamiento.Hora_Inicio,
      Hora_Fin: nuevoAgendamiento.Hora_Fin,
      Subtotal: nuevoAgendamiento.Subtotal,
      Estado: nuevoAgendamiento.Estado,
      Servicios: itemsToInsert.map(i => ({
        Id_Servicios: i.Id_Servicios,
        Precio: i.Precio,
        Duracion: i.Duracion
      }))
    };

    return res.status(201).json({ status: 'success', data: respuesta });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ status: 'error', message: err.message });
  }
};


// Función para obtener agendamientos por fecha
exports.obtenerAgendamientosPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;

    const agendamientosDB = await Agendamientos.findAll({
      where: { Fecha: fecha },
      include: [
        {
          model: Empleados,
          as: "Id_Empleados_Empleado",
          attributes: ["Id_Empleados", "Nombre", "Celular"]
        },
        {
          model: Clientes,
          as: "Id_Cliente_Cliente",
          attributes: ["Id_Cliente", "Nombre", "Celular", "Correo"]
        },
        {
          model: Agendamiento_Servicios,
          as: "Agendamiento_Servicios", // 👈 ahora plural
          include: [
            {
              model: Servicios,
              as: "Servicio",
              attributes: ["Id_Servicios", "Nombre", "Precio", "Duracion"]
            }
          ]
        }
      ]
    });

    // 🔹 Transformar la data para que quede limpia
    const agendamientos = agendamientosDB.map(a => ({
      Id_Agendamientos: a.Id_Agendamientos,
      Fecha: a.Fecha,
      Hora_Inicio: a.Hora_Inicio,
      Hora_Fin: a.Hora_Fin,   
      Estado: a.Estado,
      Subtotal: a.Subtotal,
      Cliente: {
        Id_Cliente: a.Id_Cliente_Cliente?.Id_Cliente,
        Nombre: a.Id_Cliente_Cliente?.Nombre,
        Celular: a.Id_Cliente_Cliente?.Celular,
        Correo: a.Id_Cliente_Cliente?.Correo
      },
      Empleado: {
        Id_Empleados: a.Id_Empleados_Empleado?.Id_Empleados,
        Nombre: a.Id_Empleados_Empleado?.Nombre,
        Celular: a.Id_Empleados_Empleado?.Celular
      },
      Servicios: a.Agendamiento_Servicios?.map(s => ({
        Id_Servicios: s.Servicio?.Id_Servicios,
        Nombre: s.Servicio?.Nombre,
        Precio: s.Precio, // el precio viene de Agendamiento_Servicios
        Duracion: s.Servicio?.Duracion
      })) || []
    }));

    res.json({ status: "success", data: agendamientos });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};



exports.obtenerAgendamientosPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const agendamiento = await Agendamientos.findByPk(id); // ✅ Variable corregida

        if (!agendamiento) {
            return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
        }

        res.json({ status: 'success', data: agendamiento }); // ✅ 'agendamiento' no 'insumo'
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.eliminarAgendamientos = async (req, res) => {
    try {
        const { id } = req.params;
        const agendamiento = await Agendamientos.findOne({ 
            where: { Id_Agendamientos: id } // ✅ Parámetro corregido
        });

        if (!agendamiento) {
            return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
        }

        await agendamiento.destroy();
        res.json({ status: 'success', message: 'Agendamiento eliminado' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

/**
 * Endpoint público para crear agendamientos
 * Requiere token de autenticación pero no verificación de roles
 */
exports.crearAgendamientoPublico = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log('=== DEBUG: Crear Agendamiento Público ===');
    console.log('Headers:', req.headers);
    console.log('User from token:', req.user);
    console.log('Body recibido:', req.body);
    
    const { Id_Empleados, Fecha, Hora_Inicio, serviciosAgendados } = req.body;

    // Obtener Id_Cliente del token de autenticación
    const Id_Cliente = req.user?.id;
    
    console.log('=== DEBUG: Id_Cliente obtenido del token ===');
    console.log('Id_Cliente del token:', Id_Cliente);

    // Validaciones de datos requeridos
    const errors = {};
    
    if (!Id_Cliente) {
      errors.Id_Cliente = ['No se pudo obtener el ID del cliente del token de autenticación'];
    }
    if (!Id_Empleados) {
      errors.Id_Empleados = ['El ID del empleado es requerido'];
    }
    if (!Fecha) {
      errors.Fecha = ['La fecha es requerida'];
    }
    if (!Hora_Inicio) {
      errors.Hora_Inicio = ['La hora de inicio es requerida'];
    }
    if (!Array.isArray(serviciosAgendados) || serviciosAgendados.length === 0) {
      errors.serviciosAgendados = ['Debe seleccionar al menos un servicio'];
    }

    if (Object.keys(errors).length > 0) {
      console.log('=== ERROR: Validaciones fallidas ===');
      console.log('Errores encontrados:', errors);
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors
      });
    }

    // El Id_Cliente ya se obtuvo del token, no necesitamos validación adicional
    console.log('=== DEBUG: Id_Cliente validado desde token ===');
    console.log('Id_Cliente a usar:', Id_Cliente);

    // Buscar el cliente por documento (ya que el token contiene un Usuario, no un Cliente)
    console.log('=== DEBUG: Buscando cliente por documento ===');
    console.log('Documento del usuario:', req.user.documento);
    
    const cliente = await Clientes.findOne({
      where: { Documento: req.user.documento },
      transaction: t
    });
    
    if (!cliente) {
      console.log('=== ERROR: Cliente no encontrado por documento ===');
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    // Usar el Id_Cliente real encontrado
    const Id_Cliente_Real = cliente.Id_Cliente;
    console.log('Cliente encontrado:', cliente.Nombre, 'ID:', Id_Cliente_Real);

    // Validar que el empleado existe y está activo
    const empleado = await Empleados.findByPk(Id_Empleados, { 
      transaction: t,
      attributes: ['Id_Empleados', 'Nombre', 'Estado']
    });
    if (!empleado) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }
    if (!empleado.Estado) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'El empleado no está activo'
      });
    }

    // Validar fecha (no puede ser anterior al día actual)
    const fechaActual = new Date().toISOString().split('T')[0];
    if (Fecha < fechaActual) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'La fecha no puede ser anterior al día actual'
      });
    }

    // Validar formato de hora
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(Hora_Inicio)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Formato de hora inválido. Use HH:MM'
      });
    }

    // Validar que los servicios existen y están activos
    console.log('=== DEBUG: Validación de servicios ===');
    console.log('serviciosAgendados recibidos:', serviciosAgendados);
    
    // Aceptar tanto Id_Servicio como Id_Servicios para compatibilidad
    const idsServicios = serviciosAgendados.map(s => s.Id_Servicio || s.Id_Servicios);
    console.log('IDs de servicios extraídos:', idsServicios);
    
    const serviciosDB = await Servicios.findAll({
      where: { 
        Id_Servicios: idsServicios,
        Estado: true
      },
      transaction: t
    });
    
    console.log('Servicios encontrados en DB:', serviciosDB.length);

    if (serviciosDB.length !== idsServicios.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Uno o más servicios no existen o no están activos'
      });
    }

    // Validar que los servicios están disponibles para el empleado
    console.log('=== DEBUG: Validación de servicios del empleado ===');
    console.log('Id_Empleados:', Id_Empleados);
    console.log('idsServicios para validar:', idsServicios);
    
    const serviciosEmpleado = await Empleado_Servicio.findAll({
      where: { 
        Id_Empleados: Id_Empleados,
        Id_Servicios: idsServicios
      },
      transaction: t
    });
    
    console.log('Servicios del empleado encontrados:', serviciosEmpleado.length);
    console.log('Servicios del empleado:', serviciosEmpleado.map(s => s.Id_Servicios));

    if (serviciosEmpleado.length !== idsServicios.length) {
      console.log('=== ERROR: Servicios no disponibles para empleado ===');
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Uno o más servicios no están disponibles para este empleado'
      });
    }

    // Calcular duración total y subtotal
    let totalDuration = 0;
    let subtotal = 0;
    const itemsToInsert = serviciosDB.map(s => {
      totalDuration += Number(s.Duracion);
      subtotal += Number(s.Precio);
      return {
        Id_Servicios: s.Id_Servicios,
        Precio: s.Precio,
        Duracion: s.Duracion
      };
    });

    // Calcular hora fin
    const Hora_Fin = addMinutes(Fecha, Hora_Inicio, totalDuration);

    // Validar conflictos de horario con otros agendamientos
    const conflicto = await Agendamientos.findOne({
      where: {
        Id_Empleados,
        Fecha,
        [Op.and]: [
          { Hora_Inicio: { [Op.lt]: Hora_Fin } },
          { Hora_Fin: { [Op.gt]: Hora_Inicio } }
        ]
      },
      transaction: t
    });

    if (conflicto) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Conflicto de horario',
        error: 'El empleado ya tiene una cita programada en este horario'
      });
    }

    // Validar conflictos con novedades del empleado
    const novedad = await Novedades_Horarios.findOne({
      where: {
        Id_Empleados,
        Fecha,
        [Op.and]: [
          { Hora_Inicio: { [Op.lt]: Hora_Fin } },
          { Hora_Fin: { [Op.gt]: Hora_Inicio } }
        ]
      },
      transaction: t
    });

    if (novedad) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Conflicto de horario',
        error: `El empleado tiene una novedad en ese horario (${novedad.Motivo})`
      });
    }

    // Crear agendamiento
    const nuevoAgendamiento = await Agendamientos.create({
      Id_Cliente: Id_Cliente_Real,
      Id_Empleados,
      Fecha,
      Hora_Inicio,
      Hora_Fin,
      Subtotal: subtotal,
      Estado: 'Agendado'
    }, { transaction: t });

    // Crear relaciones con servicios
    for (const item of itemsToInsert) {
      await Agendamiento_Servicios.create({
        Id_Agendamientos: nuevoAgendamiento.Id_Agendamientos,
        Id_Servicios: item.Id_Servicios,
        Precio: item.Precio
      }, { transaction: t });
    }

    await t.commit();

    // Respuesta exitosa
    const respuesta = {
      Id_Agendamiento: nuevoAgendamiento.Id_Agendamientos,
      Id_Cliente: Id_Cliente_Real,
      Id_Empleados: nuevoAgendamiento.Id_Empleados,
      Fecha: nuevoAgendamiento.Fecha,
      Hora_Inicio: nuevoAgendamiento.Hora_Inicio,
      Hora_Fin: nuevoAgendamiento.Hora_Fin,
      Estado: nuevoAgendamiento.Estado,
      servicios: serviciosDB.map(s => ({
        Id_Servicio: s.Id_Servicios,
        Nombre: s.Nombre,
        Precio: s.Precio,
        Duracion: s.Duracion
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: 'Agendamiento creado exitosamente',
      data: respuesta
    });

  } catch (err) {
    await t.rollback();
    console.error('Error al crear agendamiento público:', err);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
  }
};