const { Categoria_Productos, Productos } = require('../models');


// Obtener todas las categorías (sin importar el estado)
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria_Productos.findAll();
    res.json({ status: 'success', data: categorias });
  } catch (error) {
    es.status(500).json({ status: 'error', message: error.message });
  }
};


// Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria_Productos.findByPk(req.params.id);
    if (categoria) {
      res.json({ status: 'success', data: categoria });
    } else {
      res.status(404).json({ status: 'error', message: 'Categoria no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerCategoriasActivas = async (req, res) => {
try {
    const categoriasActivas = await Categoria_Productos.findAll({
    where: {
        Estado: true
    }
    });
    res.json({ status: 'success', data: categoriasActivas });
} catch (error) {
    res.status(404).json({ status: 'error', message: 'Error al obtener Categorias Activas' });
}
};

// Crear nueva categoría
exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await Categoria_Productos.create(req.body);
    res.json({ status: 'success', data: nuevaCategoria });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Categoria_Productos.update(req.body, {
      where: { Id_Categoria_Producto: id }
    });

    if (updated) {
      const categoriaActualizada = await Categoria_Productos.findByPk(id);
      res.json({ status: 'success', data: categoriaActualizada });
    } else {
      res.status(404).json({ status: 'error', message: 'Categoria no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Eliminar una Categoria
exports.eliminarCategoria = async (req, res) => {
  const id = req.params.id;

  try {
    const categoria = await Categoria_Productos.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría no encontrada.' });
    }

    const productos = await Productos.findOne({ where: { Id_Categoria_Producto: id } });
    if (productos) {
      return res.status(400).json({ status: 'error', message: 'No se puede eliminar: la categoría tiene productos registrados.' });
    }

    await Categoria_Productos.destroy({ where: { Id_Categoria_Producto: id } });
    return res.json({ status: 'success', mensaje: 'Categoría eliminada correctamente.' });

  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor.' });
  }
};


// Cambiar el estado de una categoría (activar o desactivar)
exports.cambiarEstadoCategoria = async (req, res) => {
  try {
    const id = req.params.id;

    const categoria = await Categoria_Productos.findByPk(id);
    if (!categoria) {
      res.status(404).json({ status: 'Error', message: 'Categoría no encontrada' });
    }

    categoria.Estado = !categoria.Estado;
    await categoria.save();

    res.json({
      status: 'success',
      mensaje: `Categoría ${categoria.Estado ? 'activada' : 'desactivada'} correctamente`,
      categoria
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// Obtener categorías que SÍ son ropa
exports.obtenerCategoriasRopa = async (req, res) => {
  try {
    const categoriasRopa = await Categoria_Productos.findAll({
      where: {
        Es_Ropa: true,
        Estado: true
      }
    });
    res.json({ status: 'success', data: categoriasRopa });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obtener categorías que NO son ropa
exports.obtenerCategoriasNoRopa = async (req, res) => {
  try {
    const categoriasNoRopa = await Categoria_Productos.findAll({
      where: {
        Es_Ropa: false,
        Estado: true
      }
    });
    res.json({ status: 'success', data: categoriasNoRopa });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
