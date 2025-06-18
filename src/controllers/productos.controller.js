const { Categoria_Productos, Productos, Tamano, Producto_Tamano, Producto_Tamano_Insumos } = require('../models');

exports.crearProducto = async (req, res) => {
  const t = await Productos.sequelize.transaction(); // iniciar transacción opcional
  try {
    const { InsumoExtra, ...productoData } = req.body;

    const nuevoProducto = await Productos.create(productoData, { transaction: t });

    // Solo si es perfume y se mandó un insumo adicional
    if (InsumoExtra && productoData.Id_Categoria_Producto) {
      const categoria = await Categoria_Productos.findByPk(productoData.Id_Categoria_Producto);

      if (categoria?.Nombre === 'Perfume') {
        const tamanos = await Tamano.findAll({
          where: { Estado: true }
        });

        for (const tamano of tamanos) {
          // Obtener el Producto_Tamano relacionado
          const productoTamano = await Producto_Tamano.findOne({
            where: {
              Id_Productos: nuevoProducto.Id_Productos,
              Id_Tamano: tamano.Id_Tamano
            }
          });

          if (productoTamano) {
            await Producto_Tamano_Insumos.create({
              Id_Producto_Tamano: productoTamano.Id_Producto_Tamano,
              Id_Insumos: InsumoExtra.Id_Insumos,
              Cantidad_Consumo: InsumoExtra.Cantidad_Consumo
            }, { transaction: t });
          }
        }
      }
    }

    await t.commit();
    res.json({ status: 'success', data: nuevoProducto });

  } catch (error) {
    await t.rollback();
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