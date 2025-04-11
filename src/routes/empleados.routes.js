const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadosController');

router.get('/', empleadosController.getAll);
router.get('/:documento', empleadosController.getById);
router.post('/', empleadosController.create);
router.put('/:documento', empleadosController.update);
router.delete('/:documento', empleadosController.delete);

module.exports = router;
