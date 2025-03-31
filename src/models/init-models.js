var DataTypes = require("sequelize").DataTypes;
var _Agendamiento_Servicios = require("./Agendamiento_Servicios");
var _Agendamientos = require("./Agendamientos");
var _Categoria_Insumos = require("./Categoria_Insumos");
var _Categoria_Productos = require("./Categoria_Productos");
var _Clientes = require("./Clientes");
var _Compras = require("./Compras");
var _Detalle_Compra_Tallas = require("./Detalle_Compra_Tallas");
var _Detalle_Insumos = require("./Detalle_Insumos");
var _Detalle_Productos = require("./Detalle_Productos");
var _Detalle_Venta_Cambio_Tallas = require("./Detalle_Venta_Cambio_Tallas");
var _Detalle_Venta_Productos = require("./Detalle_Venta_Productos");
var _Detalle_Venta_Tallas = require("./Detalle_Venta_Tallas");
var _Detalle_Venta_Tamano = require("./Detalle_Venta_Tamano");
var _Devoluciones = require("./Devoluciones");
var _Empleados = require("./Empleados");
var _Imagenes = require("./Imagenes");
var _Insumos = require("./Insumos");
var _Novedades_Horarios = require("./Novedades_Horarios");
var _Producto_Imagen = require("./Producto_Imagen");
var _Producto_Tallas = require("./Producto_Tallas");
var _Producto_Tamano = require("./Producto_Tamano");
var _Producto_Tamano_Insumos = require("./Producto_Tamano_Insumos");
var _Productos = require("./Productos");
var _Proveedores = require("./Proveedores");
var _Servicio_Imagen = require("./Servicio_Imagen");
var _Servicios = require("./Servicios");
var _Tallas = require("./Tallas");
var _Tamano = require("./Tamano");
var _Ventas = require("./Ventas");
var _Ventas_Cambio = require("./Ventas_Cambio");

function initModels(sequelize) {
  var Agendamiento_Servicios = _Agendamiento_Servicios(sequelize, DataTypes);
  var Agendamientos = _Agendamientos(sequelize, DataTypes);
  var Categoria_Insumos = _Categoria_Insumos(sequelize, DataTypes);
  var Categoria_Productos = _Categoria_Productos(sequelize, DataTypes);
  var Clientes = _Clientes(sequelize, DataTypes);
  var Compras = _Compras(sequelize, DataTypes);
  var Detalle_Compra_Tallas = _Detalle_Compra_Tallas(sequelize, DataTypes);
  var Detalle_Insumos = _Detalle_Insumos(sequelize, DataTypes);
  var Detalle_Productos = _Detalle_Productos(sequelize, DataTypes);
  var Detalle_Venta_Cambio_Tallas = _Detalle_Venta_Cambio_Tallas(sequelize, DataTypes);
  var Detalle_Venta_Productos = _Detalle_Venta_Productos(sequelize, DataTypes);
  var Detalle_Venta_Tallas = _Detalle_Venta_Tallas(sequelize, DataTypes);
  var Detalle_Venta_Tamano = _Detalle_Venta_Tamano(sequelize, DataTypes);
  var Devoluciones = _Devoluciones(sequelize, DataTypes);
  var Empleados = _Empleados(sequelize, DataTypes);
  var Imagenes = _Imagenes(sequelize, DataTypes);
  var Insumos = _Insumos(sequelize, DataTypes);
  var Novedades_Horarios = _Novedades_Horarios(sequelize, DataTypes);
  var Producto_Imagen = _Producto_Imagen(sequelize, DataTypes);
  var Producto_Tallas = _Producto_Tallas(sequelize, DataTypes);
  var Producto_Tamano = _Producto_Tamano(sequelize, DataTypes);
  var Producto_Tamano_Insumos = _Producto_Tamano_Insumos(sequelize, DataTypes);
  var Productos = _Productos(sequelize, DataTypes);
  var Proveedores = _Proveedores(sequelize, DataTypes);
  var Servicio_Imagen = _Servicio_Imagen(sequelize, DataTypes);
  var Servicios = _Servicios(sequelize, DataTypes);
  var Tallas = _Tallas(sequelize, DataTypes);
  var Tamano = _Tamano(sequelize, DataTypes);
  var Ventas = _Ventas(sequelize, DataTypes);
  var Ventas_Cambio = _Ventas_Cambio(sequelize, DataTypes);

  Agendamiento_Servicios.belongsTo(Agendamientos, { as: "Id_Agendamientos_Agendamiento", foreignKey: "Id_Agendamientos"});
  Agendamientos.hasOne(Agendamiento_Servicios, { as: "Agendamiento_Servicio", foreignKey: "Id_Agendamientos"});
  Ventas.belongsTo(Agendamientos, { as: "Id_Agendamientos_Agendamiento", foreignKey: "Id_Agendamientos"});
  Agendamientos.hasOne(Ventas, { as: "Ventum", foreignKey: "Id_Agendamientos"});
  Insumos.belongsTo(Categoria_Insumos, { as: "Id_Categoria_Insumos_Categoria_Insumo", foreignKey: "Id_Categoria_Insumos"});
  Categoria_Insumos.hasMany(Insumos, { as: "Insumos", foreignKey: "Id_Categoria_Insumos"});
  Productos.belongsTo(Categoria_Productos, { as: "Id_Categoria_Producto_Categoria_Producto", foreignKey: "Id_Categoria_Producto"});
  Categoria_Productos.hasMany(Productos, { as: "Productos", foreignKey: "Id_Categoria_Producto"});
  Tallas.belongsTo(Categoria_Productos, { as: "Id_Categoria_Producto_Categoria_Producto", foreignKey: "Id_Categoria_Producto"});
  Categoria_Productos.hasMany(Tallas, { as: "Tallas", foreignKey: "Id_Categoria_Producto"});
  Agendamientos.belongsTo(Clientes, { as: "Documento_Cliente_Cliente", foreignKey: "Documento_Cliente"});
  Clientes.hasMany(Agendamientos, { as: "Agendamientos", foreignKey: "Documento_Cliente"});
  Ventas.belongsTo(Clientes, { as: "Documento_Cliente_Cliente", foreignKey: "Documento_Cliente"});
  Clientes.hasMany(Ventas, { as: "Venta", foreignKey: "Documento_Cliente"});
  Ventas_Cambio.belongsTo(Clientes, { as: "Documento_Cliente_Cliente", foreignKey: "Documento_Cliente"});
  Clientes.hasMany(Ventas_Cambio, { as: "Ventas_Cambios", foreignKey: "Documento_Cliente"});
  Detalle_Compra_Tallas.belongsTo(Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  Compras.hasMany(Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Compras"});
  Detalle_Insumos.belongsTo(Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  Compras.hasMany(Detalle_Insumos, { as: "Detalle_Insumos", foreignKey: "Id_Compras"});
  Detalle_Productos.belongsTo(Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  Compras.hasMany(Detalle_Productos, { as: "Detalle_Productos", foreignKey: "Id_Compras"});
  Devoluciones.belongsTo(Detalle_Venta_Tallas, { as: "Id_Detalle_Venta_Tallas_Detalle_Venta_Talla", foreignKey: "Id_Detalle_Venta_Tallas"});
  Detalle_Venta_Tallas.hasMany(Devoluciones, { as: "Devoluciones", foreignKey: "Id_Detalle_Venta_Tallas"});
  Ventas_Cambio.belongsTo(Devoluciones, { as: "Id_Devoluciones_Devolucione", foreignKey: "Id_Devoluciones"});
  Devoluciones.hasMany(Ventas_Cambio, { as: "Ventas_Cambios", foreignKey: "Id_Devoluciones"});
  Agendamientos.belongsTo(Empleados, { as: "Documento_Empleados_Empleado", foreignKey: "Documento_Empleados"});
  Empleados.hasMany(Agendamientos, { as: "Agendamientos", foreignKey: "Documento_Empleados"});
  Novedades_Horarios.belongsTo(Empleados, { as: "Documento_Empleados_Empleado", foreignKey: "Documento_Empleados"});
  Empleados.hasMany(Novedades_Horarios, { as: "Novedades_Horarios", foreignKey: "Documento_Empleados"});
  Ventas.belongsTo(Empleados, { as: "Documento_Empleados_Empleado", foreignKey: "Documento_Empleados"});
  Empleados.hasMany(Ventas, { as: "Venta", foreignKey: "Documento_Empleados"});
  Ventas_Cambio.belongsTo(Empleados, { as: "Documento_Empleados_Empleado", foreignKey: "Documento_Empleados"});
  Empleados.hasMany(Ventas_Cambio, { as: "Ventas_Cambios", foreignKey: "Documento_Empleados"});
  Producto_Imagen.belongsTo(Imagenes, { as: "Id_Imagenes_Imagene", foreignKey: "Id_Imagenes"});
  Imagenes.hasMany(Producto_Imagen, { as: "Producto_Imagens", foreignKey: "Id_Imagenes"});
  Servicio_Imagen.belongsTo(Imagenes, { as: "Id_Imagenes_Imagene", foreignKey: "Id_Imagenes"});
  Imagenes.hasMany(Servicio_Imagen, { as: "Servicio_Imagens", foreignKey: "Id_Imagenes"});
  Detalle_Insumos.belongsTo(Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  Insumos.hasMany(Detalle_Insumos, { as: "Detalle_Insumos", foreignKey: "Id_Insumos"});
  Producto_Tamano_Insumos.belongsTo(Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  Insumos.hasMany(Producto_Tamano_Insumos, { as: "Producto_Tamano_Insumos", foreignKey: "Id_Insumos"});
  Detalle_Compra_Tallas.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Productos"});
  Detalle_Productos.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Productos, { as: "Detalle_Productos", foreignKey: "Id_Productos"});
  Detalle_Venta_Cambio_Tallas.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Venta_Cambio_Tallas, { as: "Detalle_Venta_Cambio_Tallas", foreignKey: "Id_Productos"});
  Detalle_Venta_Productos.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Venta_Productos, { as: "Detalle_Venta_Productos", foreignKey: "Id_Productos"});
  Detalle_Venta_Tallas.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Venta_Tallas, { as: "Detalle_Venta_Tallas", foreignKey: "Id_Productos"});
  Detalle_Venta_Tamano.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Venta_Tamano, { as: "Detalle_Venta_Tamanos", foreignKey: "Id_Productos"});
  Producto_Imagen.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Producto_Imagen, { as: "Producto_Imagens", foreignKey: "Id_Productos"});
  Producto_Tallas.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Producto_Tallas, { as: "Producto_Tallas", foreignKey: "Id_Productos"});
  Producto_Tamano.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Producto_Tamano, { as: "Producto_Tamanos", foreignKey: "Id_Productos"});
  Producto_Tamano_Insumos.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Producto_Tamano_Insumos, { as: "Producto_Tamano_Insumos", foreignKey: "Id_Productos"});
  Compras.belongsTo(Proveedores, { as: "Id_Proveedores_Proveedore", foreignKey: "Id_Proveedores"});
  Proveedores.hasMany(Compras, { as: "Compras", foreignKey: "Id_Proveedores"});
  Agendamiento_Servicios.belongsTo(Servicios, { as: "Id_Servicios_Servicio", foreignKey: "Id_Servicios"});
  Servicios.hasMany(Agendamiento_Servicios, { as: "Agendamiento_Servicios", foreignKey: "Id_Servicios"});
  Servicio_Imagen.belongsTo(Servicios, { as: "Id_Servicios_Servicio", foreignKey: "Id_Servicios"});
  Servicios.hasMany(Servicio_Imagen, { as: "Servicio_Imagens", foreignKey: "Id_Servicios"});
  Detalle_Compra_Tallas.belongsTo(Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  Tallas.hasMany(Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Tallas"});
  Detalle_Venta_Cambio_Tallas.belongsTo(Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  Tallas.hasMany(Detalle_Venta_Cambio_Tallas, { as: "Detalle_Venta_Cambio_Tallas", foreignKey: "Id_Tallas"});
  Detalle_Venta_Tallas.belongsTo(Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  Tallas.hasMany(Detalle_Venta_Tallas, { as: "Detalle_Venta_Tallas", foreignKey: "Id_Tallas"});
  Producto_Tallas.belongsTo(Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  Tallas.hasMany(Producto_Tallas, { as: "Producto_Tallas", foreignKey: "Id_Tallas"});
  Detalle_Venta_Tamano.belongsTo(Tamano, { as: "Id_Tamano_Tamano", foreignKey: "Id_Tamano"});
  Tamano.hasMany(Detalle_Venta_Tamano, { as: "Detalle_Venta_Tamanos", foreignKey: "Id_Tamano"});
  Producto_Tamano.belongsTo(Tamano, { as: "Id_Tamano_Tamano", foreignKey: "Id_Tamano"});
  Tamano.hasMany(Producto_Tamano, { as: "Producto_Tamanos", foreignKey: "Id_Tamano"});
  Producto_Tamano_Insumos.belongsTo(Tamano, { as: "Id_Tamano_Tamano", foreignKey: "Id_Tamano"});
  Tamano.hasMany(Producto_Tamano_Insumos, { as: "Producto_Tamano_Insumos", foreignKey: "Id_Tamano"});
  Detalle_Venta_Productos.belongsTo(Ventas, { as: "Id_Ventas_Venta", foreignKey: "Id_Ventas"});
  Ventas.hasMany(Detalle_Venta_Productos, { as: "Detalle_Venta_Productos", foreignKey: "Id_Ventas"});
  Detalle_Venta_Tallas.belongsTo(Ventas, { as: "Id_Ventas_Venta", foreignKey: "Id_Ventas"});
  Ventas.hasMany(Detalle_Venta_Tallas, { as: "Detalle_Venta_Tallas", foreignKey: "Id_Ventas"});
  Detalle_Venta_Tamano.belongsTo(Ventas, { as: "Id_Ventas_Venta", foreignKey: "Id_Ventas"});
  Ventas.hasMany(Detalle_Venta_Tamano, { as: "Detalle_Venta_Tamanos", foreignKey: "Id_Ventas"});
  Detalle_Venta_Cambio_Tallas.belongsTo(Ventas_Cambio, { as: "Id_Ventas_Cambio_Ventas_Cambio", foreignKey: "Id_Ventas_Cambio"});
  Ventas_Cambio.hasMany(Detalle_Venta_Cambio_Tallas, { as: "Detalle_Venta_Cambio_Tallas", foreignKey: "Id_Ventas_Cambio"});

  return {
    Agendamiento_Servicios,
    Agendamientos,
    Categoria_Insumos,
    Categoria_Productos,
    Clientes,
    Compras,
    Detalle_Compra_Tallas,
    Detalle_Insumos,
    Detalle_Productos,
    Detalle_Venta_Cambio_Tallas,
    Detalle_Venta_Productos,
    Detalle_Venta_Tallas,
    Detalle_Venta_Tamano,
    Devoluciones,
    Empleados,
    Imagenes,
    Insumos,
    Novedades_Horarios,
    Producto_Imagen,
    Producto_Tallas,
    Producto_Tamano,
    Producto_Tamano_Insumos,
    Productos,
    Proveedores,
    Servicio_Imagen,
    Servicios,
    Tallas,
    Tamano,
    Ventas,
    Ventas_Cambio,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
