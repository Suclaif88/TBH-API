const { Novedades_Horarios } = require('../models');

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
    const id = req.params.id;
    const [updated] = await Novedades_Horarios.update(req.body, {
      where: { Id_Novedades_Horarios: id }
    });

    if (updated) {
      const novedadActualizada = await Novedades_Horarios.findByPk(id);
      res.json({ status: 'success', data: novedadActualizada });
    } else {
      res.status(404).json({ status: 'error', message: 'Novedad de horario no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
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
          [Sequelize.Op.between]: [fechaInicio, fechaFin]
        }
      }
    });
    res.json({ status: 'success', data: novedades });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener novedades por rango de fechas' });
  }
};