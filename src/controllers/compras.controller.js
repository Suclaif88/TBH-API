const { Compras, Detalle_Compra_Insumos, Insumos } = require('../models');

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

    // Obtener los detalles de la compra
    const detalles = await Detalle_Compra_Insumos.findAll({
      where: { Id_Compras: id }
    });

    // Validar que cada insumo tenga suficiente stock para revertir
    for (const detalle of detalles) {
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

    // Revertir el stock de cada insumo
    for (const detalle of detalles) {
      const insumo = await Insumos.findByPk(detalle.Id_Insumos);

      insumo.Stock -= detalle.Cantidad;
      await insumo.save();
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


