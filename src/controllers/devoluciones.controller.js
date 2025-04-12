const { Devoluciones } = require('../models');

exports.crearDevolucion = async (req, res) => {
  try {
    const nuevaDevolucion = await Devoluciones.create(req.body);
    res.json({ status: 'success', data: nuevaDevolucion });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarDevoluciones = async (req, res) => {
  try {
    const devoluciones = await Devoluciones.findAll();
    res.json({ status: 'success', data: devoluciones });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.obtenerDevolucionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const devolucion = await Devoluciones.findByPk(id);
    if (!devolucion) {
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }
    res.json({ status: 'success', data: devolucion });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const devolucion = await Devoluciones.findOne({ where: { Id_Devoluciones: id } });
    if (!devolucion) {
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }
    await Devoluciones.update(req.body, { where: { Id_Devoluciones: id } });
    res.json({ status: 'success', message: 'Devolución actualizada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const devolucion = await Devoluciones.findOne({ where: { Id_Devoluciones: id } });
    if (!devolucion) {
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }
    await Devoluciones.destroy({ where: { Id_Devoluciones: id } });
    res.json({ status: 'success', message: 'Devolución eliminada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
