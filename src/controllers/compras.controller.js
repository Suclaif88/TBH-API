const { 
  Compras, 
  Detalle_Compra_Insumos, 
  Insumos, 
  Detalle_Compra_Productos,
  Detalle_Compra_Tallas,
  Productos,
  Producto_Tallas,
  Tallas,
  Categoria_Productos,
  Proveedores
} = require('../models');
const { sequelize } = require("../config/db");

const procesarDetalle = async (detalle, Id_Compras, compra, t) => {
  const { Id_Productos, Id_Insumos, Cantidad, Subtotal, tallas } = detalle;

  if (Id_Insumos) {
    if (!Cantidad || !Subtotal) throw new Error('Campos obligatorios faltantes para insumos.');

    const Precio_ml = parseFloat((Subtotal / Cantidad).toFixed(2));

    await Detalle_Compra_Insumos.create({
      Id_Compras,
      Id_Insumos,
      Cantidad,
      Precio_ml,
      Subtotal
    }, { transaction: t });

    const insumo = await Insumos.findByPk(Id_Insumos, { transaction: t });
    if (!insumo) throw new Error('Insumo no encontrado.');

    insumo.Stock += Cantidad;
    await insumo.save({ transaction: t });

    compra.Total += parseFloat(Subtotal);
    await compra.save({ transaction: t });
  }

  if (Id_Productos) {
    if (!Cantidad || !Subtotal) throw new Error('Campos obligatorios faltantes para productos.');

    const producto = await Productos.findByPk(Id_Productos, {
      include: { model: Categoria_Productos, as: 'Id_Categoria_Producto_Categoria_Producto' },
      transaction: t
    });

    if (!producto) throw new Error('Producto no encontrado.');

    const Precio_Unitario = parseFloat((Subtotal / Cantidad).toFixed(2));
    let CantidadFinal = Cantidad;

    if (producto.Id_Categoria_Producto_Categoria_Producto?.Es_Ropa) {
      if (!Array.isArray(tallas) || tallas.length === 0) {
        throw new Error('El producto requiere tallas.');
      }

      const totalTallaStock = tallas.reduce((acc, t) => acc + t.Cantidad, 0);
      if (totalTallaStock !== Cantidad) {
        throw new Error('Stock por tallas no coincide con cantidad total.');
      }

      for (const talla of tallas) {
        const { Id_Producto_Tallas, Cantidad: CantidadTalla } = talla;
        const productoTalla = await Producto_Tallas.findByPk(Id_Producto_Tallas, { transaction: t });

        if (!productoTalla) throw new Error(`Talla con ID ${Id_Producto_Tallas} no encontrada.`);

        await Detalle_Compra_Tallas.create({
          Id_Compras,
          Id_Productos,
          Id_Tallas: productoTalla.Id_Tallas,
          Id_Producto_Tallas,
          Cantidad: CantidadTalla
        }, { transaction: t });

        productoTalla.Stock += CantidadTalla;
        await productoTalla.save({ transaction: t });
      }

      CantidadFinal = totalTallaStock;
    }

    await Detalle_Compra_Productos.create({
      Id_Compras,
      Id_Productos,
      Cantidad: CantidadFinal,
      Precio_Unitario,
      Subtotal
    }, { transaction: t });

    producto.Precio_Compra = Precio_Unitario;
    producto.Stock += CantidadFinal;
    await producto.save({ transaction: t });

    compra.Total += parseFloat(Subtotal);
    await compra.save({ transaction: t });
  }
};

// Crear una nueva compra
exports.crearCompra = async (req, res) => {
  const { detalles, ...datosCompra } = req.body;

  const t = await sequelize.transaction();

  try {
    const nuevaCompra = await Compras.create(datosCompra, { transaction: t });

    for (const detalle of detalles) {
      await procesarDetalle(detalle, nuevaCompra.Id_Compras, nuevaCompra, t);
    }

    await t.commit();

    res.status(201).json({
      status: 'success',
      message: 'Compra y detalles registrados correctamente.',
      data: nuevaCompra
    });
  } catch (error) {
    await t.rollback();
    console.error('Error en crearCompra:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// Obtener todas las compras
exports.obtenerCompras = async (req, res) => {
  try {
    const compras = await Compras.findAll({
      include: [
        {
          model: Proveedores,
          as: "Id_Proveedores_Proveedore"
        },
        {
          model: Detalle_Compra_Insumos,
          as: "Detalle_Compra_Insumos",
          include: [
            { model: Insumos, as: "Id_Insumos_Insumo" }
          ]
        },
        {
          model: Detalle_Compra_Productos,
          as: "Detalle_Compra_Productos",
          include: [
            { model: Productos, as: "Id_Productos_Producto" }
          ]
        },
      {
        model: Detalle_Compra_Tallas,
        as: "Detalle_Compra_Tallas",
        include: [
          {
            model: Tallas,
            as: "Id_Tallas_Talla"
          },
          {
            model: Productos,
            as: "Id_Productos_Producto",
            include: [
              {
                model: Categoria_Productos,
                as: "Id_Categoria_Producto_Categoria_Producto"
              }
            ]
          }
        ]
      }
      ]
    });

    const comprasPersonalizadas = compras.map(compra => {
      const tallasAgrupadas = {};
      compra.Detalle_Compra_Tallas.forEach(talla => {
        const producto = talla.Id_Productos_Producto;
        const categoria = producto?.Id_Categoria_Producto_Categoria_Producto;

        if (categoria?.Es_Ropa) {
          const idProducto = producto.Id_Productos;
          if (!tallasAgrupadas[idProducto]) {
            tallasAgrupadas[idProducto] = {
              productoNombre: producto.Nombre,
              tallas: []
            };
          }
          tallasAgrupadas[idProducto].tallas.push({
            Talla: talla.Id_Tallas_Talla?.Nombre || "No definida",
            Cantidad: talla.Cantidad
          });
        }
      });

      const Productos = compra.Detalle_Compra_Productos.map(prod => {
        const producto = prod.Id_Productos_Producto;
        const productoId = producto?.Id_Productos;
        const conTallas = tallasAgrupadas[productoId];

        return {
          Nombre: producto?.Nombre || "No definido",
          Cantidad: prod.Cantidad,
          Precio_Unitario: prod.Precio_Unitario,
          Subtotal: prod.Subtotal,
          ...(conTallas && { Tallas: conTallas.tallas })
        };
      });

      return {
        Id_Compras: compra.Id_Compras,
        Proveedor: compra.Id_Proveedores_Proveedore.Nombre || compra.Id_Proveedores_Proveedore.Nombre_Empresa,
        Fecha: compra.Fecha,
        Total: compra.Total,
        Estado: compra.Estado,
        Insumos: compra.Detalle_Compra_Insumos.map(insumo => ({
          Id_Insumos: insumo.Id_Insumos,
          Nombre: insumo.Id_Insumos_Insumo?.Nombre || "No definido",
          Cantidad: insumo.Cantidad,
          Precio_ml: insumo.Precio_ml,
          Subtotal: insumo.Subtotal
        })),
        Productos
      };
    });


    res.json({ status: 'success', data: comprasPersonalizadas });
  } catch (error) {
    console.error('Error al obtener compras con detalles:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Obtener una compra por ID
exports.obtenerCompraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compras.findByPk(id);

    if (!compra) {
      res.status(404).json({ status:'error', message: "Compra no encontrada." });
    }

    res.json({ status: 'success', data: compra });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

  exports.obtenerCompraConDetalles = async (req, res) => {
    const { id } = req.params;

    try {
  const compra = await Compras.findByPk(id, {
    include: [
      { model: Detalle_Compra_Insumos, as: "Detalle_Compra_Insumos" },
      { model: Detalle_Compra_Productos, as: "Detalle_Compra_Productos" },
      { 
        model: Detalle_Compra_Tallas, 
        as: "Detalle_Compra_Tallas",
        include: [
          { model: Productos, as: "Id_Productos_Producto" },
          { model: Tallas, as: "Id_Tallas_Talla" }
        ]
      }
    ]
  });

      if (!compra) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }

      res.json(compra);
    } catch (error) {
      console.error('Error al obtener detalles de la compra:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };

// Actualizar el estado de una compra (solo de 1 a 0)

exports.cambiarEstadoCompra = async (req, res) => {
  const { id } = req.params;

  try {
    const compra = await Compras.findByPk(id);

    if (!compra) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Compra no encontrada.' 
      });
    }

    if (compra.Estado === false) {
      return res.status(400).json({
        status: 'error', 
        message: 'La compra ya está inactiva. No se puede volver a activar.'
      });
    }

    // Validar insumos
    const detallesInsumos = await Detalle_Compra_Insumos.findAll({
      where: { Id_Compras: id }
    });

    for (const detalle of detallesInsumos) {
      const insumo = await Insumos.findByPk(detalle.Id_Insumos);
      if (!insumo) {
        return res.status(404).json({ 
          status: 'error', 
          message: `Insumo con ID ${detalle.Id_Insumos} no encontrado.` 
        });
      }
      if (insumo.Stock < detalle.Cantidad) {
        return res.status(400).json({
          status: 'error',
          message: `No se puede anular la compra porque el insumo "${insumo.Nombre || insumo.id}" no tiene suficiente stock.`
        });
      }
    }

    // Validar productos
    const detallesProductos = await Detalle_Compra_Productos.findAll({
      where: { Id_Compras: id }
    });

    for (const detalle of detallesProductos) {
      const producto = await Productos.findByPk(detalle.Id_Productos);
      if (!producto) {
        return res.status(404).json({
          status: 'error',
          message: `Producto con ID ${detalle.Id_Productos} no encontrado.`
        });
      }
      if (producto.Stock < detalle.Cantidad) {
        return res.status(400).json({
          status: 'error',
          message: `El producto "${producto.Nombre || producto.id}" no tiene suficiente stock para revertir.`
        });
      }
    }

    // Validar tallas
    const detallesTallas = await Detalle_Compra_Tallas.findAll({
      where: { Id_Compras: id }
    });

    for (const detalle of detallesTallas) {
      const productoTalla = await Producto_Tallas.findOne({
        where: {
          Id_Productos: detalle.Id_Productos,
          Id_Tallas: detalle.Id_Tallas
        }
      });

      if (!productoTalla) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró la talla del producto con Id_Productos ${detalle.Id_Productos} e Id_Tallas ${detalle.Id_Tallas}.`
        });
      }

      if (productoTalla.Stock < detalle.Cantidad) {
        return res.status(400).json({
          status: 'error',
          message: `La talla del producto con Id_Productos ${detalle.Id_Productos} e Id_Tallas ${detalle.Id_Tallas} no tiene suficiente stock para revertir.`
        });
      }
    }

    // Revertir stock insumos
    for (const detalle of detallesInsumos) {
      const insumo = await Insumos.findByPk(detalle.Id_Insumos);
      insumo.Stock -= detalle.Cantidad;
      await insumo.save();
    }

    // Revertir stock productos
    for (const detalle of detallesProductos) {
      const producto = await Productos.findByPk(detalle.Id_Productos);
      producto.Stock -= detalle.Cantidad;
      await producto.save();
    }

    // Revertir stock tallas
    for (const detalle of detallesTallas) {
      const productoTalla = await Producto_Tallas.findOne({
        where: {
          Id_Productos: detalle.Id_Productos,
          Id_Tallas: detalle.Id_Tallas
        }
      });

      if (productoTalla) {
        productoTalla.Stock -= detalle.Cantidad;
        await productoTalla.save();
      }
    }

    // Cambiar estado de la compra
    compra.Estado = false;
    await compra.save();

    res.status(200).json({
      status: 'success',
      mensaje: 'Compra desactivada y stock revertido correctamente.',
      compra
    });

  } catch (error) {
    console.error('Error al desactivar compra:', error);
    res.status(500).json({ status: 'error', message: 'Error al desactivar la compra.' });
  }
};


