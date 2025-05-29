const { Categoria_Insumos } = require('../models');

exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await Categoria_Insumos.create({
      ...req.body,
      Estado: 0,
    });
    res.json({ status: 'success', data: nuevaCategoria });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria_Insumos.findAll();
    res.json({ status: 'success', data: categorias });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria_Insumos.findOne({ where: { Id_Categoria_Insumos: id } });
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría de insumo no encontrada' });
    }
    await Categoria_Insumos.update(req.body, { where: { Id_Categoria_Insumos: id } });
    res.json({ status: 'success', message: 'Categoría de insumo actualizada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria_Insumos.findOne({ where: { Id_Categoria_Insumos: id } });
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría de insumo no encontrada' });
    }
    await Categoria_Insumos.destroy({ where: { Id_Categoria_Insumos: id } });
    res.json({ status: 'success', message: 'Categoría de insumo eliminada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria_Insumos.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' });
    }

    categoria.Estado = !categoria.Estado;
    await categoria.save();

    res.json({ status: 'success', data: categoria });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};