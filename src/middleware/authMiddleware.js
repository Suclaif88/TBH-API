require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../../logger');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        const message = `Acceso denegado: No se proporcionó un token para la ruta ${req.originalUrl}`;
        logger.warn(message);
        return res.status(401).json({ message: 'Acceso denegado.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        const message = `Acceso autorizado a la ruta ${req.originalUrl} para el usuario ${req.user.id}`;
        logger.info(message);
        next();
    } catch (error) {
        const message = `Token inválido en la ruta ${req.originalUrl}: ${error.message}`;
        logger.error(message);
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = authMiddleware;
