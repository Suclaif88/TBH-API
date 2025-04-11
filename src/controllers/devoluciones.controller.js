const db = require('../models');
const Devoluciones = db.Devoluciones;

exports.getAll = async (req, res) => {
  try {
    const devoluciones = await Devoluciones.findAll();
    res.json(devoluciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las devoluciones', details: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const devolucion = await Devoluciones.findByPk(req.params.id);
    if (!devolucion) {
      return res.status(404).json({ error: 'Devolución no encontrada' });
    }
    res.json(devolucion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la devolución', details: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevaDevolucion = await Devoluciones.create(req.body);
    res.status(201).json(nuevaDevolucion);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la devolución', details: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Devoluciones.update(req.body, {
      where: { Id_Devoluciones: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).json({ error: 'Devolución no encontrada o sin cambios' });
    }
    res.json({ message: 'Devolución actualizada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la devolución', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Devoluciones.destroy({
      where: { Id_Devoluciones: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).json({ error: 'Devolución no encontrada' });
    }
    res.json({ message: 'Devolución eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la devolución', details: error.message });
  }
};
