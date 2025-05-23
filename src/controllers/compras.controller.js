const { 
  Compras, 
  Detalle_Compra_Insumos, 
  Insumos, 
  Detalle_Compra_Productos,
  Detalle_Compra_Tallas,
  Productos,
  Producto_Tallas,
  Tallas
} = require('../models');

// Crear una nueva compra
exports.crearCompra = async (req, res) => {
  try {
    const nuevaCompra = await Compras.create(req.body)

    res.json({ status: 'success', data: nuevaCompra });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obtener todas las compras
exports.obtenerCompras = async (req, res) => {
  try {
    const compras = await Compras.findAll();
    res.json({ status: 'success', data: compras });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obtener una compra por ID
exports.obtenerCompraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compras.findByPk(id);

    if (!compra) {
      res.status(404).json({ status:'error', message: "Compra no encontrada." });
    }

    res.json({ status: 'success', data: compra });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerCompraConDetalles = async (req, res) => {
  const { id } = req.params;

  try {
const compra = await Compras.findByPk(id, {
  include: [
    { model: Detalle_Compra_Insumos, as: "Detalle_Compra_Insumos" },
    { model: Detalle_Compra_Productos, as: "Detalle_Compra_Productos" },
    { 
      model: Detalle_Compra_Tallas, 
      as: "Detalle_Compra_Tallas",
      include: [
        { model: Productos, as: "Id_Productos_Producto" },
        { model: Tallas, as: "Id_Tallas_Talla" }
      ]
    }
  ]
});

    if (!compra) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    res.json(compra);
  } catch (error) {
    console.error('Error al obtener detalles de la compra:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


// Actualizar el estado de una compra (solo de 1 a 0)

exports.cambiarEstadoCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const compra = await Compras.findByPk(id);

    if (!compra) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Compra no encontrada.' 
      });
    }

    if (compra.Estado === false) {
      return res.status(400).json({
        status: 'error', 
        message: 'La compra ya está inactiva. No se puede volver a activar.'
      });
    }

    // Validar insumos
    const detallesInsumos = await Detalle_Compra_Insumos.findAll({
      where: { Id_Compras: id }
    });

    for (const detalle of detallesInsumos) {
      const insumo = await Insumos.findByPk(detalle.Id_Insumos);
      if (!insumo) {
        return res.status(404).json({ 
          status: 'error', 
          message: `Insumo con ID ${detalle.Id_Insumos} no encontrado.` 
        });
      }
      if (insumo.Stock < detalle.Cantidad) {
        return res.status(400).json({
          status: 'error',
          message: `No se puede anular la compra porque el insumo "${insumo.Nombre || insumo.id}" no tiene suficiente stock.`
        });
      }
    }

    // Validar productos
    const detallesProductos = await Detalle_Compra_Productos.findAll({
      where: { Id_Compras: id }
    });

    for (const detalle of detallesProductos) {
      const producto = await Productos.findByPk(detalle.Id_Productos);
      if (!producto) {
        return res.status(404).json({
          status: 'error',
          message: `Producto con ID ${detalle.Id_Productos} no encontrado.`
        });
      }
      if (producto.Stock < detalle.Cantidad) {
        return res.status(400).json({
          status: 'error',
          message: `El producto "${producto.Nombre || producto.id}" no tiene suficiente stock para revertir.`
        });
      }
    }

    // Validar tallas
    const detallesTallas = await Detalle_Compra_Tallas.findAll({
      where: { Id_Compras: id }
    });

    for (const detalle of detallesTallas) {
      const productoTalla = await Producto_Tallas.findOne({
        where: {
          Id_Productos: detalle.Id_Productos,
          Id_Tallas: detalle.Id_Tallas
        }
      });

      if (!productoTalla) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró la talla del producto con Id_Productos ${detalle.Id_Productos} e Id_Tallas ${detalle.Id_Tallas}.`
        });
      }

      if (productoTalla.Stock < detalle.Cantidad) {
        return res.status(400).json({
          status: 'error',
          message: `La talla del producto con Id_Productos ${detalle.Id_Productos} e Id_Tallas ${detalle.Id_Tallas} no tiene suficiente stock para revertir.`
        });
      }
    }

    // Revertir stock insumos
    for (const detalle of detallesInsumos) {
      const insumo = await Insumos.findByPk(detalle.Id_Insumos);
      insumo.Stock -= detalle.Cantidad;
      await insumo.save();
    }

    // Revertir stock productos
    for (const detalle of detallesProductos) {
      const producto = await Productos.findByPk(detalle.Id_Productos);
      producto.Stock -= detalle.Cantidad;
      await producto.save();
    }

    // Revertir stock tallas
    for (const detalle of detallesTallas) {
      const productoTalla = await Producto_Tallas.findOne({
        where: {
          Id_Productos: detalle.Id_Productos,
          Id_Tallas: detalle.Id_Tallas
        }
      });

      if (productoTalla) {
        productoTalla.Stock -= detalle.Cantidad;
        await productoTalla.save();
      }
    }

    // Cambiar estado de la compra
    compra.Estado = false;
    await compra.save();

    res.status(200).json({
      status: 'success',
      mensaje: 'Compra desactivada y stock revertido correctamente.',
      compra
    });

  } catch (error) {
    console.error('Error al desactivar compra:', error);
    res.status(500).json({ status: 'error', message: 'Error al desactivar la compra.' });
  }
};



