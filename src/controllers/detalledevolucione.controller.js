const { Detalle_Devolucion } = require('../models');

exports.ListarDetalleDevoluciones = async (req, res) => {
    try {
        const detalleDevolucion = await Detalle_Devolucion.findAll();
        res.json({ status: 'success', data: detalleDevolucion });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.obtenerdetallesDevolucionporId = async (req, res) => {
    try {
        const { id } = req.params;
        const detalleDevolucion = await Detalle_Devolucion.findByPk(id);

        if (!detalleDevolucion) {
            return res.status(404).json({
                status: 'error',
                message: 'Detalle de la devolución no encontrada'
            });
        }

        res.json({ status: 'success', data: detalleDevolucion });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
