const { Categoria_Productos, Productos, Tamano, Producto_Tamano, Producto_Tamano_Insumos, Insumos, Categoria_Insumos, Tamano_Insumos, Tallas, Producto_Tallas, Detalle_Compra_Productos, Detalle_Venta, Imagenes, Producto_Imagen } = require('../models');
const { subirImagenesDesdeArchivos, eliminarImagenesPorIdsArray } = require('../controllers/imagenes.controller');
const { Op } = require('sequelize');
const { sequelize } = require("../config/db");



async function asignarInsumoExtraSiPerfume(Id_Productos, InsumoExtra, transaction) {
  const tamanos = await Tamano.findAll({
    where: { Estado: true },
    transaction
  });

  for (const tamano of tamanos) {
    let productoTamano = await Producto_Tamano.findOne({
      where: {
        Id_Productos,
        Id_Tamano: tamano.Id_Tamano
      },
      transaction
    });

    if (!productoTamano) {
      productoTamano = await Producto_Tamano.create({
        Id_Productos,
        Id_Tamano: tamano.Id_Tamano
      }, { transaction });
    }

    const insumosBase = await Tamano_Insumos.findAll({
      where: { Id_Tamano: tamano.Id_Tamano },
      include: [
        {
          model: Insumos,
          as: 'Id_Insumos_Insumo',
          required: true,
          include: [
            {
              model: Categoria_Insumos,
              as: 'Id_Categoria_Insumos_Categoria_Insumo',
              required: true,
              where: { Nombre: 'Base' }
            }
          ]
        }
      ],
      transaction
    });

    const sumaBase = insumosBase.reduce((acc, item) => acc + parseFloat(item.Cantidad), 0);
    const cantidadRestante = tamano.Cantidad_Maxima - sumaBase;

    if (cantidadRestante < 0) {
      throw new Error(`El tamaño "${tamano.Nombre}" ya tiene insumos base que superan su capacidad.`);
    }

    const existente = await Producto_Tamano_Insumos.findOne({
      where: { Id_Producto_Tamano: productoTamano.Id_Producto_Tamano },
      transaction
    });

    if (existente) {
      await existente.update({
        Id_Insumos: InsumoExtra.Id_Insumos,
        Cantidad_Consumo: cantidadRestante
      }, { transaction });
    } else {
      await Producto_Tamano_Insumos.create({
        Id_Producto_Tamano: productoTamano.Id_Producto_Tamano,
        Id_Insumos: InsumoExtra.Id_Insumos,
        Cantidad_Consumo: cantidadRestante
      }, { transaction });
    }
  }
}


async function asignarTallasSiEsRopa(Id_Productos, TallasSeleccionadas, transaction) {
  if (!Array.isArray(TallasSeleccionadas) || TallasSeleccionadas.length === 0) {
    throw new Error('No se proporcionaron tallas válidas para asociar');
  }

  const relaciones = TallasSeleccionadas.map(obj => ({
    Id_Productos,
    Id_Tallas: obj.Id_Tallas,
    Stock: 0
  }));

  await Producto_Tallas.bulkCreate(relaciones, { transaction });
}


async function eliminarAsociacionesPorCambioDeCategoria(Id_Productos, eraPerfume, eraRopa, transaction) {
  if (eraPerfume) {
    const productoTamanos = await Producto_Tamano.findAll({ 
      where: { Id_Productos },
      transaction
    });

    const idsProductoTamanos = productoTamanos.map(pt => pt.Id_Producto_Tamano);

    if (idsProductoTamanos.length > 0) {
      await Producto_Tamano_Insumos.destroy({ 
        where: { Id_Producto_Tamano: idsProductoTamanos },
        transaction 
      });
    }

    await Producto_Tamano.destroy({ 
      where: { Id_Productos },
      transaction 
    });
  }

  if (eraRopa) {
    await Producto_Tallas.destroy({ 
      where: { Id_Productos },
      transaction 
    });
  }
}

exports.crearProducto = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { InsumoExtra, TallasSeleccionadas, Nombre, ...productoData } = req.body;
    const archivos = req.files || [];

    const productoExistente = await Productos.findOne({
      where: { Nombre },
      transaction
    });

    if (productoExistente) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe un producto con ese nombre.'
      });
    }

    const nuevoProducto = await Productos.create(
      { Nombre, ...productoData },
      { transaction }
    );
    const Id_Productos = nuevoProducto.Id_Productos;

    const categoria = await Categoria_Productos.findByPk(productoData.Id_Categoria_Producto, { transaction });
    if (!categoria) {
      await transaction.rollback();
      return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' });
    }

    if (categoria.Nombre === 'Perfume' && InsumoExtra) {
      await asignarInsumoExtraSiPerfume(Id_Productos, JSON.parse(InsumoExtra), transaction);
    }

    if (categoria.Es_Ropa && TallasSeleccionadas) {
      const tallasArray = typeof TallasSeleccionadas === 'string'
        ? JSON.parse(TallasSeleccionadas)
        : TallasSeleccionadas;

      await asignarTallasSiEsRopa(Id_Productos, tallasArray, transaction);
    }

    const imagenesSubidas = archivos.length > 0
      ? await subirImagenesDesdeArchivos(archivos)
      : [];

    if (imagenesSubidas.length > 0) {
      const relaciones = imagenesSubidas.map(img => ({
        Id_Productos,
        Id_Imagenes: img.Id_Imagenes
      }));

      await Producto_Imagen.bulkCreate(relaciones, { transaction });
    }

    await transaction.commit();

    res.json({
      status: 'success',
      data: nuevoProducto,
      imagenes: imagenesSubidas
    });

  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const Id_Productos = id;
    const { InsumoExtra, ImagenesEliminadas, TallasSeleccionadas, Nombre, ...nuevosDatos } = req.body;

    const producto = await Productos.findByPk(Id_Productos, { transaction: t });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    const productoDuplicado = await Productos.findOne({
      where: {
        Nombre,
        Id_Productos: { [Op.ne]: Id_Productos }
      },
      transaction: t
    });

    if (productoDuplicado) {
      await t.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe otro producto con ese nombre.'
      });
    }

    const categoriaAnterior = await producto.getId_Categoria_Producto_Categoria_Producto({ transaction: t });
    const categoriaNueva = await producto.sequelize.models.Categoria_Productos.findByPk(nuevosDatos.Id_Categoria_Producto, { transaction: t });

    const cambioCategoria = categoriaAnterior?.Id_Categoria_Producto !== categoriaNueva?.Id_Categoria_Producto;
    const eraPerfume = categoriaAnterior?.Nombre === 'Perfume';
    const esPerfume = categoriaNueva?.Nombre === 'Perfume';
    const eraRopa = categoriaAnterior?.Es_Ropa;
    const esRopa = categoriaNueva?.Es_Ropa;

    if (cambioCategoria && esPerfume && !eraPerfume && producto.Stock > 0) {
      await t.rollback();
      return res.status(400).json({
        status: 'error',
        message: `No puedes cambiar a "Perfume" si el producto tiene stock (${producto.Stock})`
      });
    }

    if (nuevosDatos.Precio_Venta === "null" || nuevosDatos.Precio_Venta === "") {
      nuevosDatos.Precio_Venta = null;
    }
    if (nuevosDatos.Precio_Compra === "null" || nuevosDatos.Precio_Compra === "") {
      nuevosDatos.Precio_Compra = null;
    }

    await producto.update({ Nombre, ...nuevosDatos }, { transaction: t });

    if (cambioCategoria) {
      await eliminarAsociacionesPorCambioDeCategoria(Id_Productos, eraPerfume, eraRopa, t);

      if (esRopa && TallasSeleccionadas) {
        const tallasArray = typeof TallasSeleccionadas === 'string'
          ? JSON.parse(TallasSeleccionadas)
          : TallasSeleccionadas;

        await asignarTallasSiEsRopa(Id_Productos, tallasArray, t);
      }
    }

    if (!cambioCategoria && esRopa && TallasSeleccionadas) {
      const tallasArray = typeof TallasSeleccionadas === 'string'
        ? JSON.parse(TallasSeleccionadas)
        : TallasSeleccionadas;

      await producto.sequelize.models.Producto_Tallas.destroy({ where: { Id_Productos }, transaction: t });
      await asignarTallasSiEsRopa(Id_Productos, tallasArray, t);
    }

    const insumoExtraParsed = typeof InsumoExtra === 'string'
      ? JSON.parse(InsumoExtra)
      : InsumoExtra;

    if (esPerfume && insumoExtraParsed) {
      await asignarInsumoExtraSiPerfume(Id_Productos, insumoExtraParsed, t);
    }

    if (ImagenesEliminadas) {
      const ids = JSON.parse(ImagenesEliminadas);
      if (Array.isArray(ids) && ids.length > 0) {
        await eliminarImagenesPorIdsArray(ids, t);
      }
    }

    if (req.files && req.files.length > 0) {
      const nuevasImagenes = await subirImagenesDesdeArchivos(req.files, t);

      const relaciones = nuevasImagenes.map(img => ({
        Id_Productos,
        Id_Imagenes: img.Id_Imagenes
      }));

      await Producto_Imagen.bulkCreate(relaciones, { transaction: t });
    }

    await t.commit();
    return res.json({ status: 'success', message: 'Producto actualizado correctamente' });

  } catch (error) {
    console.error(error);
    await t.rollback();
    const msg = error.message.includes('superan su capacidad') ? error.message : 'Error interno';
    return res.status(500).json({ status: 'error', message: msg });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      include: [
        {
          model: Categoria_Productos,
          as: "Id_Categoria_Producto_Categoria_Producto",
        },
        {
          model: Producto_Tallas,
          as: "Producto_Tallas",
          include: [
            {
              model: Tallas,
              as: "Id_Tallas_Talla",
            },
          ],
          required: false,
        },
        {
          model: Producto_Tamano,
          as: "Producto_Tamanos",
          include: [
            {
              model: Tamano,
              as: "Id_Tamano_Tamano",
            },
            {
              model: Producto_Tamano_Insumos,
              as: "Producto_Tamano_Insumos",
              include: [
                {
                  model: Insumos,
                  as: "Id_Insumos_Insumo",
                },
              ],
            },
          ],
          required: false,
        },
        {
          model: Producto_Imagen,
          as: "Producto_Imagens",
          include:[
            {
              model: Imagenes,
              as: "Id_Imagenes_Imagene",
              attributes: ['Id_Imagenes', 'URL']
            },
          ],
        },
      ],
    });

    const resultado = productos.map((producto) => {
      const categoria = producto.Id_Categoria_Producto_Categoria_Producto;
      let Detalles = {};

      if (categoria?.Es_Ropa) {
        Detalles.tallas = (producto.Producto_Tallas || []).map((pt) => ({
          nombre: pt.Id_Tallas_Talla?.Nombre,
          stock: pt.Stock,
        }));
      }

      if (categoria?.Nombre === "Perfume") {
        Detalles.tamanos = (producto.Producto_Tamanos || []).map((pt) => ({
          nombre: pt.Id_Tamano_Tamano?.Nombre,
          precio: pt.Id_Tamano_Tamano?.Precio_Venta,
          insumos: (pt.Producto_Tamano_Insumos || []).map((pti) => ({
            nombre: pti.Id_Insumos_Insumo?.Nombre,
            cantidad: pti.Cantidad_Consumo,
          })),
        }));
      }

      return {
        Id_Productos: producto.Id_Productos,
        Nombre: producto.Nombre,
        Categoria: categoria?.Nombre,
        Descripcion: producto.Descripcion,
        Precio_Venta: producto.Precio_Venta,
        Precio_Compra: producto.Precio_Compra,
        Es_Ropa: categoria?.Es_Ropa,
        Es_Perfume: categoria?.Nombre === "Perfume",
        Stock: producto.Stock,
        Estado: producto.Estado,
        Detalles,
        Imagenes: (producto.Producto_Imagens || []).map(pi => ({
          Id_Imagenes: pi.Id_Imagenes_Imagene?.Id_Imagenes,
          URL: pi.Id_Imagenes_Imagene?.URL
          }))
      };
    });

    res.json({ status: "success", data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.obtenerProductosCompras = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      where: {
        Estado: true
      },
      include: [
        {
          model: Categoria_Productos,
          as: "Id_Categoria_Producto_Categoria_Producto",
          where: {
            Id_Categoria_Producto: {
              [Op.ne]: 3,
            },
          },
        },
        {
          model: Producto_Tallas,
          as: "Producto_Tallas",
          include: [
            {
              model: Tallas,
              as: "Id_Tallas_Talla",
            },
          ],
          required: false,
        },
      ],
    });

    const resultado = productos.map((producto) => {
      const categoria = producto.Id_Categoria_Producto_Categoria_Producto;
      let Detalles = {};

      if (categoria?.Es_Ropa) {
        Detalles.tallas = (producto.Producto_Tallas || []).map((pt) => ({
          Id_Producto_Tallas: pt.Id_Producto_Tallas,
          Nombre: pt.Id_Tallas_Talla?.Nombre,
        }));
      }

      return {
        Id_Productos: producto.Id_Productos,
        Nombre: producto.Nombre,
        Categoria: categoria?.Nombre,
        Descripcion: producto.Descripcion,
        Precio_Venta: producto.Precio_Venta,
        Precio_Compra: producto.Precio_Compra,
        Es_Ropa: categoria?.Es_Ropa,
        Stock: producto.Stock,
        Estado: producto.Estado,
        Detalles,
      };
    });

    res.json({ status: "success", data: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.obtenerProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Productos.findByPk(id, {
      include: [
        {
          model: Categoria_Productos,
          as: 'Id_Categoria_Producto_Categoria_Producto',
          attributes: ['Nombre', 'Es_Ropa']
        },
        {
          model: Producto_Imagen,
          as: "Producto_Imagens",
          include: [
            {
              model: Imagenes,
              as: "Id_Imagenes_Imagene",
              attributes: ['Id_Imagenes', 'URL']
            },
          ],
        },
        {
          model: Producto_Tallas,
          as: 'Producto_Tallas',
          include: [
            {
              model: Tallas,
              as: 'Id_Tallas_Talla',
              attributes: ['Id_Tallas', 'Nombre']
            }
          ]
        }
      ]
    });

    if (!producto) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    const categoria = producto.Id_Categoria_Producto_Categoria_Producto;
    let tamanosConInsumos = [];

    if (categoria?.Nombre === 'Perfume') {
      const tamanos = await Producto_Tamano.findAll({
        where: { Id_Productos: producto.Id_Productos },
        include: [
          {
            model: Tamano,
            as: 'Id_Tamano_Tamano',
            attributes: ['Id_Tamano', 'Nombre', 'Cantidad_Maxima', 'Precio_Venta']
          },
          {
                         model: Producto_Tamano_Insumos,
             as: "Producto_Tamano_Insumos",
             include: [
               {
                 model: Insumos,
                 as: 'Id_Insumos_Insumo',
                 attributes: ['Id_Insumos', 'Nombre', 'Stock']
               }
             ]
          }
        ]
      });

      tamanosConInsumos = tamanos.map(tam => ({
        Id_Producto_Tamano: tam.Id_Producto_Tamano,
        Id_Tamano: tam.Id_Tamano,
        Nombre: tam.Id_Tamano_Tamano?.Nombre || 'N/A',
        Cantidad_Maxima: tam.Id_Tamano_Tamano?.Cantidad_Maxima || 0,
        Precio_Venta: tam.Id_Tamano_Tamano?.Precio_Venta || 0,
                 Insumos: (tam.Producto_Tamano_Insumos || []).map(insumo => ({
           Id_Insumo: insumo.Id_Insumos_Insumo?.Id_Insumos,
           Nombre: insumo.Id_Insumos_Insumo?.Nombre || 'N/A',
           Stock: insumo.Id_Insumos_Insumo?.Stock || 0,
           Cantidad_Consumo: insumo.Cantidad_Consumo || 0
         }))
      }));
    }

    let tallasSeleccionadas = [];
    if (categoria?.Es_Ropa) {
      tallasSeleccionadas = producto.Producto_Tallas?.map(pt => ({
        Id_Tallas: pt.Id_Tallas_Talla?.Id_Tallas,
        Nombre: pt.Id_Tallas_Talla?.Nombre
      })) || [];
    }

    const respuesta = {
      Id_Productos: producto.Id_Productos,
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      Precio_Compra: producto.Precio_Compra,
      Precio_Venta: producto.Precio_Venta,
      Stock: producto.Stock,
      Id_Categoria_Producto: producto.Id_Categoria_Producto,
      Categoria: {
        Nombre: categoria?.Nombre,
        Es_Ropa: categoria?.Es_Ropa
      },
      TamanosConInsumos: tamanosConInsumos,
      TallasSeleccionadas: tallasSeleccionadas,
      Imagenes: (producto.Producto_Imagens || []).map(pi => ({
        Id_Imagenes: pi.Id_Imagenes_Imagene?.Id_Imagenes,
        URL: pi.Id_Imagenes_Imagene?.URL
      }))
    };

    res.json({ status: 'success', data: respuesta });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el producto existe
    const producto = await Productos.findOne({ where: { Id_Productos: id } });
    if (!producto) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Verificar si tiene compras asociadas
    const tieneCompras = await Detalle_Compra_Productos.findOne({
      where: { Id_Productos: id }
    });

    if (tieneCompras) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede eliminar el producto porque tiene compras asociadas'
      });
    }

    // Verificar si tiene ventas asociadas
    const tieneVentas = await Detalle_Venta.findOne({
      where: { Id_Productos: id }
    });

    if (tieneVentas) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede eliminar el producto porque tiene ventas asociadas'
      });
    }

    // Si no tiene ni compras ni ventas, se elimina
    await Productos.destroy({ where: { Id_Productos: id } });

    res.json({ status: 'success', message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.cambiarEstadoProducto = async (req, res) => {
  try {
    const id = req.params.id;

    const producto = await Productos.findByPk(id);
    if (!producto) {
      return res.status(404).json({ status:'error', message: 'Producto no Encontrado' });
    }

    producto.Estado = !producto.Estado;
    await producto.save();

    res.json({
      status: 'success',
      mensaje: `Producto ${producto.Estado ? 'activado' : 'desactivado'} correctamente`,
      producto
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};