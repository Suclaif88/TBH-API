require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    const message = `Acceso denegado: No se proporcionó token en cookie para la ruta ${req.originalUrl}`;
    logger.warn(message);
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const message = `Acceso autorizado a ${req.originalUrl} para el usuario ${req.user.id}`;
    logger.info(message);
    next();
  } catch (error) {
    const message = `Token inválido en cookie en la ruta ${req.originalUrl}: ${error.message}`;
    logger.error(message);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;
