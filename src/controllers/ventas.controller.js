const {
  Ventas,
  Detalle_Venta,
  Productos,
  Producto_Tallas,
  Producto_Tamano_Insumos,
  Producto_Tamano,
  Tamano,
  Agendamientos,
  Empleados,
  Servicios,
  Clientes
} = require('../models');

const { sequelize } = require("../config/db");
const { UniqueConstraintError, ValidationError, DatabaseError } = require('sequelize');

/**
 * --------------------------------------------------------------------------------------
 * Validaciones auxiliares simplificadas
 * --------------------------------------------------------------------------------------
 */

// Validar que el cliente existe
const validarCliente = async (idCliente, transaction) => {
  const cliente = await Clientes.findByPk(idCliente, { transaction });
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }
  return cliente;
};

// Validar que el empleado existe
const validarEmpleado = async (idEmpleado, transaction) => {
  const empleado = await Empleados.findByPk(idEmpleado, { transaction });
  if (!empleado) {
    throw new Error('Empleado no encontrado');
  }
  return empleado;
};

// Validar método de pago
const validarMetodoPago = (metodoPago, referencia) => {
  const metodosValidos = ['Efectivo', 'Tarjeta', 'Transferencia', 'PSE'];
  if (!metodosValidos.includes(metodoPago)) {
    throw new Error('Método de pago no válido');
  }
  
  // Si es transferencia, validar que tenga referencia
  if (metodoPago === 'Transferencia' && !referencia) {
    throw new Error('La transferencia requiere número de referencia');
  }
};

// Calcular precio simplificado
const calcularPrecio = async (producto, tallas, tamanos, cantidadTotal, transaction) => {
  let precioTotal = 0;
  
  try {
    // Determinar tipo de producto basado en los datos recibidos
    if (tamanos && tamanos.length > 0) {
      // Producto con tamaños (perfumes) - usar PrecioTotal que ya viene calculado
      for (const tamano of tamanos) {
        // Para perfumes: usar PrecioTotal que ya viene calculado correctamente
        const precioTamaño = Number(tamano.PrecioTotal || 0);
        precioTotal += precioTamaño;
      }
    } else if (tallas && tallas.length > 0) {
      // Producto con tallas (ropa) - calcular por cada talla individualmente
      for (const talla of tallas) {
        // Buscar información de la talla en la base de datos
        const tallaInfo = await Producto_Tallas.findOne({
          where: {
            Id_Productos: producto.Id_Productos,
            Talla: talla.talla
          },
          transaction
        });
        
        if (tallaInfo) {
          // Para ropa con tallas: (Precio base + Precio talla) × Cantidad de la talla
          const precioPorTalla = (Number(producto.Precio_Venta) + Number(tallaInfo.Precio)) * talla.cantidad;
          precioTotal += precioPorTalla;
        } else {
          // Si no se encuentra la talla en la BD, usar solo el precio base del producto
          const precioPorTalla = Number(producto.Precio_Venta) * talla.cantidad;
          precioTotal += precioPorTalla;
        }
      }
    } else {
      // Producto normal: precio base × cantidad total del item
      precioTotal = Number(producto.Precio_Venta) * cantidadTotal;
    }
    
    // Si el precio calculado es 0 o NaN, recalcular
    if (!precioTotal || isNaN(precioTotal)) {
      if (tamanos && tamanos.length > 0) {
        precioTotal = tamanos.reduce((sum, tamano) => {
          // Usar PrecioTotal existente, no recalcular
          const precioTamaño = Number(tamano.PrecioTotal || 0);
          return sum + precioTamaño;
        }, 0);
      } else {
        precioTotal = Number(producto.Precio_Venta) * cantidadTotal;
      }
    }
     
   } catch (error) {
     // Si hay error en el cálculo, usar precio base
     precioTotal = Number(producto.Precio_Venta) * cantidadTotal;
   }
   
   return precioTotal;
 };

/**
 * --------------------------------------------------------------------------------------
 * Listar ventas
 * --------------------------------------------------------------------------------------
 */
exports.listarVentas = async (req, res) => {
  try {
    const ventas = await Ventas.findAll({
      include: [
        {
          model: Detalle_Venta,
          as: 'Detalle_Venta',
          include: [
            { model: Productos, as: 'Id_Productos_Producto' },
            { model: Producto_Tallas, as: 'Id_Producto_Tallas_Producto_Talla' },
            { model: Producto_Tamano_Insumos, as: 'Id_Producto_Tamano_Insumos_Producto_Tamano_Insumo' },
            { model: Servicios, as: 'Servicio' }
          ]
        },
        {
          model: Agendamientos,
          as: 'Id_Agendamientos_Agendamiento',
          required: false
        },
        {
          model: Empleados,
          as: 'Id_Empleados_Empleado',
          attributes: ['Id_Empleados', 'Nombre']
        }
      ]
    });

    const ventasConFlag = ventas.map(v => {
      const venta = v.toJSON();
      const detalle = venta.Detalle_Venta || [];
      const agendamiento = venta.Id_Agendamientos_Agendamiento || null;
      const empleado = venta.Id_Empleados_Empleado || {};

      // Procesar detalles para incluir tallas y tamaños completos
      const detalleProcesado = detalle.map(item => {
        const detalleItem = { ...item };
        
        // Parsear datos de tallas y tamaños si existen
        if (item.Tallas_Data) {
          try {
            detalleItem.Tallas = JSON.parse(item.Tallas_Data);
          } catch (e) {
            detalleItem.Tallas = [];
          }
        } else {
          detalleItem.Tallas = [];
        }

        if (item.Tamanos_Data) {
          try {
            detalleItem.Tamanos = JSON.parse(item.Tamanos_Data);
          } catch (e) {
            detalleItem.Tamanos = [];
          }
        } else {
          detalleItem.Tamanos = [];
        }

        // Agregar información adicional de tallas y tamaños
        detalleItem.tieneTallas = detalleItem.Tallas && detalleItem.Tallas.length > 0;
        detalleItem.tieneTamanos = detalleItem.Tamanos && detalleItem.Tamanos.length > 0;
        
        // Generar descripción detallada de tallas para mostrar en los detalles
        if (detalleItem.tieneTallas) {
          detalleItem.descripcionTallas = detalleItem.Tallas.map(talla => 
            `${talla.cantidad || talla.Cantidad || 0} x Talla ${talla.talla || talla.Talla || talla.nombre || 'N/A'}`
          ).join(', ');
        }
        
        // Generar descripción detallada de tamaños para mostrar en los detalles
        if (detalleItem.tieneTamanos) {
          detalleItem.descripcionTamanos = detalleItem.Tamanos.map(tamano => 
            `${tamano.Cantidad} x ${tamano.nombre}`
          ).join(', ');
        }

        return detalleItem;
      });

      const subtotalDetalle = detalleProcesado.reduce((sum, item) => sum + Number(item.Subtotal || 0), 0);
      const subtotalAgendamiento = agendamiento ? Number(agendamiento.Subtotal || 0) : 0;
      const totalCalculado = subtotalDetalle + subtotalAgendamiento;
      const totalValidado = Number(venta.Total) === totalCalculado;

      return {
        Id_Ventas: venta.Id_Ventas,
        Id_Agendamientos: venta.Id_Agendamientos,
        Id_Cliente: venta.Id_Cliente,
        Id_Empleados: venta.Id_Empleados,
        Nombre_Empleado: empleado?.Nombre || 'Desconocido',
        Fecha: venta.Fecha,
        Total: venta.Total,
        Estado: venta.Estado,
        M_Pago: venta.M_Pago,
        Referencia: venta.Referencia,
        Detalle_Venta: detalleProcesado,
        tieneAgendamiento: !!venta.Id_Agendamientos,
        Agendamiento: agendamiento,
        totalValidado
      };
    });

    res.json({ status: 'success', data: ventasConFlag });

  } catch (error) {
    console.error('Error al listar ventas:', error);
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development'
        ? `Error al obtener ventas: ${error.message}`
        : 'Error al obtener ventas'
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Obtener venta por ID
 * --------------------------------------------------------------------------------------
 */
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await Ventas.findByPk(id, {
      include: [
        {
          model: Detalle_Venta,
          as: 'Detalle_Venta',
          include: [
            { model: Productos, as: 'Id_Productos_Producto' },
            { model: Producto_Tallas, as: 'Id_Producto_Tallas_Producto_Talla' },
            { model: Producto_Tamano_Insumos, as: 'Id_Producto_Tamano_Insumos_Producto_Tamano_Insumo' },
            { model: Servicios, as: 'Servicio' }
          ]
        },
        {
          model: Agendamientos,
          as: 'Id_Agendamientos_Agendamiento',
          required: false
        },
        {
          model: Empleados,
          as: 'Id_Empleados_Empleado',
          attributes: ['Nombre']
        }
      ]
    });

    if (!venta) {
      return res.status(404).json({ status: 'error', message: 'Venta no encontrada' });
    }

    const ventaJson = venta.toJSON();
    const detalle = ventaJson.Detalle_Venta || [];
    const agendamiento = ventaJson.Id_Agendamientos_Agendamiento || null;
    const empleado = ventaJson.Id_Empleados_Empleado || {};

    // Procesar detalles para incluir tallas y tamaños completos
    const detalleProcesado = detalle.map(item => {
      const detalleItem = { ...item };
      
      // Parsear datos de tallas y tamaños si existen
      if (item.Tallas_Data) {
        try {
          detalleItem.Tallas = JSON.parse(item.Tallas_Data);
        } catch (e) {
          detalleItem.Tallas = [];
        }
      } else {
        detalleItem.Tallas = [];
      }

      if (item.Tamanos_Data) {
        try {
          detalleItem.Tamanos = JSON.parse(item.Tamanos_Data);
        } catch (e) {
          detalleItem.Tamanos = [];
        }
      } else {
        detalleItem.Tamanos = [];
      }

      // Agregar información adicional de tallas y tamaños
      detalleItem.tieneTallas = detalleItem.Tallas && detalleItem.Tallas.length > 0;
      detalleItem.tieneTamanos = detalleItem.Tamanos && detalleItem.Tamanos.length > 0;
      
             // Generar descripción detallada de tallas para mostrar en los detalles
       if (detalleItem.tieneTallas) {
         detalleItem.descripcionTallas = detalleItem.Tallas.map(talla => 
           `${talla.cantidad || talla.Cantidad || 0} x Talla ${talla.talla || talla.Talla || talla.nombre || 'N/A'}`
         ).join(', ');
       }
      
             // Generar descripción detallada de tamaños para mostrar en los detalles
       if (detalleItem.tieneTamanos) {
         detalleItem.descripcionTamanos = detalleItem.Tamanos.map(tamano => 
           `${tamano.Cantidad} x ${tamano.nombre}`
         ).join(', ');
       }

      return detalleItem;
    });

    const subtotalDetalle = detalleProcesado.reduce((sum, item) => sum + Number(item.Subtotal || 0), 0);
    const subtotalAgendamiento = agendamiento ? Number(agendamiento.Subtotal || 0) : 0;
    const totalCalculado = subtotalDetalle + subtotalAgendamiento;
    const totalValidado = Number(ventaJson.Total) === totalCalculado;

    res.json({
      status: 'success',
      data: {
        Id_Ventas: ventaJson.Id_Ventas,
        Id_Agendamientos: ventaJson.Id_Agendamientos,
        Id_Cliente: ventaJson.Id_Cliente,
        Id_Empleados: ventaJson.Id_Empleados,
        Nombre_Empleado: empleado?.Nombre || 'Desconocido',
        Fecha: ventaJson.Fecha,
        Total: ventaJson.Total,
        M_Pago: ventaJson.M_Pago,
        Referencia: ventaJson.Referencia,
        Estado: ventaJson.Estado,
        Detalle_Venta: detalleProcesado,
        tieneAgendamiento: !!ventaJson.Id_Agendamientos,
        Agendamiento: agendamiento,
        totalValidado
      }
    });
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener venta' });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Crear una nueva venta
 * --------------------------------------------------------------------------------------
 */
exports.crearVenta = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      Id_Agendamientos,
      Id_Cliente,
      Id_Empleados,
      Fecha,
      M_Pago,
      Referencia,
      Estado = 3, // Estado pendiente por defecto
      Detalle_Venta: Detalles = []
    } = req.body;

    

    // Validaciones básicas
    if (!Id_Cliente || !Id_Empleados || !Fecha || !M_Pago || Detalles.length === 0) {
      await t.rollback();
      return res.status(400).json({ 
        status: 'error', 
        message: 'Faltan datos requeridos',
        required: { Id_Cliente, Id_Empleados, Fecha, M_Pago, Detalles: Detalles.length }
      });
    }

    // Validar cliente y empleado
    await validarCliente(Id_Cliente, t);
    await validarEmpleado(Id_Empleados, t);
    
    // Validar método de pago
    validarMetodoPago(M_Pago, Referencia);

    // Validar agendamiento si existe
    let subtotalAgendamiento = 0;
    if (Id_Agendamientos) {
      const agendamiento = await Agendamientos.findByPk(Id_Agendamientos, { transaction: t });
      if (!agendamiento) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: 'Agendamiento no encontrado' });
      }
      subtotalAgendamiento = Number(agendamiento.Subtotal || 0);
    }

    // Validar y procesar cada item del detalle
    let subtotalDetalle = 0;
    const detallesProcesados = [];

         for (const item of Detalles) {
       // Validar que el producto existe
       const producto = await Productos.findByPk(item.Id_Productos, { 
         transaction: t,
         attributes: ['Id_Productos', 'Nombre', 'Precio_Venta']
       });
       if (!producto) {
         await t.rollback();
         return res.status(400).json({ 
           status: 'error', 
           message: `Producto con ID ${item.Id_Productos} no encontrado` 
         });
       }

      // Procesar tallas y tamaños
      let tallas = item.Tallas || [];
      let tamanos = item.Tamanos || [];
      
             // Si Tamanos_Data viene como string JSON, parsearlo
       if (item.Tamanos_Data && typeof item.Tamanos_Data === 'string') {
         try {
           tamanos = JSON.parse(item.Tamanos_Data);
         } catch (e) {
           tamanos = [];
         }
       } else if (item.Tamanos_Data && Array.isArray(item.Tamanos_Data)) {
         // Si ya es un array, usarlo directamente
         tamanos = item.Tamanos_Data;
       }
       
       // Si Tallas_Data viene como string JSON, parsearlo
       if (item.Tallas_Data && typeof item.Tallas_Data === 'string') {
         try {
           tallas = JSON.parse(item.Tallas_Data);
         } catch (e) {
           tallas = [];
         }
       } else if (item.Tallas_Data && Array.isArray(item.Tallas_Data)) {
         // Si ya es un array, usarlo directamente
         tallas = item.Tallas_Data;
       }
      
      // Procesar y normalizar las tallas para asegurar que tengan la estructura correcta
      if (tallas && tallas.length > 0) {
        tallas = tallas.map(talla => {
          // Si la talla es un string simple, convertirlo a objeto
          if (typeof talla === 'string') {
            return {
              talla: talla,
              cantidad: 1,
              precio: 0
            };
          }
          
          // Si es un objeto, asegurar que tenga las propiedades correctas
          return {
            talla: talla.talla || talla.Talla || talla.nombre || '',
            cantidad: talla.cantidad || talla.Cantidad || 1,
            precio: talla.precio || talla.Precio || 0,
            Id_Producto_Tallas: talla.Id_Producto_Tallas || null
          };
        }).filter(talla => talla.talla && talla.talla.trim() !== ''); // Filtrar tallas vacías
      }

             

             // Calcular precio correcto
       const precioCalculado = await calcularPrecio(producto, tallas, tamanos, item.Cantidad, t);
       const subtotalCalculado = precioCalculado;

      detallesProcesados.push({
        ...item,
        Precio: precioCalculado,
        Subtotal: subtotalCalculado,
        Tallas: tallas,
        Tamanos: tamanos,
        // Guardar también los datos originales para asegurar que se guarden correctamente
        Tallas_Original: item.Tallas || [],
        Tamanos_Original: item.Tamanos || [],
        Tallas_Data_Original: item.Tallas_Data,
        Tamanos_Data_Original: item.Tamanos_Data
      });

      subtotalDetalle += subtotalCalculado;
    }

         const total = subtotalDetalle + subtotalAgendamiento;

     // Crear la venta
    const venta = await Ventas.create({
      Id_Agendamientos: Id_Agendamientos || null,
      Id_Cliente,
      Id_Empleados,
      Fecha,
      Total: total,
      Estado: Estado,
      M_Pago,
      Referencia: Referencia || null
    }, { transaction: t });

              // Crear detalles de venta con información completa de tallas/tamaños
     for (const item of detallesProcesados) {
      
      // Determinar qué datos guardar para Tallas_Data y Tamanos_Data
      let tallasParaGuardar = [];
      let tamanosParaGuardar = [];
      
      // Si tenemos datos originales, usarlos
      if (item.Tallas_Data_Original && typeof item.Tallas_Data_Original === 'string') {
        try {
          tallasParaGuardar = JSON.parse(item.Tallas_Data_Original);
        } catch (e) {
          tallasParaGuardar = item.Tallas_Original || [];
        }
      } else if (item.Tallas_Original && item.Tallas_Original.length > 0) {
        tallasParaGuardar = item.Tallas_Original;
      } else {
        tallasParaGuardar = item.Tallas || [];
      }
      
      if (item.Tamanos_Data_Original && typeof item.Tamanos_Data_Original === 'string') {
        try {
          tamanosParaGuardar = JSON.parse(item.Tamanos_Data_Original);
        } catch (e) {
          tamanosParaGuardar = item.Tamanos_Original || [];
        }
      } else if (item.Tamanos_Original && item.Tamanos_Original.length > 0) {
        tamanosParaGuardar = item.Tamanos_Original;
      } else {
        tamanosParaGuardar = item.Tamanos || [];
      }
      
             // Mantener PrecioTotal existente para tamaños (ya viene calculado correctamente)
       if (tamanosParaGuardar && tamanosParaGuardar.length > 0) {
         tamanosParaGuardar = tamanosParaGuardar.map(tamano => ({
           ...tamano,
           // Mantener el PrecioTotal que ya viene calculado, no recalcular
           PrecioTotal: Number(tamano.PrecioTotal || 0)
         }));
       }
       
               // Procesar y mejorar datos de tallas antes de guardar
        if (tallasParaGuardar && tallasParaGuardar.length > 0) {
          tallasParaGuardar = tallasParaGuardar.map(talla => {
            // Normalizar los nombres de las propiedades
            const tallaNormalizada = {
              ...talla,
              // Usar nombres consistentes
              talla: talla.talla || talla.Talla || talla.nombre || '',
              cantidad: talla.cantidad || talla.Cantidad || 0,
              precio: talla.precio || talla.Precio || 0,
              // Solo agregar campos descriptivos si no existen
              descripcion: talla.descripcion || `${talla.cantidad || talla.Cantidad || 0} x Talla ${talla.talla || talla.Talla || talla.nombre || ''}`,
              detalleTalla: talla.detalleTalla || `Talla ${talla.talla || talla.Talla || talla.nombre || ''}: ${talla.cantidad || talla.Cantidad || 0} unidades`
            };
            
            // Remover campos duplicados
            delete tallaNormalizada.Cantidad;
            delete tallaNormalizada.Talla;
            delete tallaNormalizada.Precio;
            
            return tallaNormalizada;
          }).filter(talla => talla.talla && talla.talla.trim() !== ''); // Filtrar tallas vacías
        }
       
               // Verificar que los arrays no sean undefined antes de hacer JSON.stringify
        const tallasData = tallasParaGuardar && tallasParaGuardar.length > 0 ? JSON.stringify(tallasParaGuardar) : null;
        const tamanosData = tamanosParaGuardar && tamanosParaGuardar.length > 0 ? JSON.stringify(tamanosParaGuardar) : null;
       
                       // Crear objeto de datos para el detalle, excluyendo campos que pueden no existir
         const detalleData = {
           Id_Ventas: venta.Id_Ventas,
           Id_Productos: item.Id_Productos || null,
           Id_Servicios: item.Id_Servicio || null,
           Id_Producto_Tallas: tallasParaGuardar.length > 0 ? tallasParaGuardar[0].Id_Producto_Tallas : null,
           Id_Producto_Tamano_Insumos: tamanosParaGuardar.length > 0 ? tamanosParaGuardar[0].Id_Producto_Tamano_Insumos : null,
           Cantidad: item.Cantidad,
           Precio: item.Precio, // Usar el precio calculado, no el original
           Subtotal: item.Subtotal // Usar el subtotal calculado, no el original
         };

        // Agregar campos de datos JSON
        if (tallasData) detalleData.Tallas_Data = tallasData;
        if (tamanosData) detalleData.Tamanos_Data = tamanosData;

                 const detalleVenta = await Detalle_Venta.create(detalleData, { transaction: t });
     }

    await t.commit();

    res.status(201).json({
      status: 'success',
      message: 'Venta creada correctamente',
      data: {
        Id_Ventas: venta.Id_Ventas,
        Total: total,
        totalValidado: true,
        Detalle_Venta: detallesProcesados
      }
    });

  } catch (error) {
    await t.rollback();
    console.error('Error al crear venta:', error);

    // Manejar errores específicos
    if (error.message.includes('no encontrado') || 
        error.message.includes('insuficiente') ||
        error.message.includes('no coincide') ||
        error.message.includes('no válido')) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }

    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        status: 'error',
        message: 'Conflicto de datos únicos',
        detail: 'Duplicado en campo único'
      });
    }

    if (error instanceof ValidationError) {
      return res.status(400).json({
        status: 'error',
        message: 'Error de validación',
        detail: error.errors.map(e => e.message)
      });
    }

    if (error instanceof DatabaseError) {
      return res.status(500).json({
        status: 'error',
        message: 'Error de base de datos',
        detail: error.message
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error inesperado al crear venta',
      detail: error.message
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Marcar venta como completada (cambiar estado de 3 a 1)
 * --------------------------------------------------------------------------------------
 */
exports.marcarVentaCompletada = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const venta = await Ventas.findByPk(id, {
      include: [
        {
          model: Detalle_Venta,
          as: 'Detalle_Venta'
        }
      ],
      transaction: t
    });
    
    if (!venta) {
      await t.rollback();
      return res.status(404).json({ 
        status: 'error', 
        message: 'Venta no encontrada' 
      });
    }

    if (venta.Estado !== 3) {
      await t.rollback();
      return res.status(400).json({ 
        status: 'error', 
        message: 'La venta debe tener estado 3 (pendiente) para poder marcarla como completada' 
      });
    }

    // Marcar venta como completada
    await venta.update({ 
      Estado: 1,
      Fecha_Completado: new Date()
    }, { transaction: t });

    await t.commit();

    res.json({
      status: 'success',
      message: 'Venta marcada como completada correctamente',
      data: {
        Id_Ventas: venta.Id_Ventas,
        Estado: venta.Estado,
        EstadoDescripcion: 'Completada',
        Fecha_Completado: venta.Fecha_Completado
      }
    });

  } catch (error) {
    await t.rollback();
    console.error('Error al marcar venta como completada:', error);
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development'
        ? `Error al marcar venta como completada: ${error.message}`
        : 'Error al marcar venta como completada'
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Anular venta (cambiar estado de 3 a 2)
 * --------------------------------------------------------------------------------------
 */
exports.anularVenta = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const venta = await Ventas.findByPk(id, {
      include: [
        {
          model: Detalle_Venta,
          as: 'Detalle_Venta'
        }
      ],
      transaction: t
    });
    
    if (!venta) {
      await t.rollback();
      return res.status(404).json({ 
        status: 'error', 
        message: 'Venta no encontrada' 
      });
    }

    if (venta.Estado !== 3) {
      await t.rollback();
      return res.status(400).json({ 
        status: 'error', 
        message: 'La venta debe tener estado 3 (pendiente) para poder anularla' 
      });
    }

    // Marcar venta como anulada
    await venta.update({ 
      Estado: 2,
      Fecha_Anulacion: new Date()
    }, { transaction: t });

    await t.commit();

    res.json({
      status: 'success',
      message: 'Venta anulada correctamente',
      data: {
        Id_Ventas: venta.Id_Ventas,
        Estado: venta.Estado,
        EstadoDescripcion: 'Anulada',
        Fecha_Anulacion: venta.Fecha_Anulacion
      }
    });

  } catch (error) {
    await t.rollback();
    console.error('Error al anular venta:', error);
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development'
        ? `Error al anular venta: ${error.message}`
        : 'Error al anular venta'
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Validar stock disponible
 * --------------------------------------------------------------------------------------
 */
exports.validarStock = async (req, res) => {
  try {
    const { Id_Productos, Cantidad, Tallas, Tamanos } = req.body;

    if (!Id_Productos) {
      return res.status(400).json({
        status: 'error',
        message: 'ID de producto es requerido'
      });
    }

    const producto = await Productos.findByPk(Id_Productos);
    if (!producto) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    let stockDisponible = true;
    let mensajes = [];

    // Validar stock por tallas
    if (Tallas && Tallas.length > 0) {
      for (const talla of Tallas) {
        const stockTalla = await Producto_Tallas.findOne({
          where: {
            Id_Productos: producto.Id_Productos,
            Talla: talla.talla
          }
        });

        if (!stockTalla || stockTalla.Stock < talla.cantidad) {
          stockDisponible = false;
          mensajes.push(`Stock insuficiente para talla ${talla.talla}: disponible ${stockTalla?.Stock || 0}, solicitado ${talla.cantidad}`);
        }
      }
    }

    // Validar stock por tamaños
    if (Tamanos && Tamanos.length > 0) {
      for (const tamano of Tamanos) {
        // Buscar el tamaño por nombre
        const tamanoInfo = await Tamano.findOne({
          where: { Nombre: tamano.nombre }
        });
        
        if (!tamanoInfo) {
          stockDisponible = false;
          mensajes.push(`Tamaño ${tamano.nombre} no encontrado`);
          continue;
        }
        
        // Buscar la relación producto-tamaño
        const productoTamano = await Producto_Tamano.findOne({
          where: {
            Id_Productos: producto.Id_Productos,
            Id_Tamano: tamanoInfo.Id_Tamano
          }
        });
        
        if (!productoTamano) {
          stockDisponible = false;
          mensajes.push(`El producto ${producto.Nombre} no tiene el tamaño ${tamano.nombre} configurado`);
        }
      }
    }

    res.json({
      status: 'success',
      data: {
        Id_Productos: producto.Id_Productos,
        Nombre: producto.Nombre,
        stockDisponible,
        mensajes
      }
    });

  } catch (error) {
    console.error('Error al validar stock:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al validar stock'
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Reporte de ventas diarias
 * --------------------------------------------------------------------------------------
 */
exports.reporteVentasDiarias = async (req, res) => {
  try {
    const { fecha } = req.query;
    const fechaConsulta = fecha ? new Date(fecha) : new Date();

    const ventas = await Ventas.findAll({
      where: {
        Fecha: {
          [sequelize.Op.between]: [
            new Date(fechaConsulta.setHours(0, 0, 0, 0)),
            new Date(fechaConsulta.setHours(23, 59, 59, 999))
          ]
        },
        Estado: 1 // Solo ventas completadas
      },
      include: [
        {
          model: Detalle_Venta,
          as: 'Detalle_Venta',
          include: [
            { model: Productos, as: 'Id_Productos_Producto' }
          ]
        },
        {
          model: Empleados,
          as: 'Id_Empleados_Empleado',
          attributes: ['Nombre']
        }
      ]
    });

    const totalVentas = ventas.reduce((sum, v) => sum + Number(v.Total), 0);
    const cantidadVentas = ventas.length;

    // Productos más vendidos
    const productosVendidos = {};
    ventas.forEach(venta => {
      venta.Detalle_Venta.forEach(detalle => {
        const productoId = detalle.Id_Productos;
        const productoNombre = detalle.Id_Productos_Producto?.Nombre || 'Producto desconocido';
        
        if (!productosVendidos[productoId]) {
          productosVendidos[productoId] = {
            Id_Productos: productoId,
            Nombre: productoNombre,
            Cantidad: 0,
            Total: 0
          };
        }
        
        productosVendidos[productoId].Cantidad += detalle.Cantidad;
        productosVendidos[productoId].Total += Number(detalle.Subtotal);
      });
    });

    const productosTop = Object.values(productosVendidos)
      .sort((a, b) => b.Total - a.Total)
      .slice(0, 5);

    res.json({
      status: 'success',
      data: {
        fecha: fechaConsulta.toISOString().split('T')[0],
        totalVentas,
        cantidadVentas,
        productosTop,
        ventas: ventas.map(v => ({
          Id_Ventas: v.Id_Ventas,
          Total: v.Total,
          Empleado: v.Id_Empleados_Empleado?.Nombre,
          Fecha: v.Fecha
        }))
      }
    });

  } catch (error) {
    console.error('Error al generar reporte diario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar reporte diario'
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Reporte de ventas mensuales
 * --------------------------------------------------------------------------------------
 */
exports.reporteVentasMensuales = async (req, res) => {
  try {
    const { mes, año } = req.query;
    const fechaActual = new Date();
    const mesConsulta = mes ? parseInt(mes) - 1 : fechaActual.getMonth();
    const añoConsulta = año ? parseInt(año) : fechaActual.getFullYear();

    const fechaInicio = new Date(añoConsulta, mesConsulta, 1);
    const fechaFin = new Date(añoConsulta, mesConsulta + 1, 0, 23, 59, 59, 999);

    const ventas = await Ventas.findAll({
      where: {
        Fecha: {
          [sequelize.Op.between]: [fechaInicio, fechaFin]
        },
        Estado: 1 // Solo ventas completadas
      },
      include: [
        {
          model: Detalle_Venta,
          as: 'Detalle_Venta',
          include: [
            { model: Productos, as: 'Id_Productos_Producto' }
          ]
        },
        {
          model: Empleados,
          as: 'Id_Empleados_Empleado',
          attributes: ['Nombre']
        }
      ]
    });

    const totalVentas = ventas.reduce((sum, v) => sum + Number(v.Total), 0);
    const cantidadVentas = ventas.length;

    // Ventas por día
    const ventasPorDia = {};
    ventas.forEach(venta => {
      const dia = venta.Fecha.toISOString().split('T')[0];
      if (!ventasPorDia[dia]) {
        ventasPorDia[dia] = { total: 0, cantidad: 0 };
      }
      ventasPorDia[dia].total += Number(venta.Total);
      ventasPorDia[dia].cantidad += 1;
    });

    // Empleados con más ventas
    const empleadosVentas = {};
    ventas.forEach(venta => {
      const empleadoId = venta.Id_Empleados;
      const empleadoNombre = venta.Id_Empleados_Empleado?.Nombre || 'Desconocido';
      
      if (!empleadosVentas[empleadoId]) {
        empleadosVentas[empleadoId] = {
          Id_Empleados: empleadoId,
          Nombre: empleadoNombre,
          Total: 0,
          Cantidad: 0
        };
      }
      
      empleadosVentas[empleadoId].Total += Number(venta.Total);
      empleadosVentas[empleadoId].Cantidad += 1;
    });

    const empleadosTop = Object.values(empleadosVentas)
      .sort((a, b) => b.Total - a.Total)
      .slice(0, 5);

    res.json({
      status: 'success',
      data: {
        mes: mesConsulta + 1,
        año: añoConsulta,
        totalVentas,
        cantidadVentas,
        promedioDiario: cantidadVentas / new Date(añoConsulta, mesConsulta + 1, 0).getDate(),
        ventasPorDia,
        empleadosTop
      }
    });

  } catch (error) {
    console.error('Error al generar reporte mensual:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar reporte mensual'
    });
      }
  };