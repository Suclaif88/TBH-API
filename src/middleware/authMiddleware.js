require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const authMiddleware = (req, res, next) => {
  // Buscar token en cookies y headers (compatibilidad con diferentes configuraciones)
  const token = req.cookies?.token || 
                req.cookies?._vercel_jwt || 
                req.cookies?.jwt ||
                req.headers?.authorization?.replace('Bearer ', '');

  // Debug: Log de información de la request
  console.log(`Auth middleware - URL: ${req.originalUrl}, Method: ${req.method}, Origin: ${req.headers.origin}`);
  console.log('Cookies recibidas:', req.cookies);
  console.log('Token encontrado:', token ? 'SÍ' : 'NO');

  if (!token) {
    if (req.originalUrl === "/api/me") {
      req.user = null;
      logger.info(`Acceso sin sesión a ${req.originalUrl}`);
      return next();
    }
    const message = `Acceso denegado: No se proporcionó token en cookie para la ruta ${req.originalUrl}`;
    logger.warn(message);
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const message = `Acceso autorizado a ${req.originalUrl} para el usuario ${req.user.id}`;
    logger.info(message);
    next();
  } catch (error) {
    if (req.originalUrl === "/api/me") {
      req.user = null;
      logger.info(`Token inválido/expirado en ${req.originalUrl}, respondiendo como visitante`);
      return next();
    }
    const message = `Token inválido en cookie en la ruta ${req.originalUrl}: ${error.message}`;
    logger.error(message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;