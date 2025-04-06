const { Insumos } = require('../models');

exports.crearInsumo = async (req, res) => {
  try {
    const nuevoInsumo = await Insumos.create(req.body);
    res.json({ status: 'success', data: nuevoInsumo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarInsumos = async (req, res) => {
  try {
    const insumos = await Insumos.findAll();
    res.json({ status: 'success', data: insumos });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumos.findOne({ where: { Id_Insumos: id } });
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }
    await Insumos.update(req.body, { where: { Id_Insumos: id } });
    res.json({ status: 'success', message: 'Insumo actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumos.findOne({ where: { Id_Insumos: id } });
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }
    await Insumos.destroy({ where: { Id_Insumos: id } });
    res.json({ status: 'success', message: 'Insumo eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

