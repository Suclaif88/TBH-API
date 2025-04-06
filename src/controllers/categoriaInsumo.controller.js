const { CategoriaInsumos } = require('../models');

exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await CategoriaInsumos.create(req.body);
    res.json({ status: 'success', data: nuevaCategoria });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaInsumos.findAll();
    res.json({ status: 'success', data: categorias });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaInsumos.findOne({ where: { Id_Categoria_Insumos: id } });
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría de insumo no encontrada' });
    }
    await CategoriaInsumos.update(req.body, { where: { Id_Categoria_Insumos: id } });
    res.json({ status: 'success', message: 'Categoría de insumo actualizada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaInsumos.findOne({ where: { Id_Categoria_Insumos: id } });
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría de insumo no encontrada' });
    }
    await CategoriaInsumos.destroy({ where: { Id_Categoria_Insumos: id } });
    res.json({ status: 'success', message: 'Categoría de insumo eliminada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

