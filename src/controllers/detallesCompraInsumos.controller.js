const { Detalle_Compra_Insumos, Insumos, Compras} = require('../models')


exports.crearDetalleCompraInsumo = async (req, res) => {
  try {
    const { Id_Compras, Id_Insumos, Cantidad, Subtotal } = req.body;

    if (!Id_Compras || !Id_Insumos || !Cantidad || !Subtotal) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const Precio_ml = parseFloat((Subtotal / Cantidad).toFixed(2));

    // Crear el detalle de compra
    const nuevoDetalle = await Detalle_Compra_Insumos.create({
      Id_Compras,
      Id_Insumos,
      Cantidad,
      Precio_ml,
      Subtotal
    });

    // Actualizar el stock del insumo
    const insumo = await Insumos.findByPk(Id_Insumos);
    if (!insumo) {
      return res.status(404).json({ error: 'Insumo no encontrado.' });
    }

    insumo.Stock += Cantidad;
    await insumo.save();

    // Sumar el subtotal al total de la compra
    const compra = await Compras.findByPk(Id_Compras);
    if (!compra) {
      return res.status(404).json({ error: 'Compra no encontrada.' });
    }

    compra.Total = parseFloat((parseFloat(compra.Total) + parseFloat(Subtotal)).toFixed(2));
    await compra.save();

    res.status(201).json({
      mensaje: 'Detalle creado, stock actualizado y total de compra incrementado correctamente.',
      detalle: nuevoDetalle
    });

  } catch (error) {
    console.error('Error al crear detalle de compra:', error);
    res.status(500).json({ error: 'Error del servidor.' });
  }
};
