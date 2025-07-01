const { Novedades_Horarios } = require('../models');
const { Op } = require("sequelize");

exports.listarNovedadesHorarios = async (req, res) => {
  try {
    const novedades = await Novedades_Horarios.findAll();
    res.json({ status: 'success', data: novedades });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerNovedadPorId = async (req, res) => {
  try {
    const novedad = await Novedades_Horarios.findByPk(req.params.id);
    if (!novedad) {
      return res.status(404).json({ status: 'error', message: 'Novedad de horario no encontrada' });
    }
    res.json({ status: 'success', data: novedad });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerNovedadesPorEmpleado = async (req, res) => {
  try {
    const novedades = await Novedades_Horarios.findAll({
      where: { Id_Empleados: req.params.idEmpleado }
    });
    res.json({ status: 'success', data: novedades });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener novedades por empleado' });
  }
};

exports.crearNovedadHorario = async (req, res) => {
  try {
    const nuevaNovedad = await Novedades_Horarios.create(req.body);
    res.json({ status: 'success', data: nuevaNovedad });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.actualizarNovedadHorario = async (req, res) => {
  try {
    const { id } = req.params;

    const novedad = await Novedades_Horarios.findByPk(id);
    if (!novedad) {
      return res.status(404).json({ message: "Novedad no encontrada" });
    }

    // Validar si faltan menos de 3 horas para la hora de inicio
    const ahora = new Date();
    const fechaHoraInicio = new Date(`${novedad.Fecha}T${novedad.Hora_Inicio}`);

    const diferencia = fechaHoraInicio - ahora;
    const tresHoras = 3 * 60 * 60 * 1000;

    if (diferencia < tresHoras) {
      return res.status(403).json({
        message: "No se puede modificar la novedad porque faltan menos de 3 horas para la hora de inicio.",
      });
    }

    await Novedades_Horarios.update(req.body, {
      where: { Id_Novedades_Horarios: id }
    });

    return res.status(200).json({ message: "Novedad actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar novedad:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.eliminarNovedadHorario = async (req, res) => {
  try {
    const id = req.params.id;
    const novedad = await Novedades_Horarios.findByPk(id);

    if (!novedad) {
      return res.status(404).json({ status: 'error', message: 'Novedad de horario no encontrada' });
    }

    await Novedades_Horarios.destroy({ where: { Id_Novedades_Horarios: id } });
    res.json({ status: 'success', message: 'Novedad de horario eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerNovedadesPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const novedades = await Novedades_Horarios.findAll({
      where: { Fecha: fecha }
    });
    res.json({ status: 'success', data: novedades });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener novedades por fecha' });
  }
};

exports.obtenerNovedadesPorRangoFechas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.params;
    const novedades = await Novedades_Horarios.findAll({
      where: {
        Fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      }
    });
    res.json({ status: 'success', data: novedades });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener novedades por rango de fechas' });
  }
};
