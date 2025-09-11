// controllers/agendamiento.controller.js - COMPLETO (incluye actualizarAgendamientos)
const { Sequelize } = require('sequelize');
const { Agendamientos, Agendamiento_Servicios, Servicios, Empleados, Clientes, Novedades_Horarios, Empleado_Servicio } = require('../models');
const { sequelize } = require("../config/db");
const { Op } = require('sequelize');
const { addMinutes } = require('../utils/timeHelpers');

/**
 * Crear agendamientos (interno/admin) con múltiples servicios
 */
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

    const idsServicios = serviciosAgendados.map(s => s.Id_Servicios || s.Id_Servicio);
    const serviciosDB = await Servicios.findAll({
      where: { Id_Servicios: idsServicios },
      transaction: t
    });

    if (serviciosDB.length !== idsServicios.length) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'Uno o más servicios no existen' });
    }

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

    const Hora_Fin = addMinutes(Fecha, Hora_Inicio, totalDuration);

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

    const nuevoAgendamiento = await Agendamientos.create({
      Id_Cliente,
      Id_Empleados,
      Fecha,
      Hora_Inicio,
      Hora_Fin,
      Subtotal: subtotal,
    }, { transaction: t });

    for (const item of itemsToInsert) {
      await Agendamiento_Servicios.create({
        Id_Agendamientos: nuevoAgendamiento.Id_Agendamientos,
        Id_Servicios: item.Id_Servicios,
        Precio: item.Precio
      }, { transaction: t });
    }

    await t.commit();

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
    console.error('Error creando agendamiento (crearAgendamientos):', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * Obtener agendamientos por fecha
 */
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
          as: "Agendamiento_Servicios",
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
        Precio: s.Precio,
        Duracion: s.Servicio?.Duracion
      })) || []
    }));

    res.json({ status: "success", data: agendamientos });
  } catch (err) {
    console.error('Error obtenerAgendamientosPorFecha:', err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * Obtener agendamiento por ID
 */
exports.obtenerAgendamientosPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamiento = await Agendamientos.findOne({
      where: { Id_Agendamientos: id },
      include: [
        { model: Agendamiento_Servicios, as: 'Agendamiento_Servicios', include: [{ model: Servicios, as: 'Servicio' }] },
        { model: Empleados, as: 'Id_Empleados_Empleado', attributes: ['Id_Empleados', 'Nombre'] },
        { model: Clientes, as: 'Id_Cliente_Cliente', attributes: ['Id_Cliente', 'Nombre'] }
      ]
    });

    if (!agendamiento) {
      return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
    }

    const respuesta = {
      Id_Agendamientos: agendamiento.Id_Agendamientos,
      Id_Cliente: agendamiento.Id_Cliente,
      Id_Empleados: agendamiento.Id_Empleados,
      Fecha: agendamiento.Fecha,
      Hora_Inicio: agendamiento.Hora_Inicio,
      Hora_Fin: agendamiento.Hora_Fin,
      Estado: agendamiento.Estado,
      serviciosAgendados: (agendamiento.Agendamiento_Servicios || []).map(s => ({
        Id_Servicios: s.Id_Servicios,
        Precio: s.Precio,
        Nombre: s.Servicio?.Nombre,
        Duracion: s.Servicio?.Duracion
      }))
    };

    res.json({ status: 'success', data: respuesta });
  } catch (err) {
    console.error('Error obtenerAgendamientosPorId:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * Actualizar agendamiento
 */
exports.actualizarAgendamientos = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      Id_Cliente,
      Id_Empleados,
      Fecha,
      Hora_Inicio,
      serviciosAgendados, // optional
      Estado
    } = req.body;

    console.log(`[PUT] intento actualizar Agendamiento id=${id}`);

    const agendamiento = await Agendamientos.findOne({
      where: { Id_Agendamientos: id },
      transaction: t
    });

    if (!agendamiento) {
      await t.rollback();
      console.log(`[PUT] id=${id} no encontrado`);
      return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
    }

    // Servicios a usar
    let serviciosDB = [];
    if (Array.isArray(serviciosAgendados) && serviciosAgendados.length > 0) {
      const idsServicios = serviciosAgendados.map(s => s.Id_Servicio || s.Id_Servicios);
      serviciosDB = await Servicios.findAll({
        where: { Id_Servicios: idsServicios },
        transaction: t
      });
      if (serviciosDB.length !== idsServicios.length) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: 'Uno o más servicios no existen' });
      }
    } else {
      const actuales = await Agendamiento_Servicios.findAll({
        where: { Id_Agendamientos: id },
        include: [{ model: Servicios, as: 'Servicio' }],
        transaction: t
      });
      serviciosDB = actuales.map(a => a.Servicio).filter(Boolean);
    }

    // calcular duración y subtotal
    let totalDuration = 0;
    let subtotal = 0;
    const itemsToInsert = serviciosDB.map(s => {
      totalDuration += Number(s.Duracion || 0);
      subtotal += Number(s.Precio || 0);
      return { Id_Servicios: s.Id_Servicios, Precio: s.Precio };
    });

    if (!Fecha) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'Fecha es requerida' });
    }
    if (!Hora_Inicio) {
      await t.rollback();
      return res.status(400).json({ status: 'error', message: 'Hora_Inicio es requerida' });
    }

    const Hora_Fin = addMinutes(Fecha, Hora_Inicio, totalDuration);

    const conflicto = await Agendamientos.findOne({
      where: {
        Id_Empleados: Id_Empleados ?? agendamiento.Id_Empleados,
        Fecha,
        Id_Agendamientos: { [Op.ne]: id },
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

    const novedad = await Novedades_Horarios.findOne({
      where: {
        Id_Empleados: Id_Empleados ?? agendamiento.Id_Empleados,
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
      });
    }

    const camposActualizar = {
      Fecha,
      Hora_Inicio,
      Hora_Fin,
    };
    if (typeof Id_Empleados !== 'undefined') camposActualizar.Id_Empleados = Id_Empleados;
    if (typeof Id_Cliente !== 'undefined') camposActualizar.Id_Cliente = Id_Cliente;
    if (typeof Estado !== 'undefined') camposActualizar.Estado = Estado;
    if (typeof subtotal !== 'undefined') camposActualizar.Subtotal = subtotal;

    await agendamiento.update(camposActualizar, { transaction: t });

    // actualizar servicios vinculados
    await Agendamiento_Servicios.destroy({ where: { Id_Agendamientos: id }, transaction: t });
    if (itemsToInsert.length > 0) {
      const entries = itemsToInsert.map(item => ({
        Id_Agendamientos: id,
        Id_Servicios: item.Id_Servicios,
        Precio: item.Precio
      }));
      await Agendamiento_Servicios.bulkCreate(entries, { transaction: t });
    }

    await t.commit();

    const updated = await Agendamientos.findOne({
      where: { Id_Agendamientos: id },
      include: [
        { model: Agendamiento_Servicios, as: 'Agendamiento_Servicios', include: [{ model: Servicios, as: 'Servicio' }] },
        { model: Empleados, as: 'Id_Empleados_Empleado', attributes: ['Id_Empleados','Nombre'] },
        { model: Clientes, as: 'Id_Cliente_Cliente', attributes: ['Id_Cliente','Nombre'] }
      ]
    });

    return res.json({ status: 'success', data: updated });
  } catch (err) {
    try { await t.rollback(); } catch(e){ /* ignore */ }
    console.error(`[PUT] Error actualizando id=${req.params.id}:`, err);

    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ status: 'error', message: 'Restricción de FK al actualizar', error: err.message });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error actualizando agendamiento',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Eliminar agendamiento (con borrado de dependientes y manejo de FK)
 */
exports.eliminarAgendamientos = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    console.log(`[DELETE] intento eliminar Agendamiento id=${id}`);

    const agendamiento = await Agendamientos.findOne({
      where: { Id_Agendamientos: id },
      transaction: t
    });

    if (!agendamiento) {
      await t.rollback();
      console.log(`[DELETE] id=${id} no encontrado`);
      return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
    }

    await Agendamiento_Servicios.destroy({
      where: { Id_Agendamientos: id },
      transaction: t
    });

    await agendamiento.destroy({ transaction: t });

    await t.commit();
    console.log(`[DELETE] id=${id} eliminado correctamente`);
    return res.json({ status: 'success', message: 'Agendamiento eliminado' });
  } catch (err) {
    try { await t.rollback(); } catch (e) { /* ignore */ }
    console.error(`[DELETE] Error eliminando id=${req.params.id}:`, err);

    if (err.name === 'SequelizeForeignKeyConstraintError' || err.parent?.errno === 1451) {
      return res.status(409).json({
        status: 'error',
        message: 'No se puede eliminar el agendamiento porque existen registros relacionados.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error eliminando agendamiento',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Endpoint público para crear agendamientos (usa token, pero es "público" en el sentido de cliente)
 */
exports.crearAgendamientoPublico = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log('=== DEBUG: Crear Agendamiento Público ===');
    console.log('Headers:', req.headers);
    console.log('User from token:', req.user);
    console.log('Body recibido:', req.body);
    
    const { Id_Empleados, Fecha, Hora_Inicio, serviciosAgendados } = req.body;

    const Id_Cliente = req.user?.id;
    
    console.log('=== DEBUG: Id_Cliente obtenido del token ===');
    console.log('Id_Cliente del token:', Id_Cliente);

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
    
    const Id_Cliente_Real = cliente.Id_Cliente;
    console.log('Cliente encontrado:', cliente.Nombre, 'ID:', Id_Cliente_Real);

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

    const fechaActual = new Date().toISOString().split('T')[0];
    if (Fecha < fechaActual) {
      await t.rollback();
      return res.status(422).json({
        success: false,
        message: 'La fecha no puede ser anterior al día actual'
      });
    }

    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(Hora_Inicio)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Formato de hora inválido. Use HH:MM'
      });
    }

    const idsServicios = serviciosAgendados.map(s => s.Id_Servicio || s.Id_Servicios);
    const serviciosDB = await Servicios.findAll({
      where: { 
        Id_Servicios: idsServicios,
        Estado: true
      },
      transaction: t
    });

    if (serviciosDB.length !== idsServicios.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Uno o más servicios no existen o no están activos'
      });
    }

    const serviciosEmpleado = await Empleado_Servicio.findAll({
      where: { 
        Id_Empleados: Id_Empleados,
        Id_Servicios: idsServicios
      },
      transaction: t
    });

    if (serviciosEmpleado.length !== idsServicios.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Uno o más servicios no están disponibles para este empleado'
      });
    }

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

    const Hora_Fin = addMinutes(Fecha, Hora_Inicio, totalDuration);

    const conflicto2 = await Agendamientos.findOne({
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

    if (conflicto2) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Conflicto de horario',
        error: 'El empleado ya tiene una cita programada en este horario'
      });
    }

    const novedad2 = await Novedades_Horarios.findOne({
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

    if (novedad2) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Conflicto de horario',
        error: `El empleado tiene una novedad en ese horario (${novedad2.Motivo})`
      });
    }

    const nuevoAgendamiento = await Agendamientos.create({
      Id_Cliente: Id_Cliente_Real,
      Id_Empleados,
      Fecha,
      Hora_Inicio,
      Hora_Fin,
      Subtotal: subtotal,
      Estado: 'Agendado'
    }, { transaction: t });

    for (const item of itemsToInsert) {
      await Agendamiento_Servicios.create({
        Id_Agendamientos: nuevoAgendamiento.Id_Agendamientos,
        Id_Servicios: item.Id_Servicios,
        Precio: item.Precio
      }, { transaction: t });
    }

    await t.commit();

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
