const { Router } = require('express');
const {
agregarImagenServicio,
obtenerImagenesPorServicio

} = require('../controllers/servicio_imagen.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);


router.post('/', agregarImagenServicio);
router.get('/:id', obtenerImagenesPorServicio);


module.exports = router;
