const { Devoluciones, Detalle_Devolucion, Clientes, Detalle_Venta, Productos, Categoria_Productos, Ventas, Producto_Tallas, Tallas } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * --------------------------------------------------------------------------------------
 * Listar devoluciones
 * --------------------------------------------------------------------------------------
 */
exports.listarDevoluciones = async (req, res) => {
  try {
    const devoluciones = await Devoluciones.findAll({
      include: [
        {
          model: Clientes,
          as: 'Id_Cliente_Cliente',
          attributes: ['Id_Cliente', 'Nombre', 'Documento']
        },
        {
          model: Detalle_Devolucion,
          as: 'Detalle_Devolucions',
          include: [
            {
              model: Productos,
              as: 'Id_Productos_Producto',
              attributes: ['Id_Productos', 'Nombre']
            },
            {
              model: Producto_Tallas,
              as: 'Id_Producto_Tallas_Producto_Talla',
              include: [
                {
                  model: Tallas,
                  as: 'Id_Tallas_Talla',
                  attributes: ['Nombre']
                }
              ]
            }
          ]
        }
      ],
      order: [['Fecha', 'DESC']]
    });

    const devolucionesFormateadas = devoluciones.map(devolucion => {
      const dev = devolucion.toJSON();
      return {
        Id_Devoluciones: dev.Id_Devoluciones,
        Fecha: dev.Fecha,
        Total: `$ ${parseFloat(dev.Total || 0).toLocaleString("es-CO", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })}`,
        Estado: dev.Estado,
        Motivo: dev.Motivo,
        Cliente: {
          Id_Cliente: dev.Id_Cliente_Cliente?.Id_Cliente,
          Nombre: dev.Id_Cliente_Cliente?.Nombre,
          Documento: dev.Id_Cliente_Cliente?.Documento
        },
        Productos: dev.Detalle_Devolucions?.map(detalle => ({
          Id_Productos: detalle.Id_Productos_Producto?.Id_Productos,
          Nombre: detalle.Id_Productos_Producto?.Nombre,
          Cantidad: detalle.Cantidad,
          Subtotal: `$ ${parseFloat(detalle.Subtotal || 0).toLocaleString("es-CO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}`,
          Talla: detalle.Id_Producto_Tallas_Producto_Talla?.Id_Tallas_Talla?.Nombre || 'Única'
        })) || []
      };
    });

    res.json({ status: 'success', data: devolucionesFormateadas });

  } catch (error) {
    console.error('Error al listar devoluciones:', error);
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development'
        ? `Error al obtener devoluciones: ${error.message}`
        : 'Error al obtener devoluciones'
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Obtener devolución por ID
 * --------------------------------------------------------------------------------------
 */
exports.obtenerDevolucionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const devolucion = await Devoluciones.findByPk(id, {
      include: [
        {
          model: Clientes,
          as: 'Id_Cliente_Cliente',
          attributes: ['Id_Cliente', 'Nombre', 'Documento', 'Saldo_A_Favor']
        },
        {
          model: Detalle_Devolucion,
          as: 'Detalle_Devolucions',
          include: [
            {
              model: Productos,
              as: 'Id_Productos_Producto',
              attributes: ['Id_Productos', 'Nombre'],
              include: [
                {
                  model: Categoria_Productos,
                  as: 'Id_Categoria_Producto_Categoria_Producto',
                  attributes: ['Nombre']
                }
              ]
            },
            {
              model: Producto_Tallas,
              as: 'Id_Producto_Tallas_Producto_Talla',
              include: [
                {
                  model: Tallas,
                  as: 'Id_Tallas_Talla',
                  attributes: ['Nombre']
                }
              ]
            },
            {
              model: Detalle_Venta,
              as: 'Id_Detalle_Venta_Detalle_Ventum',
              attributes: ['Id_Detalle_Venta', 'Cantidad', 'Precio']
            }
          ]
        }
      ]
    });

    if (!devolucion) {
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }

    const devolucionJson = devolucion.toJSON();

    res.json({
      status: 'success',
      data: {
        Id_Devoluciones: devolucionJson.Id_Devoluciones,
        Fecha: devolucionJson.Fecha,
        Total: `$ ${parseFloat(devolucionJson.Total || 0).toLocaleString("es-CO")}`,
        Estado: devolucionJson.Estado,
        Motivo: devolucionJson.Motivo,
        Cliente: {
          Id_Cliente: devolucionJson.Id_Cliente_Cliente?.Id_Cliente,
          Nombre: devolucionJson.Id_Cliente_Cliente?.Nombre,
          Documento: devolucionJson.Id_Cliente_Cliente?.Documento,
          Saldo_A_Favor: devolucionJson.Id_Cliente_Cliente?.Saldo_A_Favor
        },
        Productos: devolucionJson.Detalle_Devolucions?.map(detalle => ({
          Id_Detalle_Devolucion: detalle.Id_Detalle_Devolucion,
          Id_Productos: detalle.Id_Productos_Producto?.Id_Productos,
          Nombre: detalle.Id_Productos_Producto?.Nombre,
          Categoria: detalle.Id_Productos_Producto?.Id_Categoria_Producto_Categoria_Producto?.Nombre,
          Talla: detalle.Id_Producto_Tallas_Producto_Talla?.Id_Tallas_Talla?.Nombre || 'Única',
          Cantidad: detalle.Cantidad,
          PrecioUnitario: detalle.Id_Detalle_Venta_Detalle_Ventum?.Precio,
          Subtotal: `$ ${parseFloat(detalle.Subtotal || 0).toLocaleString("es-CO")}`,
          CantidadOriginal: detalle.Id_Detalle_Venta_Detalle_Ventum?.Cantidad
        })) || []
      }
    });
  } catch (error) {
    console.error('Error al obtener devolución por ID:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener devolución' });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Crear una nueva devolución
 * --------------------------------------------------------------------------------------
 */
exports.crearDevolucion = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { Id_Cliente, productos, Fecha, Motivo } = req.body;

    if (!Id_Cliente || !productos || !Array.isArray(productos) || productos.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ status: 'error', message: 'Faltan datos requeridos' });
    }

    const cliente = await Clientes.findByPk(Id_Cliente, { transaction });
    if (!cliente) {
      await transaction.rollback();
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    const categoriaRopa = await Categoria_Productos.findOne({
      where: { Es_Ropa: true },
      transaction
    });

    if (!categoriaRopa) {
      await transaction.rollback();
      return res.status(404).json({ status: 'error', message: 'No se encontró categoría de ropa configurada' });
    }

    let totalDevolucion = 0;
    const errores = [];

    for (const producto of productos) {
      if (!producto.Id_Productos || !producto.Id_Detalle_Venta || !producto.Cantidad || !producto.Subtotal) {
        errores.push(`Producto en posición ${productos.indexOf(producto)} tiene campos incompletos`);
        continue;
      }

      const productoDB = await Productos.findOne({
        where: {
          Id_Productos: producto.Id_Productos,
          Id_Categoria_Producto: categoriaRopa.Id_Categoria_Producto
        },
        transaction
      });

      if (!productoDB) {
        errores.push(`El producto con ID ${producto.Id_Productos} no es ropa o no existe`);
        continue;
      }

      const detalleVenta = await Detalle_Venta.findOne({
        where: { Id_Detalle_Venta: producto.Id_Detalle_Venta },
        include: [{
          model: Ventas,
          as: 'Id_Ventas_Venta',
          where: { Id_Cliente },
          attributes: []
        }],
        transaction
      });

      if (!detalleVenta) {
        errores.push(`El detalle de venta ${producto.Id_Detalle_Venta} no existe o no pertenece al cliente`);
        continue;
      }

      const cantidadDevuelta = await Detalle_Devolucion.sum('Cantidad', {
        where: { Id_Detalle_Venta: producto.Id_Detalle_Venta },
        transaction
      }) || 0;

      const disponible = detalleVenta.Cantidad - cantidadDevuelta;

      if (producto.Cantidad > disponible) {
        errores.push(`Cantidad a devolver (${producto.Cantidad}) excede lo disponible (${disponible}) para el producto ${productoDB.Nombre}`);
        continue;
      }

      totalDevolucion += parseFloat(producto.Subtotal);
    }

    if (errores.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Errores en los productos',
        errors: errores
      });
    }

    const devolucion = await Devoluciones.create({
      Id_Cliente,
      Total: totalDevolucion,
      Fecha: Fecha || new Date(),
      Estado: true,
      Motivo
    }, { transaction });

    const detallesDevolucion = productos.map(p => ({
      Id_Devoluciones: devolucion.Id_Devoluciones,
      Id_Detalle_Venta: p.Id_Detalle_Venta,
      Id_Productos: p.Id_Productos,
      Id_Producto_Tallas: p.Id_Producto_Tallas || null,
      Cantidad: p.Cantidad,
      Subtotal: p.Subtotal,
      Motivo
    }));

    await Detalle_Devolucion.bulkCreate(detallesDevolucion, { transaction });

    cliente.Saldo_A_Favor = (parseFloat(cliente.Saldo_A_Favor) || 0) + totalDevolucion;
    await cliente.save({ transaction });

    await transaction.commit();

    res.status(201).json({
      status: 'success',
      message: 'Devolución creada exitosamente',
      data: {
        Id_Devoluciones: devolucion.Id_Devoluciones,
        Total: totalDevolucion,
        Fecha: devolucion.Fecha,
        NuevoSaldo: cliente.Saldo_A_Favor
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear devolución:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la devolución',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Cambiar estado de devolución
 * --------------------------------------------------------------------------------------
 */
exports.cambiarEstadoDevolucion = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { Estado } = req.body;

    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ status: 'error', message: 'ID de devolución inválido' });
    }

    if (typeof Estado !== 'boolean') {
      await transaction.rollback();
      return res.status(400).json({ status: 'error', message: 'El estado debe ser un valor booleano' });
    }

    const devolucion = await Devoluciones.findByPk(id, {
      include: [{ model: Clientes, as: 'Id_Cliente_Cliente' }],
      transaction
    });

    if (!devolucion) {
      await transaction.rollback();
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }

    if (devolucion.Estado !== Estado) {
      if (devolucion.Id_Cliente_Cliente) {
        const diferencia = Estado ? devolucion.Total : -devolucion.Total;
        const nuevoSaldo = parseFloat(devolucion.Id_Cliente_Cliente.Saldo_A_Favor || 0) + parseFloat(diferencia);

        await Clientes.update(
          { Saldo_A_Favor: Math.max(0, nuevoSaldo) },
          { 
            where: { Id_Cliente: devolucion.Id_Cliente },
            transaction
          }
        );
      }

      await devolucion.update({ Estado }, { transaction });
    }

    await transaction.commit();

    res.json({
      status: 'success',
      message: `Devolución ${Estado ? 'activada' : 'desactivada'} correctamente`,
      data: {
        Id_Devoluciones: devolucion.Id_Devoluciones,
        Estado,
        SaldoActual: devolucion.Id_Cliente_Cliente?.Saldo_A_Favor
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al cambiar estado de devolución:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al cambiar el estado de la devolución',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Eliminar devolución
 * --------------------------------------------------------------------------------------
 */
exports.eliminarDevolucion = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ status: 'error', message: 'ID de devolución inválido' });
    }

    const devolucion = await Devoluciones.findByPk(id, {
      include: [{ model: Clientes, as: 'Id_Cliente_Cliente' }],
      transaction
    });

    if (!devolucion) {
      await transaction.rollback();
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }

    if (devolucion.Estado && devolucion.Id_Cliente_Cliente) {
      const nuevoSaldo = parseFloat(devolucion.Id_Cliente_Cliente.Saldo_A_Favor || 0) - parseFloat(devolucion.Total || 0);
      
      await Clientes.update(
        { Saldo_A_Favor: Math.max(0, nuevoSaldo) },
        { 
          where: { Id_Cliente: devolucion.Id_Cliente },
          transaction
        }
      );
    }

    await Detalle_Devolucion.destroy({
      where: { Id_Devoluciones: id },
      transaction
    });

    await devolucion.destroy({ transaction });

    await transaction.commit();

    res.json({
      status: 'success',
      message: 'Devolución eliminada correctamente'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar devolución:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar la devolución',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * --------------------------------------------------------------------------------------
 * Obtener compras de ropa de cliente
 * --------------------------------------------------------------------------------------
 */
exports.obtenerComprasRopaCliente = async (req, res) => {
  const transaction = await sequelize.transaction();
  let resultado = [];
  
  try {
    const { id } = req.params;
    
    console.log('🔍 ID Cliente recibido:', id);
    
    if (!id || isNaN(id)) {
      await transaction.rollback();
      return res.status(400).json({ status: 'error', message: 'ID de cliente inválido' });
    }

    const idCliente = parseInt(id);
    const cliente = await Clientes.findByPk(idCliente, { transaction });
    
    console.log('👤 Cliente encontrado:', cliente ? cliente.Nombre : 'NO ENCONTRADO');
    
    if (!cliente) {
      await transaction.rollback();
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    const categoriaRopa = await Categoria_Productos.findOne({
      where: { Es_Ropa: true, Estado: true },
      transaction
    });

    console.log('👕 Categoría ropa encontrada:', categoriaRopa ? categoriaRopa.Id_Categoria_Producto : 'NO ENCONTRADA');

    if (!categoriaRopa) {
      await transaction.rollback();
      return res.status(404).json({ status: 'error', message: 'No se encontró categoría de ropa configurada' });
    }

    const compras = await Ventas.findAll({
      where: { 
        Id_Cliente: idCliente, 
        Estado: {
          [Op.in]: [1, 3]
        }
      },
      attributes: ['Id_Ventas', 'Fecha', 'Total'],
      include: [{
        model: Detalle_Venta,
        as: 'Detalle_Venta',
        include: [
          {
            model: Productos,
            as: 'Id_Productos_Producto',
            where: { 
              Id_Categoria_Producto: categoriaRopa.Id_Categoria_Producto,
              Estado: true
            },
            attributes: ['Id_Productos', 'Nombre']
          },
          {
            model: Producto_Tallas,
            as: 'Id_Producto_Tallas_Producto_Talla',
            include: [{
              model: Tallas,
              as: 'Id_Tallas_Talla',
              attributes: ['Nombre']
            }]
          },
          {
            model: Detalle_Devolucion,
            as: 'Detalle_Devolucions',
            attributes: ['Id_Detalle_Devolucion', 'Cantidad']
          }
        ]
      }],
      order: [['Fecha', 'DESC']],
      transaction
    });

    console.log('🛒 Compras encontradas:', compras.length);
    
    // DEBUG DETALLADO - Agrega esto
    compras.forEach((compra, index) => {
      console.log(`   Compra ${index + 1}:`, {
        Id_Venta: compra.Id_Ventas,
        Estado: compra.Estado,
        Tiene_Detalle_Venta: !!compra.Detalle_Venta,
        Tipo_Detalle_Venta: typeof compra.Detalle_Venta,
        Es_Array: Array.isArray(compra.Detalle_Venta)
      });
      
      if (compra.Detalle_Venta && Array.isArray(compra.Detalle_Venta)) {
        compra.Detalle_Venta.forEach((detalle, detIndex) => {
          console.log(`     Detalle ${detIndex + 1}:`, {
            Id_Detalle: detalle.Id_Detalle_Venta,
            Talla_Object: detalle.Id_Producto_Tallas_Producto_Talla,
            Talla_Nombre: detalle.Id_Producto_Tallas_Producto_Talla?.Id_Tallas_Talla?.Nombre,
            Tipo_Talla_Nombre: typeof detalle.Id_Producto_Tallas_Producto_Talla?.Id_Tallas_Talla?.Nombre
          });
        });
      }
    });

    // TEMPORAL: Simplifica el código para encontrar el error
    resultado = compras.map(compra => {
      try {
        const comp = compra.toJSON();
        console.log('📋 Procesando compra:', comp.Id_Ventas);
        
        const detallesProcesados = (comp.Detalle_Venta || [])
          .map(detalle => {
            console.log('   📦 Procesando detalle:', detalle.Id_Detalle_Venta);
            
            // Simplifica temporalmente quitando el String()
            const tallaNombre = detalle.Id_Producto_Tallas_Producto_Talla?.Id_Tallas_Talla?.Nombre;
            console.log('   🏷️  Talla nombre:', tallaNombre, 'Tipo:', typeof tallaNombre);
            
            const cantidadDevuelta = (detalle.Detalle_Devolucions || [])?.reduce(
              (total, dev) => total + (parseInt(dev.Cantidad) || 0), 0
            ) || 0;
            
            const disponible = (parseInt(detalle.Cantidad) || 0) - cantidadDevuelta;

            return disponible > 0 ? {
              Id_Detalle_Venta: parseInt(detalle.Id_Detalle_Venta) || 0,
              Id_Productos: parseInt(detalle.Id_Productos) || 0,
              Id_Producto_Tallas: detalle.Id_Producto_Tallas ? parseInt(detalle.Id_Producto_Tallas) : null,
              Cantidad: parseInt(detalle.Cantidad) || 0,
              Disponible: disponible,
              Precio: parseFloat(detalle.Precio) || 0,
              Subtotal: parseFloat(detalle.Subtotal) || 0,
              Producto: {
                Id_Productos: parseInt(detalle.Id_Productos_Producto?.Id_Productos) || 0,
                Nombre: detalle.Id_Productos_Producto?.Nombre || "Producto sin nombre"
              },
              Talla: tallaNombre || 'Única'  // ← SIMPLIFICADO
            } : null;
          })
          .filter(Boolean);

        return detallesProcesados.length > 0 ? {
          Id_Venta: parseInt(comp.Id_Ventas) || 0,
          Fecha: comp.Fecha,
          Total: parseFloat(comp.Total) || 0,
          Detalles: detallesProcesados
        } : null;
      } catch (error) {
        console.error('❌ Error procesando compra:', error);
        return null;
      }
    }).filter(Boolean);

    console.log('✅ Resultado final:', resultado.length, 'compras con productos disponibles');

    await transaction.commit();

    res.json({
      status: 'success',
      data: {
        Cliente: {
          Id_Cliente: cliente.Id_Cliente,
          Nombre: cliente.Nombre,
          Documento: cliente.Documento
        },
        Compras: resultado,
        message: resultado.length === 0 
          ? 'El cliente no tiene compras de ropa disponibles para devolución' 
          : 'Compras obtenidas correctamente'
      }
    });

  } catch (error) {
    console.error('❌ ERROR en obtenerComprasRopaCliente:', error);
    console.error('❌ Stack trace:', error.stack); 
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener compras del cliente',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

