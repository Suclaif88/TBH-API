const { Categoria_Insumos, Insumos } = require('../models');

exports.crearCategoria = async (req, res) => {
  try {
    const { Nombre } = req.body;

    const categoriaExistente = await Categoria_Insumos.findOne({ where: { Nombre } });

    if (categoriaExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe una categoría con ese nombre.',
      });
    }

    const nuevaCategoria = await Categoria_Insumos.create({
      ...req.body,
      Estado: 1,
    });

    res.json({ status: 'success', data: nuevaCategoria });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria_Insumos.findAll({
      include: [
        {
          model: Insumos,
          as: 'Insumos',
        }
      ],
    });
    res.json({ status: 'success', data: categorias });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria_Insumos.findByPk(id, {
      include: [
        {
          model: Insumos,
          as: 'Insumos',
        },
      ],
    });

    if (!categoria) {
      return res.status(404).json({
        status: 'error',
        message: `No se encontró categoría con id ${id}`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: categoria,
    });
  } catch (err) {
    console.error(`Error al obtener categoría con id ${req.params.id}:`, err);
    res.status(500).json({
      status: 'error',
      message: 'Error del servidor al obtener la categoría.',
    });
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

exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria_Insumos.findOne({ where: { Id_Categoria_Insumos: id } });
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' });
    }

    const insumosAsociados = await Insumos.count({ where: { Id_Categoria_Insumos: id } });
    if (insumosAsociados > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede eliminar la categoría porque tiene insumos asociados',
      });
    }

    await Categoria_Insumos.destroy({ where: { Id_Categoria_Insumos: id } });
    res.json({ status: 'success', message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error interno en el servidor' });
  }
};
