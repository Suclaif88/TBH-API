const { Router } = require('express');
const {
agregarImagenProducto,
obtenerImagenesPorProducto
} = require('../controllers/producto_Imagen.controller');
const verificarToken = require('../middleware/authMiddleware');

const router = Router();

router.use(verificarToken);

router.get('/:id', obtenerImagenesPorProducto);
router.post('/', agregarImagenProducto);



module.exports = router;
