const logger = require('../../logger');

module.exports = {
  notFoundHandler: (req, res, next) => {
    const message = `Ruta de la API no encontrada: ${req.originalUrl}`;
    logger.warn(message);
    res.status(404).json({
      success: false,
      message: 'Ruta de la API no encontrada :('
    });
  },

  errorHandler: (err, req, res, next) => {
    logger.error(`Error en ${req.method} ${req.originalUrl}: ${err.stack || err.message}`);

    if (err.name === 'ValidationError') {
      logger.error(`Datos inválidos en ${req.method} ${req.originalUrl}: ${err.message}`);
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos. Verifique los campos.'
      });
    }

    if (err.name === 'UnauthorizedError') {
      logger.error(`No autorizado en ${req.method} ${req.originalUrl}: ${err.message}`);
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Por favor, inicie sesión.'
      });
    }

    if (err.code === 'ER_DUP_ENTRY' || (err.parent && err.parent.code === 'ER_DUP_ENTRY')) {
      logger.error(`Entrada duplicada en ${req.method} ${req.originalUrl}: ${err.message}`);
      return res.status(409).json({
        success: false,
        message: 'El recurso que está intentando crear ya existe.'
      });
    }


    if (err.statusCode === 422) {
      logger.error(`Error de datos en ${req.method} ${req.originalUrl}: ${err.message}`);
      return res.status(422).json({
        success: false,
        message: 'Los datos enviados no se pueden procesar. Verifique los valores.'
      });
    }

    if (err.statusCode === 502) {
      logger.error(`Error de puerta de enlace en ${req.method} ${req.originalUrl}: ${err.message}`);
      return res.status(502).json({
        success: false,
        message: 'Error de puerta de enlace: El servidor upstream no respondió correctamente.'
      });
    }

    if (err.statusCode === 503) {
      logger.error(`Servicio no disponible en ${req.method} ${req.originalUrl}: ${err.message}`);
      return res.status(503).json({
        success: false,
        message: 'Servicio no disponible. Por favor, inténtelo más tarde.'
      });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`Error interno en ${req.method} ${req.originalUrl}: ${message}`);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};
