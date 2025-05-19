const { Compras } = require('../models');

// Crear una nueva compra
exports.crearCompra = async (req, res) => {
  try {
    const nuevaCompra = await Compras.create(req.body)

    res.status(201).json(nuevaCompra);
  } catch (error) {
    console.error("Error al crear compra:", error);
    res.status(500).json({ error: "Error al crear la compra." });
  }
};

// Obtener todas las compras
exports.obtenerCompras = async (req, res) => {
  try {
    const compras = await Compras.findAll();
    res.status(200).json(compras);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    res.status(500).json({ error: "Error al obtener las compras." });
  }
};

// Obtener una compra por ID
exports.obtenerCompraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compras.findByPk(id);

    if (!compra) {
      return res.status(404).json({ error: "Compra no encontrada." });
    }

    res.status(200).json(compra);
  } catch (error) {
    console.error("Error al obtener compra:", error);
    res.status(500).json({ error: "Error al obtener la compra." });
  }
};

// Actualizar el estado de una compra (solo de 1 a 0)
exports.cambiarEstadoCompra = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await Compras.findByPk(id);

    if (!compra) {
      return res.status(404).json({ error: "Compra no encontrada." });
    }

    if (compra.Estado === false) {
      return res.status(400).json({
        error: "La compra ya está inactiva. No se puede volver a activar."
      });
    }

    compra.Estado = false;
    await compra.save();

    res.status(200).json({
      mensaje: "Compra desactivada correctamente.",
      compra
    });

  } catch (error) {
    console.error("Error al cambiar estado de compra:", error);
    res.status(500).json({ error: "Error al cambiar el estado de la compra." });
  }
};


