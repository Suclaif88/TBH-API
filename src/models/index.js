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
var _Empleado_Servicio = require("./Empleado_Servicio");
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

function initModels(sequelize) {
  var Agendamiento_Servicios = _Agendamiento_Servicios(sequelize, DataTypes);
  var Agendamientos = _Agendamientos(sequelize, DataTypes);
  var Categoria_Insumos = _Categoria_Insumos(sequelize, DataTypes);
  var Categoria_Productos = _Categoria_Productos(sequelize, DataTypes);
  var Clientes = _Clientes(sequelize, DataTypes);
  var Compras = _Compras(sequelize, DataTypes);
  var Detalle_Compra_Insumos = _Detalle_Compra_Insumos(sequelize, DataTypes);
  var Detalle_Compra_Productos = _Detalle_Compra_Productos(sequelize, DataTypes);
  var Detalle_Compra_Tallas = _Detalle_Compra_Tallas(sequelize, DataTypes);
  var Detalle_Devolucion = _Detalle_Devolucion(sequelize, DataTypes);
  var Detalle_Venta = _Detalle_Venta(sequelize, DataTypes);
  var Devoluciones = _Devoluciones(sequelize, DataTypes);
  var Empleado_Servicio = _Empleado_Servicio(sequelize, DataTypes);
  var Empleados = _Empleados(sequelize, DataTypes);
  var Imagenes = _Imagenes(sequelize, DataTypes);
  var Insumos = _Insumos(sequelize, DataTypes);
  var Novedades_Horarios = _Novedades_Horarios(sequelize, DataTypes);
  var Permisos = _Permisos(sequelize, DataTypes);
  var Producto_Imagen = _Producto_Imagen(sequelize, DataTypes);
  var Producto_Tallas = _Producto_Tallas(sequelize, DataTypes);
  var Producto_Tamano = _Producto_Tamano(sequelize, DataTypes);
  var Producto_Tamano_Insumos = _Producto_Tamano_Insumos(sequelize, DataTypes);
  var Productos = _Productos(sequelize, DataTypes);
  var Proveedores = _Proveedores(sequelize, DataTypes);
  var Rol_Permiso = _Rol_Permiso(sequelize, DataTypes);
  var Roles = _Roles(sequelize, DataTypes);
  var Servicio_Imagen = _Servicio_Imagen(sequelize, DataTypes);
  var Servicios = _Servicios(sequelize, DataTypes);
  var Tallas = _Tallas(sequelize, DataTypes);
  var Tamano = _Tamano(sequelize, DataTypes);
  var Tamano_Insumos = _Tamano_Insumos(sequelize, DataTypes);
  var Usuarios = _Usuarios(sequelize, DataTypes);
  var Ventas = _Ventas(sequelize, DataTypes);

  // Crear barra de progreso
const bar = new cliProgress.SingleBar({
    format: 'Cargando modelos [{bar}] {percentage}% | {value}/{total} Modelos',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
}, cliProgress.Presets.shades_classic);

const models = [
    _Agendamiento_Servicios,
    _Agendamientos,
    _Categoria_Insumos,
    _Categoria_Productos,
    _Clientes,
    _Compras,
    _Detalle_Compra_Insumos,
    _Detalle_Compra_Productos,
    _Detalle_Compra_Tallas,
    _Detalle_Devolucion,
    _Detalle_Venta,
    _Devoluciones,
    _Empleado_Servicio,
    _Empleados,
    _Imagenes,
    _Insumos,
    _Novedades_Horarios,
    _Permisos,
    _Producto_Imagen,
    _Producto_Tallas,
    _Producto_Tamano,
    _Producto_Tamano_Insumos,
    _Productos,
    _Proveedores,
    _Rol_Permiso,
    _Roles,
    _Servicio_Imagen,
    _Servicios,
    _Tallas,
    _Tamano,
    _Tamano_Insumos,
    _Usuarios,
    _Ventas
];

// Inicializar la barra de progreso
bar.start(models.length, 0);

// Inicializar modelos
function nini(sequelize) {
    let initializedModels = {};

    models.forEach((model, index) => {
        const modelName = model(sequelize, DataTypes);
        initializedModels[modelName.name] = modelName;

        // Actualizar barra de progreso
        bar.update(index + 1);
    });

    // Detener la barra de progreso
    bar.stop();

    return initializedModels;
}

  const modelsInitialized = nini(sequelize);

  Agendamiento_Servicios.belongsTo(Agendamientos, { as: "Agendamiento", foreignKey: "Id_Agendamientos" });
  Agendamientos.hasMany(Agendamiento_Servicios, { as: "Agendamiento_Servicios", foreignKey: "Id_Agendamientos" });
  Ventas.belongsTo(Agendamientos, { as: "Agendamiento", foreignKey: "Id_Agendamientos"});
  Agendamientos.hasOne(Ventas, { as: "Ventum", foreignKey: "Id_Agendamientos"});
  Insumos.belongsTo(Categoria_Insumos, { as: "Id_Categoria_Insumos_Categoria_Insumo", foreignKey: "Id_Categoria_Insumos"});
  Categoria_Insumos.hasMany(Insumos, { as: "Insumos", foreignKey: "Id_Categoria_Insumos"});
  Productos.belongsTo(Categoria_Productos, { as: "Id_Categoria_Producto_Categoria_Producto", foreignKey: "Id_Categoria_Producto"});
  Categoria_Productos.hasMany(Productos, { as: "Productos", foreignKey: "Id_Categoria_Producto"});
  Tallas.belongsTo(Categoria_Productos, { as: "Id_Categoria_Producto_Categoria_Producto", foreignKey: "Id_Categoria_Producto"});
  Categoria_Productos.hasMany(Tallas, { as: "Tallas", foreignKey: "Id_Categoria_Producto"});
  Agendamientos.belongsTo(Clientes, { as: "Id_Cliente_Cliente", foreignKey: "Id_Cliente"});
  Clientes.hasMany(Agendamientos, { as: "Agendamientos", foreignKey: "Id_Cliente"});
  Devoluciones.belongsTo(Clientes, { as: "Id_Cliente_Cliente", foreignKey: "Id_Cliente"});
  Clientes.hasMany(Devoluciones, { as: "Devoluciones", foreignKey: "Id_Cliente"});
  Ventas.belongsTo(Clientes, { as: "Id_Cliente_Cliente", foreignKey: "Id_Cliente"});
  Clientes.hasMany(Ventas, { as: "Venta", foreignKey: "Id_Cliente"});
  Detalle_Compra_Insumos.belongsTo(Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  Compras.hasMany(Detalle_Compra_Insumos, { as: "Detalle_Compra_Insumos", foreignKey: "Id_Compras"});
  Detalle_Compra_Productos.belongsTo(Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  Compras.hasMany(Detalle_Compra_Productos, { as: "Detalle_Compra_Productos", foreignKey: "Id_Compras"});
  Detalle_Compra_Tallas.belongsTo(Compras, { as: "Id_Compras_Compra", foreignKey: "Id_Compras"});
  Compras.hasMany(Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Compras"});
  Detalle_Devolucion.belongsTo(Detalle_Venta, { as: "Id_Detalle_Venta_Detalle_Ventum", foreignKey: "Id_Detalle_Venta"});
  Detalle_Venta.hasMany(Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Detalle_Venta"});
  Detalle_Devolucion.belongsTo(Devoluciones, { as: "Id_Devoluciones_Devolucione", foreignKey: "Id_Devoluciones"});
  Devoluciones.hasMany(Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Devoluciones"});
  Agendamientos.belongsTo(Empleados, { as: "Id_Empleados_Empleado", foreignKey: "Id_Empleados"});
  Empleados.hasMany(Agendamientos, { as: "Agendamientos", foreignKey: "Id_Empleados"});
  Empleado_Servicio.belongsTo(Empleados, { as: "Id_Empleados_Empleado", foreignKey: "Id_Empleados"});
  Empleados.hasMany(Empleado_Servicio, { as: "Empleado_Servicios", foreignKey: "Id_Empleados"});
  Novedades_Horarios.belongsTo(Empleados, { as: "Id_Empleados_Empleado", foreignKey: "Id_Empleados"});
  Empleados.hasMany(Novedades_Horarios, { as: "Novedades_Horarios", foreignKey: "Id_Empleados"});
  Ventas.belongsTo(Empleados, { as: "Id_Empleados_Empleado", foreignKey: "Id_Empleados"});
  Empleados.hasMany(Ventas, { as: "Venta", foreignKey: "Id_Empleados"});
  Producto_Imagen.belongsTo(Imagenes, { as: "Id_Imagenes_Imagene", foreignKey: "Id_Imagenes"});
  Imagenes.hasMany(Producto_Imagen, { as: "Producto_Imagens", foreignKey: "Id_Imagenes"});
  Servicio_Imagen.belongsTo(Imagenes, { as: "Id_Imagenes_Imagene", foreignKey: "Id_Imagenes"});
  Imagenes.hasMany(Servicio_Imagen, { as: "Servicio_Imagens", foreignKey: "Id_Imagenes"});
  Detalle_Compra_Insumos.belongsTo(Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  Insumos.hasMany(Detalle_Compra_Insumos, { as: "Detalle_Compra_Insumos", foreignKey: "Id_Insumos"});
  Producto_Tamano_Insumos.belongsTo(Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  Insumos.hasMany(Producto_Tamano_Insumos, { as: "Producto_Tamano_Insumos", foreignKey: "Id_Insumos"});
  Tamano_Insumos.belongsTo(Insumos, { as: "Id_Insumos_Insumo", foreignKey: "Id_Insumos"});
  Insumos.hasMany(Tamano_Insumos, { as: "Tamano_Insumos", foreignKey: "Id_Insumos"});
  Rol_Permiso.belongsTo(Permisos, { as: "Permiso", foreignKey: "Permiso_Id"});
  Permisos.hasMany(Rol_Permiso, { as: "Rol_Permisos", foreignKey: "Permiso_Id"});
  Detalle_Devolucion.belongsTo(Producto_Tallas, { as: "Id_Producto_Tallas_Producto_Talla", foreignKey: "Id_Producto_Tallas"});
  Producto_Tallas.hasMany(Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Producto_Tallas"});
  Detalle_Venta.belongsTo(Producto_Tallas, { as: "Id_Producto_Tallas_Producto_Talla", foreignKey: "Id_Producto_Tallas"});
  Producto_Tallas.hasMany(Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Producto_Tallas"});
  Producto_Tamano_Insumos.belongsTo(Producto_Tamano, { as: "Id_Producto_Tamano_Producto_Tamano", foreignKey: "Id_Producto_Tamano"});
  Producto_Tamano.hasMany(Producto_Tamano_Insumos, { as: "Producto_Tamano_Insumos", foreignKey: "Id_Producto_Tamano"});
  Detalle_Venta.belongsTo(Producto_Tamano_Insumos, { as: "Id_Producto_Tamano_Insumos_Producto_Tamano_Insumo", foreignKey: "Id_Producto_Tamano_Insumos"});
  Producto_Tamano_Insumos.hasMany(Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Producto_Tamano_Insumos"});
  Detalle_Compra_Productos.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Compra_Productos, { as: "Detalle_Compra_Productos", foreignKey: "Id_Productos"});
  Detalle_Compra_Tallas.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Productos"});
  Detalle_Devolucion.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Devolucion, { as: "Detalle_Devolucions", foreignKey: "Id_Productos"});
  Detalle_Venta.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Productos"});
  Producto_Imagen.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Producto_Imagen, { as: "Producto_Imagens", foreignKey: "Id_Productos"});
  Producto_Tallas.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Producto_Tallas, { as: "Producto_Tallas", foreignKey: "Id_Productos"});
  Producto_Tamano.belongsTo(Productos, { as: "Id_Productos_Producto", foreignKey: "Id_Productos"});
  Productos.hasMany(Producto_Tamano, { as: "Producto_Tamanos", foreignKey: "Id_Productos"});
  Compras.belongsTo(Proveedores, { as: "Id_Proveedores_Proveedore", foreignKey: "Id_Proveedores"});
  Proveedores.hasMany(Compras, { as: "Compras", foreignKey: "Id_Proveedores"});
  Rol_Permiso.belongsTo(Roles, { as: "Rol", foreignKey: "Rol_Id"});
  Roles.hasMany(Rol_Permiso, { as: "Rol_Permisos", foreignKey: "Rol_Id"});
  Usuarios.belongsTo(Roles, { as: "Rol", foreignKey: "Rol_Id"});
  Roles.hasMany(Usuarios, { as: "Usuarios", foreignKey: "Rol_Id"});
  Agendamiento_Servicios.belongsTo(Servicios, { as: "Servicio", foreignKey: "Id_Servicios" });
  Servicios.hasMany(Agendamiento_Servicios, { as: "Agendamiento_Servicios", foreignKey: "Id_Servicios" });
  Empleado_Servicio.belongsTo(Servicios, { as: "Id_Servicios_Servicio", foreignKey: "Id_Servicios"});
  Servicios.hasMany(Empleado_Servicio, { as: "Empleado_Servicios", foreignKey: "Id_Servicios"});
  Servicio_Imagen.belongsTo(Servicios, { as: "Id_Servicios_Servicio", foreignKey: "Id_Servicios"});
  Servicios.hasMany(Servicio_Imagen, { as: "Servicio_Imagens", foreignKey: "Id_Servicios"});
  Servicios.belongsToMany(Imagenes, {
    through: Servicio_Imagen,
    foreignKey: "Id_Servicios",
    otherKey: "Id_Imagenes",
    as: "Imagenes"
  });

  Imagenes.belongsToMany(Servicios, {
    through: Servicio_Imagen,
    foreignKey: "Id_Imagenes",
    otherKey: "Id_Servicios",
    as: "Servicios"
  });
  Detalle_Compra_Tallas.belongsTo(Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  Tallas.hasMany(Detalle_Compra_Tallas, { as: "Detalle_Compra_Tallas", foreignKey: "Id_Tallas"});
  Producto_Tallas.belongsTo(Tallas, { as: "Id_Tallas_Talla", foreignKey: "Id_Tallas"});
  Tallas.hasMany(Producto_Tallas, { as: "Producto_Tallas", foreignKey: "Id_Tallas"});
  Producto_Tamano.belongsTo(Tamano, { as: "Id_Tamano_Tamano", foreignKey: "Id_Tamano"});
  Tamano.hasMany(Producto_Tamano, { as: "Producto_Tamanos", foreignKey: "Id_Tamano"});
  Tamano_Insumos.belongsTo(Tamano, { as: "Id_Tamano_Tamano", foreignKey: "Id_Tamano"});
  Tamano.hasMany(Tamano_Insumos, { as: "Tamano_Insumos", foreignKey: "Id_Tamano"});
  Detalle_Venta.belongsTo(Ventas, { as: "Id_Ventas_Venta", foreignKey: "Id_Ventas"});
  Ventas.hasMany(Detalle_Venta, { as: "Detalle_Venta", foreignKey: "Id_Ventas"});


  Detalle_Venta.belongsTo(Servicios, {
    foreignKey: "Id_Servicios",
    as: "Servicio",
  });


  return {
    Agendamiento_Servicios,
    Agendamientos,
    Categoria_Insumos,
    Categoria_Productos,
    Clientes,
    Compras,
    Detalle_Compra_Insumos,
    Detalle_Compra_Productos,
    Detalle_Compra_Tallas,
    Detalle_Devolucion,
    Detalle_Venta,
    Devoluciones,
    Empleado_Servicio,
    Empleados,
    Imagenes,
    Insumos,
    Novedades_Horarios,
    Permisos,
    Producto_Imagen,
    Producto_Tallas,
    Producto_Tamano,
    Producto_Tamano_Insumos,
    Productos,
    Proveedores,
    Rol_Permiso,
    Roles,
    Servicio_Imagen,
    Servicios,
    Tallas,
    Tamano,
    Tamano_Insumos,
    Usuarios,
    Ventas,
  };
}
const models = initModels(sequelize);
module.exports = models;
//Si llegaste aqui es porque tienes muy mala suerte y algun modelo o relacion no se cargo correctamente que mal....