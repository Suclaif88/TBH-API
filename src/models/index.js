const sequelize = require('./config/db');
const { Sequelize } = require('sequelize');

const initUsuarios = require('./models/usuarios');
const initRoles = require('./models/roles');
const initPermisos = require('./models/permisos');
const initRolPermiso = require('./models/rol_permiso');
const initAgendamientos = require('./models/Agendamientos');
const initAgendamientoServicios = require('./models/Agendamiento_Servicios');
const initCategoriaInsumos = require('./models/Categoria_Insumos');
const initCategoriaProductos = require('./models/Categoria_Productos');
const initClientes = require('./models/Clientes');
const initCompras = require('./models/Compras');
const initDetalleCompraTallas = require('./models/Detalle_Compra_Tallas');
const initDetalleInsumos = require('./models/Detalle_Insumos');
const initDetalleProductos = require('./models/Detalle_Productos');
const initDetalleVentaCambioTallas = require('./models/Detalle_Venta_Cambio_Tallas');
const initDetalleVentaProductos = require('./models/Detalle_Venta_Productos');
const initDetalleVentaTallas = require('./models/Detalle_Venta_Tallas');
const initDetalleVentaTamano = require('./models/Detalle_Venta_Tamano');
const initDevoluciones = require('./models/Devoluciones');
const initEmpleados = require('./models/Empleados');
const initImagenes = require('./models/Imagenes');
const initInsumos = require('./models/Insumos');
const initNovedadesHorarios = require('./models/Novedades_Horarios');
const initProductoImagen = require('./models/Producto_Imagen');
const initProductoTallas = require('./models/Producto_Tallas');
const initProductoTamano = require('./models/Producto_Tamano');
const initProductoTamanoInsumos = require('./models/Producto_Tamano_Insumos');
const initProductos = require('./models/Productos');
const initProveedores = require('./models/Proveedores');
const initServicioImagen = require('./models/Servicio_Imagen');
const initServicios = require('./models/Servicios');
const initTallas = require('./models/Tallas');
const initTamano = require('./models/Tamano');
const initVentas = require('./models/Ventas');
const initVentasCambio = require('./models/Ventas_Cambio');

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

  const models = {
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
  

  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

  module.exports = models;



//Si llegaste aqui es porque tienes muy mala suerte y algun modelo no se cargo correctamente que mal....