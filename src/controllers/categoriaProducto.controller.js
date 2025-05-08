const { Categoria_Productos } = require('../models');


// Obtener todas las categorías (sin importar el estado)
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria_Productos.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};


// Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria_Productos.findByPk(req.params.id);
    if (categoria) {
      res.json(categoria);
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

// Crear nueva categoría
exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await Categoria_Productos.create(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error al crear categoría', detalles: error });
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
      res.json(categoriaActualizada);
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar categoría', detalles: error });
  }
};

// Eliminar (lógicamente) una categoría
exports.eliminarCategoria = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Categoria_Productos.update({ Estado: false }, {
      where: { Id_Categoria_Producto: id }
    });

    if (updated) {
      res.json({ mensaje: 'Categoría desactivada correctamente' });
    } else {
      res.status(404).json({ error: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
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
    res.json(categoriasRopa);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías de ropa' });
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
    res.json(categoriasNoRopa);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías que no son de ropa' });
  }
};
