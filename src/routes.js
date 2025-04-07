const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/auth.routes');
const insumoRoutes = require('./routes/insumo.routes.js');
const categoriaInsumoRoutes = require('./routes/categoriaInsumo.routes');
const ventasRoutes = require('./routes/ventas.routes');
const rolesRoutes = require('./routes/roles.routes');
const usuariosRoutes = require('./routes/usuario.routes.js');


const categoriaProductosRoutes = require('./routes/categoriaProductos.routes');


router.use('/auth', authRoutes);
router.use('/insumos', insumoRoutes);
router.use('/categoria-insumo', categoriaInsumoRoutes);
router.use('/categoria-producto', categoriaProductosRoutes);
router.use('/ventas', ventasRoutes);
router.use('/roles', rolesRoutes);
router.use('/usuarios', usuariosRoutes);


module.exports = router;
