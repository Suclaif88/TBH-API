const { Categoria_Productos, Tallas, Producto_Tallas } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las Tallas 
exports.obtenerTallas = async (req, res) => {
  try {
    const tallas = await Tallas.findAll({
      include: {
        model: Categoria_Productos,
        as: 'Id_Categoria_Producto_Categoria_Producto',
        attributes: ['Nombre']
      }
    });

    const resultado = tallas.map(talla => ({
      Id_Tallas: talla.Id_Tallas,
      Nombre: talla.Nombre,
      Estado: talla.Estado,
      Id_Categoria_Producto: talla.Id_Categoria_Producto,
      Categoria: talla.Id_Categoria_Producto_Categoria_Producto?.Nombre || null
    }));

    res.json({ status: 'success', data: resultado });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obtener una Talla por ID
exports.obtenerTallaPorId = async (req, res) => {
  try {
    const talla = await Tallas.findByPk(req.params.id);
    if (talla) {
      res.json({ status: 'success', data: talla });
    } else {
      res.status(404).json({ status: 'error', message: 'Talla no Encontrada' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Crear nueva Talla
exports.crearTalla = async (req, res) => {
  try {
    const { Nombre, Id_Categoria_Producto } = req.body;

    const tallaExistente = await Tallas.findOne({
      where: {
        Nombre,
        Id_Categoria_Producto
      }
    });

    if (tallaExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe una talla con ese nombre en esta categoría.'
      });
    }

    const nuevaTalla = await Tallas.create(req.body);
    res.json({ status: 'success', data: nuevaTalla });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Actualizar una Talla
exports.actualizarTalla = async (req, res) => {
  try {
    const id = req.params.id;
    const { Nombre, Id_Categoria_Producto } = req.body;

    const talla = await Tallas.findByPk(id);
    if (!talla) {
      return res.status(404).json({
        status: 'error',
        message: 'Talla no encontrada'
      });
    }

    const tallaDuplicada = await Tallas.findOne({
      where: {
        Nombre,
        Id_Categoria_Producto,
        Id_Tallas: { [Op.ne]: id }
      }
    });

    if (tallaDuplicada) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe otra talla con ese nombre en esta categoría.'
      });
    }

    const datosSinCambios =
      talla.Nombre === Nombre &&
      talla.Id_Categoria_Producto === Id_Categoria_Producto &&
      talla.Estado === req.body.Estado;

    if (datosSinCambios) {
      return res.json({
        status: 'success',
        message: 'No hubo cambios en los datos',
        data: talla
      });
    }

    await talla.update(req.body);
    res.json({ status: 'success', data: talla });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Eliminar una Talla
exports.eliminarTalla = async (req, res) => {
  try {
    const id = req.params.id;

    const talla = await Tallas.findByPk(id);
    if (!talla) {
      return res.status(404).json({ status: 'error', message: 'Talla no Encontrada' });
    }

    const existeRelacion = await Producto_Tallas.findOne({
      where: { Id_Tallas: id }
    });

    if (existeRelacion) {
      return res.status(400).json({
          status: 'error',
          message: 'No se puede eliminar la Talla porque está asociado a uno o más productos'
      });
    }

    await talla.destroy();
    res.json({ status: 'Succes', mensaje: 'Talla Eliminada Permanentemente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Cambiar el estado de una talla (activar o desactivar)
exports.cambiarEstadoTalla = async (req, res) => {
  try {
    const id = req.params.id;

    const talla = await Tallas.findByPk(id);
    if (!talla) {
      return res.status(404).json({ status: 'error', message: 'Talla no Encontrada' });
    }

    talla.Estado = !talla.Estado;
    await talla.save();

    res.json({
      status: 'success',
      mensaje: `Talla ${talla.Estado ? 'activada' : 'desactivada'} correctamente`,
      talla
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

