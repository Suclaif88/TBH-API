// controllers/agendamiento.controller.js - CORREGIDO:
const { Agendamientos, Agendamiento_Servicios, Servicios, Empleados, Clientes } = require('../models');
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
    // Construir array de items con precio y duracion reales
    const itemsToInsert = serviciosDB.map(s => {
      totalDuration += Number(s.Duracion);
      subtotal += Number(s.Precio); // si prefieres usar precio enviado por cliente, cámbialo
      return {
        Id_Servicios: s.Id_Servicios,
        Precio: s.Precio,
        Duracion: s.Duracion
      };
    });

    // 3) Calcular hora fin
    const Hora_Fin = addMinutes(Fecha, Hora_Inicio, totalDuration); // devuelve 'HH:MM:SS'

    // 4) Validar solapamientos para el mismo empleado y fecha
    // Condición: existe un registro tal que InicioExistente < Hora_Fin  AND  FinExistente > Hora_Inicio
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

    // 5) Crear agendamiento
    const nuevoAgendamiento = await Agendamientos.create({
      Id_Cliente,
      Id_Empleados,
      Fecha,
      Hora_Inicio,
      Hora_Fin,
      Subtotal: subtotal,
    }, { transaction: t });

    // 6) Insertar registros en la tabla relación
    for (const item of itemsToInsert) {
      await Agendamiento_Servicios.create({
        Id_Agendamientos: nuevoAgendamiento.Id_Agendamientos,
        Id_Servicios: item.Id_Servicios,
        Precio: item.Precio
      }, { transaction: t });
    }

    await t.commit();

    // Opcional: devolver la estructura limpia como en tu otro endpoint
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