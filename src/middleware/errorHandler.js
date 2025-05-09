module.exports = {
  notFoundHandler: (req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'Ruta de la API no encontrada :('
    });
  },

  errorHandler: (err, req, res, next) => {
    console.error('El error es:', err.stack);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos. Verifique los campos.'
      });
    }

    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Por favor, inicie sesión.'
      });
    }

    // Error de entrada duplicada se pueden agregar más errores
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'El recurso que está intentando crear ya existe.'
      });
    }

    if (err.statusCode === 422) {
      return res.status(422).json({
        success: false,
        message: 'Los datos enviados no se pueden procesar. Verifique los valores.'
      });
    }

    if (err.statusCode === 502) {
      return res.status(502).json({
        success: false,
        message: 'Error de puerta de enlace: El servidor upstream no respondió correctamente.'
      });
    }

    if (err.statusCode === 503) {
      return res.status(503).json({
        success: false,
        message: 'Servicio no disponible. Por favor, inténtelo más tarde.'
      });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      success: false,
      message
    });
  }
};
