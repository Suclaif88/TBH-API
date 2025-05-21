const { Productos } = require('../models');

exports.crearProducto = async (req, res) => {
try {
    const nuevoProducto = await Productos.create(req.body);
    res.json({ status: 'success', data: nuevoProducto });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};

exports.listarProductos = async (req, res) => {
try {
    const productos = await Productos.findAll();
    res.json({ status: 'success', data: productos });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};

exports.obtenerProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Productos.findByPk(id);
    if (!producto) {
      res.status(404).json({ status:'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', data: producto });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
try {
    const { id } = req.params;
    const producto = await Productos.findOne({ where: { Id_Productos: id } });
    if (!producto) {
      res.status(404).json({ status: 'error', message: 'Prodcuto no encontrado' });
    }
      await Productos.update(req.body, { where: { Id_Productos: id } });
      res.json({ status: 'success', message: 'Producto actualizado', data: producto });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};


exports.eliminarProducto = async (req, res) => {
try {
    const { id } = req.params;
    const producto = await Productos.findOne({ where: { Id_Productos: id } });
    if (!producto) {
    return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    await Productos.destroy({ where: { Id_Productos: id } });
    res.json({ status: 'success', message: 'Producto eliminado' });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};

exports.cambiarEstadoProducto = async (req, res) => {
  try {
    const id = req.params.id;

    const producto = await Productos.findByPk(id);
    if (!producto) {
      return res.status(404).json({ status:'error', message: 'Producto no Encontrado' });
    }

    producto.Estado = !producto.Estado;
    await producto.save();

    res.json({
      status: 'success',
      mensaje: `Producto ${producto.Estado ? 'activado' : 'desactivado'} correctamente`,
      producto
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};