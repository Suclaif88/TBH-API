const { Router } = require('express');
const {
    crearAgendamientos,
    crearAgendamientoPublico,
    obtenerAgendamientosPorFecha, // Nueva función para obtener por fecha
    obtenerAgendamientosPorId,
    eliminarAgendamientos
    // Las otras funciones también pueden ir aquí
} = require('../controllers/agendamiento.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

// Ruta pública - solo requiere token de autenticación
router.post('/publico', verificarToken, crearAgendamientoPublico);

// Rutas protegidas - requieren autenticación y autorización
router.use(verificarToken);
router.use(autorizar('Agendamiento'));

// Ruta para crear un agendamiento (POST)
router.post('/', crearAgendamientos);

// Nueva ruta para obtener agendamientos por fecha
router.get('/fecha/:fecha', obtenerAgendamientosPorFecha);

// ... otras rutas (obtener por ID, eliminar, etc.)
router.get('/:id', obtenerAgendamientosPorId);
router.delete('/:id', eliminarAgendamientos);

module.exports = router;