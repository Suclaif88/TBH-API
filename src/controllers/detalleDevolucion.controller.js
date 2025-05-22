const { Detalle_Devolucion } = require('../models');

exports.crearDetalleDevolucion = async (req, res) => {
  try {
    const nuevoDetalle = await Detalle_Devolucion.create(req.body);
    res.json({ status: 'success', data: nuevoDetalle });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.listarDetalleDevoluciones = async (req, res) => {
  try {
    const detalles = await Detalle_Devolucion.findAll();
    res.json({ status: 'success', data: detalles });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerDetalleDevolucionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await Detalle_Devolucion.findByPk(id);
    if (!detalle) {
      return res.status(404).json({ status: 'error', message: 'Detalle de devolución no encontrado' });
    }
    res.json({ status: 'success', data: detalle });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.actualizarDetalleDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await Detalle_Devolucion.findOne({ where: { Id_Detalle_Devolucion: id } });
    if (!detalle) {
      return res.status(404).json({ status: 'error', message: 'Detalle de devolución no encontrado' });
    }
    await Detalle_Devolucion.update(req.body, { where: { Id_Detalle_Devolucion: id } });
    res.json({ status: 'success', message: 'Detalle de devolución actualizado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.eliminarDetalleDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await Detalle_Devolucion.findOne({ where: { Id_Detalle_Devolucion: id } });
    if (!detalle) {
      return res.status(404).json({ status: 'error', message: 'Detalle de devolución no encontrado' });
    }
    await Detalle_Devolucion.destroy({ where: { Id_Detalle_Devolucion: id } });
    res.json({ status: 'success', message: 'Detalle de devolución eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
