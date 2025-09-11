const { Router } = require('express');
const {
    crearAgendamientos,
    crearAgendamientoPublico,
    obtenerAgendamientosPorFecha,
    obtenerAgendamientosPorId,
    actualizarAgendamientos,
    eliminarAgendamientos
} = require('../controllers/agendamiento.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

// Ruta pública - solo requiere token de autenticación
router.post('/publico', verificarToken, crearAgendamientoPublico);

// Rutas protegidas - requieren autenticación y autorización
router.use(verificarToken);
router.use(autorizar('Agendamiento'));

// CRUD
router.post('/', crearAgendamientos);
router.get('/fecha/:fecha', obtenerAgendamientosPorFecha);
router.get('/:id', obtenerAgendamientosPorId);
router.put('/:id', actualizarAgendamientos);
router.delete('/:id', eliminarAgendamientos);

module.exports = router;
