const { sequelize } = require("../config/db");
const cliProgress = require('cli-progress');

var DataTypes = require("sequelize").DataTypes;
var _Agendamiento_Servicios = require("./Agendamiento_Servicios");
var _Agendamientos = require("./Agendamientos");
var _Categoria_Insumos = require("./Categoria_Insumos");
var _Categoria_Productos = require("./Categoria_Productos");
var _Clientes = require("./Clientes");
var _Compras = require("./Compras");
var _Detalle_Compra_Insumos = require("./Detalle_Compra_Insumos");
var _Detalle_Compra_Productos = require("./Detalle_Compra_Productos");
var _Detalle_Compra_Tallas = require("./Detalle_Compra_Tallas");
var _Detalle_Devolucion = require("./Detalle_Devolucion");
var _Detalle_Venta = require("./Detalle_Venta");
var _Devoluciones = require("./Devoluciones");
var _Empleados = require("./Empleados");
var _Imagenes = require("./Imagenes");
var _Insumos = require("./Insumos");
var _Novedades_Horarios = require("./Novedades_Horarios");
var _Permisos = require("./Permisos");
var _Producto_Imagen = require("./Producto_Imagen");
var _Producto_Tallas = require("./Producto_Tallas");
var _Producto_Tamano = require("./Producto_Tamano");
var _Producto_Tamano_Insumos = require("./Producto_Tamano_Insumos");
var _Productos = require("./Productos");
var _Proveedores = require("./Proveedores");
var _Rol_Permiso = require("./Rol_Permiso");
var _Roles = require("./Roles");
var _Servicio_Imagen = require("./Servicio_Imagen");
var _Servicios = require("./Servicios");
var _Tallas = require("./Tallas");
var _Tamano = require("./Tamano");
var _Tamano_Insumos = require("./Tamano_Insumos");
var _Usuarios = require("./Usuarios");
var _Ventas = require("./Ventas");

const modelDefinitions = [
  { name: 'Agendamiento_Servicios', func: _Agendamiento_Servicios },
  { name: 'Agendamientos', func: _Agendamientos },
  { name: 'Categoria_Insumos', func: _Categoria_Insumos },
  { name: 'Categoria_Productos', func: _Categoria_Productos },
  { name: 'Clientes', func: _Clientes },
  { name: 'Compras', func: _Compras },
  { name: 'Detalle_Compra_Insumos', func: _Detalle_Compra_Insumos },
  { name: 'Detalle_Compra_Productos', func: _Detalle_Compra_Productos },
  { name: 'Detalle_Compra_Tallas', func: _Detalle_Compra_Tallas },
  { name: 'Detalle_Devolucion', func: _Detalle_Devolucion },
  { name: 'Detalle_Venta', func: _Detalle_Venta },
  { name: 'Devoluciones', func: _Devoluciones },
  { name: 'Empleados', func: _Empleados },
  { name: 'Imagenes', func: _Imagenes },
  { name: 'Insumos', func: _Insumos },
  { name: 'Novedades_Horarios', func: _Novedades_Horarios },
  { name: 'Permisos', func: _Permisos },
  { name: 'Producto_Imagen', func: _Producto_Imagen },
  { name: 'Producto_Tallas', func: _Producto_Tallas },
  { name: 'Producto_Tamano', func: _Producto_Tamano },
  { name: 'Producto_Tamano_Insumos', func: _Producto_Tamano_Insumos },
  { name: 'Productos', func: _Productos },
  { name: 'Proveedores', func: _Proveedores },
  { name: 'Rol_Permiso', func: _Rol_Permiso },
  { name: 'Roles', func: _Roles },
  { name: 'Servicio_Imagen', func: _Servicio_Imagen },
  { name: 'Servicios', func: _Servicios },
  { name: 'Tallas', func: _Tallas },
  { name: 'Tamano', func: _Tamano },
  { name: 'Tamano_Insumos', func: _Tamano_Insumos },
  { name: 'Usuarios', func: _Usuarios },
  { name: 'Ventas', func: _Ventas }
];

const bar = new cliProgress.SingleBar({
  format: 'Cargando modelos | \x1b[31m {bar} \x1b[0m | {percentage}% || {value}/{total} Modelos sincronizados',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
  speed: 50
}, cliProgress.Presets.shades_classic);

bar.start(modelDefinitions.length, 0);

function initModels(sequelize) {
  const models = {};
  
  modelDefinitions.forEach((modelDef, index) => {
    models[modelDef.name] = modelDef.func(sequelize, DataTypes);
    bar.update(index + 1);
  });

  models.Agendamiento_Servicios.belongsTo(models.Agendamientos, { as: "Id_Agendamientos_Agendamiento", foreignKey: "Id_Agendamientos"});
  models.Agendamientos.hasOne(models.Agendamiento_Servicios, { as: "Agendamiento_Servicio", foreignKey: "Id_Agendamientos"});
  models.Ventas.belongsTo(models.Agendamientos, { as: "Id_Agendamientos_Agendamiento", foreignKey: "Id_Agendamientos"});
  models.Agendamientos.hasOne(models.Ventas, { as: "Ventum", foreignKey: "Id_Agendamientos"});
  models.Insumos.belongsTo(models.Categoria_Insumos, { as: "Id_Categoria_Insumos_Categoria_Insumo", foreignKey: "Id_Categoria_Insumos"});
  models.Categoria_Insumos.hasMany(models.Insumos, { as: "Insumos", foreignKey: "Id_Categoria_Insumos"});
  models.Productos.belongsTo(models.Categoria_Productos, { as: "Id_Categoria_Producto_Categoria_Producto", foreignKey: "Id_Categoria_Producto"});
  models.Categoria_Productos.hasMany(models.Productos, { as: "Productos", foreignKey: "Id_Categoria_Producto"});
  models.Tallas.belongsTo(models.Categoria_Productos, { as: "Id_Categoria_Producto_Categoria_Producto", foreignKey: "Id_Categoria_Producto"});
  models.Categoria_Productos.hasMany(models.Tallas, { as: "Tallas", foreignKey: "Id_Categoria_Producto"});
  models.Agendamientos.belongsTo(models.Clientes, { as: "Documento_Cliente_Cliente", foreignKey: "Documento_Cliente"});
  models.Clientes.hasMany(models.Agendamientos, { as: "Agendamientos", foreignKey: "Documento_Cliente"});
  models.Devoluciones.belongsTo(models.Clientes, { as: "Documento_Cliente_Cliente", foreignKey: "Documento_Cliente"});
  models.Clientes.hasMany(models.Devoluciones, { as: "Devoluciones", foreignKey: "Documento_Cliente"});
  models.Ventas.belongsTo(models.Clientes, { as: "Documento_Cliente_Cliente", foreignKey: "Documento_Cliente"});
  models.Clientes.hasMany(models.Ventas, { as: "Venta", foreignKey: "Documento_Cliente"});
  models.Detalle_Compra_Insumos.belongsTo(models.Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  models.Compras.hasMany(models.Detalle_Compra_Insumos, { as: "Detalle_Compra_Insumos", foreignKey: "Id_Compras"});
  models.Detalle_Compra_Productos.belongsTo(models.Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  models.Compras.hasMany(models.Detalle_Compra_Productos, { as: "Detalle_Compra_Productos", foreignKey: "Id_Compras"});
  models.Detalle_Compra_Tallas.belongsTo(models.Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  models.Compras.hasMany(models.Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Compras"});
  models.Detalle_Devolucion.belongsTo(models.Detalle_Venta, { as: "Id_Detalle_Venta_Detalle_Ventum", foreignKey: "Id_Detalle_Venta"});
  models.Detalle_Venta.hasMany(models.Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Detalle_Venta"});
  models.Detalle_Devolucion.belongsTo(models.Devoluciones, { as: "Id_Devoluciones_Devolucione", foreignKey: "Id_Devoluciones"});
  models.Devoluciones.hasMany(models.Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Devoluciones"});
  models.Agendamientos.belongsTo(models.Empleados, { as: "Documento_Empleados_Empleado", foreignKey: "Documento_Empleados"});
  models.Empleados.hasMany(models.Agendamientos, { as: "Agendamientos", foreignKey: "Documento_Empleados"});
  models.Novedades_Horarios.belongsTo(models.Empleados, { as: "Documento_Empleados_Empleado", foreignKey: "Documento_Empleados"});
  models.Empleados.hasMany(models.Novedades_Horarios, { as: "Novedades_Horarios", foreignKey: "Documento_Empleados"});
  models.Ventas.belongsTo(models.Empleados, { as: "Documento_Empleados_Empleado", foreignKey: "Documento_Empleados"});
  models.Empleados.hasMany(models.Ventas, { as: "Venta", foreignKey: "Documento_Empleados"});
  models.Producto_Imagen.belongsTo(models.Imagenes, { as: "Id_Imagenes_Imagene", foreignKey: "Id_Imagenes"});
  models.Imagenes.hasMany(models.Producto_Imagen, { as: "Producto_Imagens", foreignKey: "Id_Imagenes"});
  models.Servicio_Imagen.belongsTo(models.Imagenes, { as: "Id_Imagenes_Imagene", foreignKey: "Id_Imagenes"});
  models.Imagenes.hasMany(models.Servicio_Imagen, { as: "Servicio_Imagens", foreignKey: "Id_Imagenes"});
  models.Detalle_Compra_Insumos.belongsTo(models.Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  models.Insumos.hasMany(models.Detalle_Compra_Insumos, { as: "Detalle_Compra_Insumos", foreignKey: "Id_Insumos"});
  models.Producto_Tamano_Insumos.belongsTo(models.Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  models.Insumos.hasMany(models.Producto_Tamano_Insumos, { as: "Producto_Tamano_Insumos", foreignKey: "Id_Insumos"});
  models.Tamano_Insumos.belongsTo(models.Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  models.Insumos.hasMany(models.Tamano_Insumos, { as: "Tamano_Insumos", foreignKey: "Id_Insumos"});
  models.Rol_Permiso.belongsTo(models.Permisos, { as: "Permiso", foreignKey: "Permiso_Id"});
  models.Permisos.hasMany(models.Rol_Permiso, { as: "Rol_Permisos", foreignKey: "Permiso_Id"});
  models.Detalle_Devolucion.belongsTo(models.Producto_Tallas, { as: "Id_Producto_Tallas_Producto_Talla", foreignKey: "Id_Producto_Tallas"});
  models.Producto_Tallas.hasMany(models.Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Producto_Tallas"});
  models.Detalle_Venta.belongsTo(models.Producto_Tallas, { as: "Id_Producto_Tallas_Producto_Talla", foreignKey: "Id_Producto_Tallas"});
  models.Producto_Tallas.hasMany(models.Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Producto_Tallas"});
  models.Producto_Tamano_Insumos.belongsTo(models.Producto_Tamano, { as: "Id_Producto_Tamano_Producto_Tamano", foreignKey: "Id_Producto_Tamano"});
  models.Producto_Tamano.hasMany(models.Producto_Tamano_Insumos, { as: "Producto_Tamano_Insumos", foreignKey: "Id_Producto_Tamano"});
  models.Detalle_Venta.belongsTo(models.Producto_Tamano_Insumos, { as: "Id_Producto_Tamano_Insumos_Producto_Tamano_Insumo", foreignKey: "Id_Producto_Tamano_Insumos"});
  models.Producto_Tamano_Insumos.hasMany(models.Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Producto_Tamano_Insumos"});
  models.Detalle_Compra_Productos.belongsTo(models.Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  models.Productos.hasMany(models.Detalle_Compra_Productos, { as: "Detalle_Compra_Productos", foreignKey: "Id_Productos"});
  models.Detalle_Compra_Tallas.belongsTo(models.Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  models.Productos.hasMany(models.Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Productos"});
  models.Detalle_Devolucion.belongsTo(models.Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  models.Productos.hasMany(models.Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Productos"});
  models.Detalle_Venta.belongsTo(models.Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  models.Productos.hasMany(models.Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Productos"});
  models.Producto_Imagen.belongsTo(models.Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  models.Productos.hasMany(models.Producto_Imagen, { as: "Producto_Imagens", foreignKey: "Id_Productos"});
  models.Producto_Tallas.belongsTo(models.Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  models.Productos.hasMany(models.Producto_Tallas, { as: "Producto_Tallas", foreignKey: "Id_Productos"});
  models.Producto_Tamano.belongsTo(models.Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  models.Productos.hasMany(models.Producto_Tamano, { as: "Producto_Tamanos", foreignKey: "Id_Productos"});
  models.Compras.belongsTo(models.Proveedores, { as: "Id_Proveedores_Proveedore", foreignKey: "Id_Proveedores"});
  models.Proveedores.hasMany(models.Compras, { as: "Compras", foreignKey: "Id_Proveedores"});
  models.Rol_Permiso.belongsTo(models.Roles, { as: "Rol", foreignKey: "Rol_Id"});
  models.Roles.hasMany(models.Rol_Permiso, { as: "Rol_Permisos", foreignKey: "Rol_Id"});
  models.Usuarios.belongsTo(models.Roles, { as: "Rol", foreignKey: "Rol_Id"});
  models.Roles.hasMany(models.Usuarios, { as: "Usuarios", foreignKey: "Rol_Id"});
  models.Agendamiento_Servicios.belongsTo(models.Servicios, { as: "Id_Servicios_Servicio", foreignKey: "Id_Servicios"});
  models.Servicios.hasMany(models.Agendamiento_Servicios, { as: "Agendamiento_Servicios", foreignKey: "Id_Servicios"});
  models.Servicio_Imagen.belongsTo(models.Servicios, { as: "Id_Servicios_Servicio", foreignKey: "Id_Servicios"});
  models.Servicios.hasMany(models.Servicio_Imagen, { as: "Servicio_Imagens", foreignKey: "Id_Servicios"});
  models.Detalle_Compra_Tallas.belongsTo(models.Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  models.Tallas.hasMany(models.Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Tallas"});
  models.Producto_Tallas.belongsTo(models.Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  models.Tallas.hasMany(models.Producto_Tallas, { as: "Producto_Tallas", foreignKey: "Id_Tallas"});
  models.Producto_Tamano.belongsTo(models.Tamano, { as: "Id_Tamano_Tamano", foreignKey: "Id_Tamano"});
  models.Tamano.hasMany(models.Producto_Tamano, { as: "Producto_Tamanos", foreignKey: "Id_Tamano"});
  models.Tamano_Insumos.belongsTo(models.Tamano, { as: "Id_Tamano_Tamano", foreignKey: "Id_Tamano"});
  models.Tamano.hasMany(models.Tamano_Insumos, { as: "Tamano_Insumos", foreignKey: "Id_Tamano"});
  models.Clientes.belongsTo(models.Usuarios, { as: "Documento_Cliente_Usuario", foreignKey: "Documento_Cliente"});
  models.Usuarios.hasOne(models.Clientes, { as: "Cliente", foreignKey: "Documento_Cliente"});
  models.Empleados.belongsTo(models.Usuarios, { as: "Documento_Empleados_Usuario", foreignKey: "Documento_Empleados"});
  models.Usuarios.hasOne(models.Empleados, { as: "Empleado", foreignKey: "Documento_Empleados"});
  models.Detalle_Venta.belongsTo(models.Ventas, { as: "Id_Ventas_Venta", foreignKey: "Id_Ventas"});
  models.Ventas.hasMany(models.Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Ventas"});

  bar.stop();

  return models;
}
const models = initModels(sequelize);
module.exports = models;
//Si llegaste aqui es porque tienes muy mala suerte y algun modelo no se cargo correctamente que mal....