const {
Detalle_Compra_Insumos,
Insumos,
Detalle_Compra_Productos,
Detalle_Compra_Tallas,
Productos,
Producto_Tallas,
Categoria_Productos,
Compras
} = require('../models');

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

