const { Productos } = require('../models');

exports.crearProducto = async (req, res) => {
try {
    const nuevoProducto = await Productos.create(req.body);
    res.json({ status: 'success', data: nuevoProducto });
} catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
}
};

exports.listarProductos = async (req, res) => {
try {
    const productos = await Productos.findAll();
    res.json({ status: 'success', data: productos });
} catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
}
};

exports.obtenerProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Productos.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrada' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

exports.actualizarProducto = async (req, res) => {
try {
    const { id } = req.params;
    const Producto = await Productos.findOne({ where: { Id_Productos: id } });
    if (!Producto) {
    return res.status(404).json({ status: 'error', message: 'Prodcuto no encontrado' });
    }
    await Productos.update(req.body, { where: { Id_Productos: id } });
    res.json({ status: 'success', message: 'Producto actualizado' });
} catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
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
} catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
}
};

