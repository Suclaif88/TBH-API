const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/auth.routes');
const insumoRoutes = require('./routes/insumo.routes.js');
const categoriaInsumoRoutes = require('./routes/categoriaInsumo.routes');
const ventasRoutes = require('./routes/ventas.routes');
const rolesRoutes = require('./routes/roles.routes');
const rolesPermisosRoutes = require('./routes/rolesPermisos.routes.js');
const Permisos = require('./routes/permisos.routes.js');
const usuariosRoutes = require('./routes/usuario.routes.js');
const empleadosRoutes = require('./routes/empleados.routes.js')
const devolucionesRoutes = require('./routes/devoluciones.routes.js')

const categoriaProductosRoutes = require('./routes/categoriaProductos.routes.js');
const ProductosRoutes = require('./routes/productos.routes.js');
const ImagenesRoutes = require('./routes/imagenes.routes.js')
const correoRoutes = require('./routes/correo.routes.js')


router.use('/auth', authRoutes);
router.use('/insumos', insumoRoutes);
router.use('/productos', ProductosRoutes)
router.use('/categoria-producto', categoriaProductosRoutes);
router.use('/categoria-insumo', categoriaInsumoRoutes);
router.use('/ventas', ventasRoutes);
router.use('/roles', rolesRoutes);
router.use('/rolesPermisos', rolesPermisosRoutes);
router.use('/permisos', Permisos);
router.use('/usuarios', usuariosRoutes);
router.use('/empleados',empleadosRoutes);
router.use('/devoluciones',devolucionesRoutes);

router.use('/imagenes', ImagenesRoutes);

router.use('/correo', correoRoutes);


module.exports = router;
