const { Compras } = require('../models');

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
  try {
    const { id } = req.params;

    const compra = await Compras.findByPk(id);

    if (!compra) {
      res.status(404).json({ 
        status:'error', 
        message: "Compra no encontrada." 
      });
    }

    if (compra.Estado === false) {
      return res.status(400).json({
        status:'error', 
        message: "La compra ya está inactiva. No se puede volver a activar."
      });
    }

    compra.Estado = false;
    await compra.save();

    res.status(200).json({
      status: 'success',
      mensaje: "Compra desactivada correctamente.",
      compra
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


