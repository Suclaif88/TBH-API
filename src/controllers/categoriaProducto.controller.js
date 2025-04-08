const { CategoriaProductos } = require('../models'); // Ajusta el path según la ubicación de tus modelos

// Obtener todas las categorías
exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaProductos.findAll();
    res.json({ status: 'success', data: categorias });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


// Obtener una categoría por ID
exports.obtenerCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaProductos.findByPk(id);
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
    const nuevaCategoria = await CategoriaProductos.create(req.body);
    res.json({ status: 'success', data: nuevaCategoria });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// Actualizar una categoría existente
exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Descripcion } = req.body;
    const categoria = await CategoriaProductos.findByPk(id);
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
    const categoria = await CategoriaProductos.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    await categoria.destroy();
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};
