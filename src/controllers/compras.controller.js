const { 
  Compras, 
  Detalle_Compra_Insumos, 
  Insumos, 
  Detalle_Compra_Productos,
  Detalle_Compra_Tallas,
  Productos,
  Producto_Tallas,
  Tallas,
  Categoria_Productos
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

exports.crearDetalles = async (req, res) => {
    const { Id_Compras, Id_Productos, Id_Insumos, Cantidad, Subtotal, tallas } = req.body;

    try {
        const compra = await Compras.findByPk(Id_Compras);
        if (!compra) {
            return res.status(404).json({ status: 'error', message: 'Compra no encontrada.' });
        }

        // CASO 1: INSUMOS
        if (Id_Insumos) {
            if (!Cantidad || !Subtotal) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios para insumos.' });
            }

            const Precio_ml = parseFloat((Subtotal / Cantidad).toFixed(2));

            const nuevoDetalle = await Detalle_Compra_Insumos.create({
                Id_Compras,
                Id_Insumos,
                Cantidad,
                Precio_ml,
                Subtotal
            });

            const insumo = await Insumos.findByPk(Id_Insumos);
            if (!insumo) {
                return res.status(404).json({ error: 'Insumo no encontrado.' });
            }

            insumo.Stock += Cantidad;
            await insumo.save();

            compra.Total = parseFloat((parseFloat(compra.Total) + parseFloat(Subtotal)).toFixed(2));
            await compra.save();

            return res.status(201).json({
                mensaje: 'Detalle de insumo creado correctamente.',
                detalle: nuevoDetalle
            });
        }

        // CASO 2: PRODUCTOS
        if (Id_Productos) {
            if (!Cantidad || !Subtotal) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios para productos.' });
            }

            const producto = await Productos.findByPk(Id_Productos, {
                include: { model: Categoria_Productos, as: 'Id_Categoria_Producto_Categoria_Producto' }
            });

            if (!producto) {
                return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
            }

            const Precio_Unitario = parseFloat((Subtotal / Cantidad).toFixed(2));

            let CantidadFinal = Cantidad;

            // Si el producto requiere tallas, validar primero
            if (producto.Id_Categoria_Producto_Categoria_Producto?.Es_Ropa) {
                if (!Array.isArray(tallas) || tallas.length === 0) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'El producto requiere información de tallas.'
                    });
                }

                const totalTallaStock = tallas.reduce((acc, t) => acc + t.Cantidad, 0);

                if (totalTallaStock !== Cantidad) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'El stock total por tallas no coincide con el stock general del producto.'
                    });
                }

                CantidadFinal = totalTallaStock; // asegurar coherencia

                // Insertar detalles por talla solo después de validar
                for (const talla of tallas) {
                    const { Id_Producto_Tallas, Cantidad: CantidadTalla } = talla;

                    const productoTalla = await Producto_Tallas.findByPk(Id_Producto_Tallas);
                    if (!productoTalla) {
                        return res.status(404).json({
                            status: 'error',
                            message: `No se encontró Producto_Talla con ID ${Id_Producto_Tallas}`
                        });
                    }

                    await Detalle_Compra_Tallas.create({
                        Id_Compras,
                        Id_Productos,
                        Id_Tallas: productoTalla.Id_Tallas,
                        Id_Producto_Tallas,
                        Cantidad: CantidadTalla
                    });

                    productoTalla.Stock += CantidadTalla;
                    await productoTalla.save();
                }
            }

            // Insertar detalle de producto
            await Detalle_Compra_Productos.create({
                Id_Compras,
                Id_Productos,
                Cantidad: CantidadFinal,
                Precio_Unitario,
                Subtotal
            });

            producto.Precio_Compra = Precio_Unitario;
            producto.Stock += CantidadFinal;
            await producto.save();

            compra.Total = parseFloat((parseFloat(compra.Total) + parseFloat(Subtotal)).toFixed(2));
            await compra.save();

            return res.status(200).json({
                status: 'success',
                message: 'Detalle de producto registrado correctamente.'
            });
        }

        return res.status(400).json({ error: 'Datos insuficientes para procesar el detalle de compra.' });

    } catch (error) {
        console.error('Error al crear detalle de compra:', error);
        return res.status(500).json({ status: 'error', message: 'Error del servidor.' });
    }
};



