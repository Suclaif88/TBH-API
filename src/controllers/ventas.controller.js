const {
  Ventas,
  Detalle_Venta,
  Productos,
  Producto_Tallas,
  Producto_Tamano_Insumos,
  Agendamientos,
  Empleados,
  Servicios
} = require('../models');

const { sequelize } = require("../config/db");
const { UniqueConstraintError, ValidationError, DatabaseError } = require('sequelize');

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

      const subtotalDetalle = detalle.reduce((sum, item) => sum + Number(item.Subtotal || 0), 0);
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
        Detalle_Venta: detalle,
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
 *--------------------------------------------------------------------------------------
 */

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

    const subtotalDetalle = detalle.reduce((sum, item) => sum + Number(item.Subtotal || 0), 0);
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
        Detalle_Venta: detalle,
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
 *--------------------------------------------------------------------------------------
 */

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
      Estado = 1,
      Detalle_Venta: Detalles = []
    } = req.body;

    if (!Id_Cliente || !Id_Empleados || !Fecha || !M_Pago || Detalles.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Faltan datos requeridos' });
    }

    const subtotalDetalle = Detalles.reduce((sum, d) => sum + Number(d.Subtotal || 0), 0);

    let subtotalAgendamiento = 0;
    if (Id_Agendamientos) {
      const agendamiento = await Agendamientos.findByPk(Id_Agendamientos, { transaction: t });
      if (!agendamiento) {
        await t.rollback();
        return res.status(400).json({ status: 'error', message: 'Agendamiento no encontrado' });
      }
      subtotalAgendamiento = Number(agendamiento.Subtotal || 0);
    }

    const total = subtotalDetalle + subtotalAgendamiento;

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

    for (const item of Detalles) {
      await Detalle_Venta.create({
        Id_Ventas: venta.Id_Ventas,
        Id_Productos: item.Id_Productos || null,
        Id_Servicios: item.Id_Servicio || null,
        Id_Producto_Tallas: item.Id_Producto_Tallas || null,
        Id_Producto_Tamano_Insumos: item.Id_Producto_Tamano_Insumos || null,
        Cantidad: item.Cantidad,
        Precio: item.Precio,
        Subtotal: item.Subtotal
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      status: 'success',
      message: 'Venta creada correctamente',
      data: {
        Id_Ventas: venta.Id_Ventas,
        totalValidado: true
      }
    });

  } catch (error) {
      await t.rollback();
      console.error('Error al crear venta:', error);

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
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Marcar venta como completada (cambiar estado de 3 a 1)
 * --------------------------------------------------------------------------------------
 */
exports.marcarVentaCompletada = async (req, res) => {
  try {
    const { id } = req.params;

    const venta = await Ventas.findByPk(id);
    
    if (!venta) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Venta no encontrada' 
      });
    }

    if (venta.Estado !== 3) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'La venta debe tener estado 3 (pendiente) para poder marcarla como completada' 
      });
    }

    await venta.update({ Estado: 1 });

    res.json({
      status: 'success',
      message: 'Venta marcada como completada correctamente',
      data: {
        Id_Ventas: venta.Id_Ventas,
        Estado: venta.Estado,
        EstadoDescripcion: 'Completada'
      }
    });

  } catch (error) {
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
  try {
    const { id } = req.params;

    const venta = await Ventas.findByPk(id);
    
    if (!venta) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Venta no encontrada' 
      });
    }

    if (venta.Estado !== 3) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'La venta debe tener estado 3 (pendiente) para poder anularla' 
      });
    }

    await venta.update({ Estado: 2 });

    res.json({
      status: 'success',
      message: 'Venta anulada correctamente',
      data: {
        Id_Ventas: venta.Id_Ventas,
        Estado: venta.Estado,
        EstadoDescripcion: 'Anulada'
      }
    });

  } catch (error) {
    console.error('Error al anular venta:', error);
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development'
        ? `Error al anular venta: ${error.message}`
        : 'Error al anular venta'
    });
  }
};