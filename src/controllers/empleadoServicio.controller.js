const { Empleado_Servicio } = require('../models');

exports.crearEmpleadoServicio = async (req, res) => {
  try {
    const nuevaRelacion = await Empleado_Servicio.create(req.body);
    res.status(201).json({ status: 'success', data: nuevaRelacion });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarEmpleadoServicios = async (req, res) => {
  try {
    const relaciones = await Empleado_Servicio.findAll();
    res.json({ status: 'success', data: relaciones });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.obtenerEmpleadoServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const relacion = await Empleado_Servicio.findByPk(id);

    if (!relacion) {
      return res.status(404).json({ status: 'error', message: 'Relación no encontrada' });
    }

    res.json({ status: 'success', data: relacion });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarEmpleadoServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await Empleado_Servicio.update(req.body, {
      where: { Id_Empleado_Servicio: id }
    });

    if (actualizados === 0) {
      return res.status(404).json({ status: 'error', message: 'Relación no encontrada o sin cambios' });
    }

    res.json({ status: 'success', message: 'Relación actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarEmpleadoServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await Empleado_Servicio.destroy({
      where: { Id_Empleado_Servicio: id }
    });

    if (eliminados === 0) {
      return res.status(404).json({ status: 'error', message: 'Relación no encontrada' });
    }

    res.json({ status: 'success', message: 'Relación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
