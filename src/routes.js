const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/auth.routes');
const insumoRoutes = require('./routes/insumo.routes.js');
const categoriaInsumoRoutes = require('./routes/categoriaInsumo.routes');

router.use('/auth', authRoutes);
router.use('/insumos', insumoRoutes);
router.use('/categoria-insumo', categoriaInsumoRoutes);

module.exports = router;
