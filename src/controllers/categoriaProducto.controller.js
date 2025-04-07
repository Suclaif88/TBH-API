const { Categoria_Productos } = require('../models'); // Ajusta el path según la ubicación de tus modelos

// Obtener todas las categorías
exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria_Productos.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

// Obtener una categoría por ID
exports.obtenerCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria_Productos.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
  try {
    const { Nombre, Descripcion } = req.body;
    const nuevaCategoria = await Categoria_Productos.create({ Nombre, Descripcion });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

// Actualizar una categoría existente
exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion } = req.body;
    const categoria = await Categoria_Productos.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    categoria.Nombre = Nombre;
    categoria.Descripcion = Descripcion;
    await categoria.save();
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria_Productos.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    await categoria.destroy();
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};
