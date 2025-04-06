const sequelize = require('../config/db');
const { Sequelize } = require('sequelize');

const initUsuarios = require('./usuarios');
const initRoles = require('./roles');
const initPermisos = require('./permisos');
const initRolPermiso = require('./rol_permiso');
const initAgendamientos = require('./Agendamientos');
const initAgendamientoServicios = require('./Agendamiento_Servicios');
const initCategoriaInsumos = require('./Categoria_Insumos');
const initCategoriaProductos = require('./Categoria_Productos');
const initClientes = require('./Clientes');
const initCompras = require('./Compras');
const initDetalleCompraTallas = require('./Detalle_Compra_Tallas');
const initDetalleInsumos = require('./Detalle_Insumos');
const initDetalleProductos = require('./Detalle_Productos');
const initDetalleVentaCambioTallas = require('./Detalle_Venta_Cambio_Tallas');
const initDetalleVentaProductos = require('./Detalle_Venta_Productos');
const initDetalleVentaTallas = require('./Detalle_Venta_Tallas');
const initDetalleVentaTamano = require('./Detalle_Venta_Tamano');
const initDevoluciones = require('./Devoluciones');
const initEmpleados = require('./Empleados');
const initImagenes = require('./Imagenes');
const initInsumos = require('./Insumos');
const initNovedadesHorarios = require('./Novedades_Horarios');
const initProductoImagen = require('./Producto_Imagen');
const initProductoTallas = require('./Producto_Tallas');
const initProductoTamano = require('./Producto_Tamano');
const initProductoTamanoInsumos = require('./Producto_Tamano_Insumos');
const initProductos = require('./Productos');
const initProveedores = require('./Proveedores');
const initServicioImagen = require('./Servicio_Imagen');
const initServicios = require('./Servicios');
const initTallas = require('./Tallas');
const initTamano = require('./Tamano');
const initVentas = require('./Ventas');
const initVentasCambio = require('./Ventas_Cambio');

const Usuarios = initUsuarios(sequelize, Sequelize.DataTypes);
const Roles = initRoles(sequelize, Sequelize.DataTypes);
const Permisos = initPermisos(sequelize, Sequelize.DataTypes);
const RolPermiso = initRolPermiso(sequelize, Sequelize.DataTypes);
const Agendamientos = initAgendamientos(sequelize, Sequelize.DataTypes);
const AgendamientoServicios = initAgendamientoServicios(sequelize, Sequelize.DataTypes);
const CategoriaInsumos = initCategoriaInsumos(sequelize, Sequelize.DataTypes);
const CategoriaProductos = initCategoriaProductos(sequelize, Sequelize.DataTypes);
const Clientes = initClientes(sequelize, Sequelize.DataTypes);
const Compras = initCompras(sequelize, Sequelize.DataTypes);
const DetalleCompraTallas = initDetalleCompraTallas(sequelize, Sequelize.DataTypes);
const DetalleInsumos = initDetalleInsumos(sequelize, Sequelize.DataTypes);
const DetalleProductos = initDetalleProductos(sequelize, Sequelize.DataTypes);
const DetalleVentaCambioTallas = initDetalleVentaCambioTallas(sequelize, Sequelize.DataTypes);
const DetalleVentaProductos = initDetalleVentaProductos(sequelize, Sequelize.DataTypes);
const DetalleVentaTallas = initDetalleVentaTallas(sequelize, Sequelize.DataTypes);
const DetalleVentaTamano = initDetalleVentaTamano(sequelize, Sequelize.DataTypes);
const Devoluciones = initDevoluciones(sequelize, Sequelize.DataTypes);
const Empleados = initEmpleados(sequelize, Sequelize.DataTypes);
const Imagenes = initImagenes(sequelize, Sequelize.DataTypes);
const Insumos = initInsumos(sequelize, Sequelize.DataTypes);
const NovedadesHorarios = initNovedadesHorarios(sequelize, Sequelize.DataTypes);
const ProductoImagen = initProductoImagen(sequelize, Sequelize.DataTypes);
const ProductoTallas = initProductoTallas(sequelize, Sequelize.DataTypes);
const ProductoTamano = initProductoTamano(sequelize, Sequelize.DataTypes);
const ProductoTamanoInsumos = initProductoTamanoInsumos(sequelize, Sequelize.DataTypes);
const Productos = initProductos(sequelize, Sequelize.DataTypes);
const Proveedores = initProveedores(sequelize, Sequelize.DataTypes);
const ServicioImagen = initServicioImagen(sequelize, Sequelize.DataTypes);
const Servicios = initServicios(sequelize, Sequelize.DataTypes);
const Tallas = initTallas(sequelize, Sequelize.DataTypes);
const Tamano = initTamano(sequelize, Sequelize.DataTypes);
const Ventas = initVentas(sequelize, Sequelize.DataTypes);
const VentasCambio = initVentasCambio(sequelize, Sequelize.DataTypes);

sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

module.exports = {
  Usuarios,
  Roles,
  Permisos,
  RolPermiso,
  Agendamientos,
  AgendamientoServicios,
  CategoriaInsumos,
  CategoriaProductos,
  Clientes,
  Compras,
  DetalleCompraTallas,
  DetalleInsumos,
  DetalleProductos,
  DetalleVentaCambioTallas,
  DetalleVentaProductos,
  DetalleVentaTallas,
  DetalleVentaTamano,
  Devoluciones,
  Empleados,
  Imagenes,
  Insumos,
  NovedadesHorarios,
  ProductoImagen,
  ProductoTallas,
  ProductoTamano,
  ProductoTamanoInsumos,
  Productos,
  Proveedores,
  ServicioImagen,
  Servicios,
  Tallas,
  Tamano,
  Ventas,
  VentasCambio,
};
//Si llegaste aqui es porque tienes muy mala suerte y algun modelo no se cargo correctamente que mal....