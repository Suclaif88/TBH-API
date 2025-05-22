const {
  Detalle_Compra_Productos,
  Detalle_Compra_Tallas,
  Productos,
  Producto_Tallas,
  Categoria_Productos,
  Compras
} = require('../models');

exports.crearDetalleCompraProducto = async (req, res) => {
  const { Id_Compras, Id_Productos, Cantidad, Subtotal, tallas } = req.body;

  try {
    const producto = await Productos.findByPk(Id_Productos, {
      include: { model: Categoria_Productos, as: 'categoria' }
    });

    if (!producto) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
    }

    const compra = await Compras.findByPk(Id_Compras);
    if (!compra) {
      return res.status(404).json({ status: 'error', message: 'Compra no encontrada.' });
    }

    // Calcular precio unitario
    const Precio_Unitario = parseFloat((Subtotal / Cantidad).toFixed(2));

    // Insertar detalle de compra (producto)
    await Detalle_Compra_Productos.create({
      Id_Compras,
      Id_Productos,
      Cantidad,
      Precio_Unitario,
      Subtotal
    });

    // Actualizar precio de compra y stock general
    producto.Precio_Compra = Precio_Unitario;
    producto.Stock += Cantidad;
    await producto.save();

    // Actualizar el total de la compra
    compra.Total += Subtotal;
    await compra.save();

    // Si el producto tiene tallas
    if (producto.categoria?.Es_Ropa) {
      if (!Array.isArray(tallas) || tallas.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El producto requiere información de tallas.'
        });
      }

      let totalTallaStock = 0;

      for (const talla of tallas) {
        const { Id_Producto_Tallas, Cantidad: CantidadTalla } = talla;
        totalTallaStock += CantidadTalla;

        // Buscar el registro de Producto_Tallas por ID directo
        const productoTalla = await Producto_Tallas.findByPk(Id_Producto_Tallas);

        if (!productoTalla) {
          return res.status(404).json({
            status: 'error',
            message: `No se encontró Producto_Talla con ID ${Id_Producto_Tallas}`
          });
        }

        // Insertar detalle de compra por talla
        await Detalle_Compra_Tallas.create({
          Id_Compras,
          Id_Productos,
          Id_Tallas: productoTalla.Id_Tallas,
          Id_Producto_Tallas,
          Cantidad: CantidadTalla
        });

        // Actualizar stock por talla
        productoTalla.Stock += CantidadTalla;
        await productoTalla.save();
      }

      // Validar que el stock por tallas coincide con el stock general del producto
      if (totalTallaStock !== producto.Stock) {
        return res.status(400).json({
          status: 'error',
          message: 'El stock total por tallas no coincide con el stock general del producto.'
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Detalle de compra registrado correctamente y total actualizado.'
    });

  } catch (error) {
    console.error('Error al agregar detalle de compra:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al registrar el detalle de compra.'
    });
  }
};
