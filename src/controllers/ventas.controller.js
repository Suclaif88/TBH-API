const { 
  Ventas,
  Detalle_Venta,
  Productos, 
  Producto_Tallas,
  Producto_Tamano_Insumos,
  Servicios 
} = require('../models');

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
        }
      ]
    });

    res.json({ status: 'success', data: ventas });
  } catch (error) {
    console.error('Error al listar ventas:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener ventas' });
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
        }
      ]
    });

    if (!venta) {
      return res.status(404).json({ status: 'error', message: 'Venta no encontrada' });
    }

    res.json({ status: 'success', data: venta });
  } catch (error) {
    console.error('Error al obtener venta por ID:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener venta' });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */