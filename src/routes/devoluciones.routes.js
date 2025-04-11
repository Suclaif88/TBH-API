const express = require('express');
const router = express.Router();
const devolucionesController = require('../controllers/devolucionesController');

router.get('/', devolucionesController.getAll);
router.get('/:id', devolucionesController.getById);
router.post('/', devolucionesController.create);
router.put('/:id', devolucionesController.update);
router.delete('/:id', devolucionesController.delete);

module.exports = router;
