const express = require('express');
const router = express.Router();

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.js');
const meRoutes = require('./routes/me.routes'); 
const logout = require('./routes/logout.routes.js')
const authRoutes = require('./routes/auth.routes');
const insumoRoutes = require('./routes/insumo.routes.js');
const categoriaInsumoRoutes = require('./routes/categoriaInsumo.routes');
const ventasRoutes = require('./routes/ventas.routes');
const clientesRoutes = require('./routes/clientes.routes.js');
const rolesRoutes = require('./routes/roles.routes');
const rolesPermisosRoutes = require('./routes/rolesPermisos.routes.js');
const Permisos = require('./routes/permisos.routes.js');
const usuariosRoutes = require('./routes/usuario.routes.js');
const empleadosRoutes = require('./routes/empleados.routes.js');
const devolucionesRoutes = require('./routes/devoluciones.routes.js');
const agendamientoRoutes= require('./routes/agendamiento.routes.js');
const serviciosRoutes= require ('./routes/servicios.routes.js' );
const novedadesRoutes= require ('./routes/novedades.routes.js');

const comprasRoutes = require ('./routes/compras.routes.js');
const detallesCompraInsumosRoutes = require ('./routes/detalleCompraInsumos.routes.js');
const proveedoresRoutes = require('./routes/proveedores.routes.js');
const categoriaProductosRoutes = require('./routes/categoriaProductos.routes.js');
const ProductosRoutes = require('./routes/productos.routes.js');
const ProductoImagenRoutes = require('./routes/producto-imagen.routes.js');
const tallasRoutes = require('./routes/tallas.routes.js');
const tamanoRoutes = require('./routes/tamano.routes.js');
const ImagenesRoutes = require('./routes/imagenes.routes.js');
const correoRoutes = require('./routes/correo.routes.js');
const detalledevolucionesRoutes = require('./routes/detalleDevolucion.routes.js')
const empleadoServicioRoutes = require ('./routes/empleadoServicio.routes.js')
const servicioImagenRoutes = require ('./routes/servicio_imagen-routes.js')

router.use('/auth', authRoutes);
router.use('/me', meRoutes);   
router.use('/logout', logout)
router.use('/insumos', insumoRoutes);

router.use ('/compras', comprasRoutes);
router.use ('/detalleCompraInsumos', detallesCompraInsumosRoutes);
router.use('/proveedores', proveedoresRoutes);
router.use('/productos', ProductosRoutes);
router.use('/producto-imagen', ProductoImagenRoutes);

router.use('/tallas', tallasRoutes);
router.use('/tamano', tamanoRoutes);
router.use('/categoria-producto', categoriaProductosRoutes);
router.use('/categoria-insumo', categoriaInsumoRoutes);
router.use('/ventas', ventasRoutes);
router.use('/roles', rolesRoutes);
router.use('/rolesPermisos', rolesPermisosRoutes);
router.use('/permisos', Permisos);
router.use('/usuarios', usuariosRoutes);
router.use('/empleados',empleadosRoutes);
router.use('/devoluciones',devolucionesRoutes);
router.use('/clientes', clientesRoutes);
router.use('/agendamiento', agendamientoRoutes);
router.use('/servicios', serviciosRoutes);
router.use('/novedades', novedadesRoutes)
router.use('/detalledevolucion',detalledevolucionesRoutes)
router.use('/empleadoservicios', empleadoServicioRoutes)
router.use('/servicio-imagen', servicioImagenRoutes)

router.use('/imagenes', ImagenesRoutes);

router.use('/correo', correoRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

module.exports = router;