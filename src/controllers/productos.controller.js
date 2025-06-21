const { Categoria_Productos, Productos, Tamano, Producto_Tamano, Producto_Tamano_Insumos, Insumos, Categoria_Insumos, Tamano_Insumos, Tallas, Producto_Tallas, Detalle_Compra_Productos, Detalle_Venta, Imagenes, Producto_Imagen } = require('../models');
const { subirImagenesDesdeArchivos, eliminarImagenesPorIdsArray } = require('../controllers/imagenes.controller');


async function asignarInsumoExtraSiPerfume(Id_Productos, InsumoExtra) {
  const tamanos = await Tamano.findAll({ where: { Estado: true } });

  for (const tamano of tamanos) {
    let productoTamano = await Producto_Tamano.findOne({
      where: {
        Id_Productos,
        Id_Tamano: tamano.Id_Tamano
      }
    });

    if (!productoTamano) {
      productoTamano = await Producto_Tamano.create({
        Id_Productos,
        Id_Tamano: tamano.Id_Tamano
      });
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
      ]
    });

    const sumaBase = insumosBase.reduce((acc, item) => acc + parseFloat(item.Cantidad), 0);
    const cantidadRestante = tamano.Cantidad_Maxima - sumaBase;

    if (cantidadRestante < 0) {
      throw new Error(`El tamaño "${tamano.Nombre}" ya tiene insumos base que superan su capacidad.`);
    }

    const existente = await Producto_Tamano_Insumos.findOne({
      where: { Id_Producto_Tamano: productoTamano.Id_Producto_Tamano }
    });

    if (existente) {
      await existente.update({
        Id_Insumos: InsumoExtra.Id_Insumos,
        Cantidad_Consumo: cantidadRestante
      });
    } else {
      await Producto_Tamano_Insumos.create({
        Id_Producto_Tamano: productoTamano.Id_Producto_Tamano,
        Id_Insumos: InsumoExtra.Id_Insumos,
        Cantidad_Consumo: cantidadRestante
      });
    }
  }
}

async function asignarTallasSiEsRopa(Id_Productos, Id_Categoria_Producto) {
  const tallas = await Tallas.findAll({
    where: { Id_Categoria_Producto }
  });

  const relaciones = tallas.map(talla => ({
    Id_Productos,
    Id_Tallas: talla.Id_Tallas,
    Stock: 0
  }));

  await Producto_Tallas.bulkCreate(relaciones);
}

async function eliminarAsociacionesPorCambioDeCategoria(Id_Productos, eraPerfume, eraRopa) {
  if (eraPerfume) {
    const productoTamanos = await Producto_Tamano.findAll({ where: { Id_Productos } });
    const idsProductoTamanos = productoTamanos.map(pt => pt.Id_Producto_Tamano);

    await Producto_Tamano_Insumos.destroy({ where: { Id_Producto_Tamano: idsProductoTamanos } });
    await Producto_Tamano.destroy({ where: { Id_Productos } });
  }

  if (eraRopa) {
    await Producto_Tallas.destroy({ where: { Id_Productos } });
  }
}

exports.crearProducto = async (req, res) => {
  try {
    const { InsumoExtra, ...productoData } = req.body;
    const archivos = req.files || [];

    // Crear producto
    const nuevoProducto = await Productos.create(productoData);
    const Id_Productos = nuevoProducto.Id_Productos;

    // Categoría
    const categoria = await Categoria_Productos.findByPk(productoData.Id_Categoria_Producto);
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' });
    }

    if (categoria.Nombre === 'Perfume' && InsumoExtra) {
      await asignarInsumoExtraSiPerfume(Id_Productos, JSON.parse(InsumoExtra));
    }

    if (categoria.Es_Ropa) {
      await asignarTallasSiEsRopa(Id_Productos, productoData.Id_Categoria_Producto);
    }

    // Subir imágenes si vienen
    const imagenesSubidas = archivos.length > 0
      ? await subirImagenesDesdeArchivos(archivos)
      : [];

    // Relacionarlas
    if (imagenesSubidas.length > 0) {
      const relaciones = imagenesSubidas.map(img => ({
        Id_Productos,
        Id_Imagenes: img.Id_Imagenes
      }));

      await Producto_Imagen.bulkCreate(relaciones);
    }

    res.json({
      status: 'success',
      data: nuevoProducto,
      imagenes: imagenesSubidas
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const Id_Productos = id;

    const { InsumoExtra, ImagenesEliminadas, ...nuevosDatos } = req.body;

    const producto = await Productos.findByPk(Id_Productos);
    if (!producto) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    // Validar cambio de categoría
    const categoriaAnterior = await Categoria_Productos.findByPk(producto.Id_Categoria_Producto);
    const categoriaNueva = await Categoria_Productos.findByPk(nuevosDatos.Id_Categoria_Producto);

    const cambioCategoria = categoriaAnterior?.Id_Categoria_Producto !== categoriaNueva?.Id_Categoria_Producto;
    const eraPerfume = categoriaAnterior?.Nombre === 'Perfume';
    const esPerfume = categoriaNueva?.Nombre === 'Perfume';
    const eraRopa = categoriaAnterior?.Es_Ropa;
    const esRopa = categoriaNueva?.Es_Ropa;

    if (cambioCategoria && esPerfume && !eraPerfume && producto.Stock > 0) {
      return res.status(400).json({
        status: 'error',
        message: `No puedes cambiar a "Perfume" si el producto tiene stock (${producto.Stock})`
      });
    }

    // Actualizar datos principales
    await producto.update(nuevosDatos);

    // Si hay cambio de categoría, eliminar asociaciones previas
    if (cambioCategoria) {
      await eliminarAsociacionesPorCambioDeCategoria(Id_Productos, eraPerfume, eraRopa);

      if (esRopa) {
        await asignarTallasSiEsRopa(Id_Productos, nuevosDatos.Id_Categoria_Producto);
      }
    }

    // Si sigue siendo perfume, reasignar insumo extra
    if (esPerfume && InsumoExtra) {
      await asignarInsumoExtraSiPerfume(Id_Productos, InsumoExtra);
    }

    // Eliminar imágenes si vienen
    if (ImagenesEliminadas) {
      const ids = JSON.parse(ImagenesEliminadas);
      if (Array.isArray(ids) && ids.length > 0) {
        await eliminarImagenesPorIdsArray(ids);
      }
    }

    // Subir imágenes nuevas si vienen
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = await subirImagenesDesdeArchivos(req.files);

      for (const img of nuevasImagenes) {
        await Producto_Imagen.create({
          Id_Productos,
          Id_Imagenes: img.Id_Imagenes
        });
      }
    }

    return res.json({ status: 'success', message: 'Producto actualizado correctamente' });

  } catch (error) {
    console.error(error);
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
          include:[
            {
              model: Imagenes,
              as: "Id_Imagenes_Imagene",
              attributes: ['Id_Imagenes', 'URL']
            },
          ],
        },
      ]
    });

    if (!producto) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    const categoria = producto.Id_Categoria_Producto_Categoria_Producto;
    let insumoExtra = null;

    // Si es Perfume, buscar insumo asociado
    if (categoria?.Nombre === 'Perfume') {
      const tamanos = await Producto_Tamano.findAll({
        where: { Id_Productos: producto.Id_Productos },
        as: "Producto_Tamano",
        include: [
          {
            model: Producto_Tamano_Insumos,
            as: "Producto_Tamano_Insumos",
            include: [
              {
                model: Insumos,
                as: 'Id_Insumos_Insumo',
                attributes: ['Id_Insumos', 'Nombre']
              }
            ]
          }
        ]
      });

      for (const tam of tamanos) {
        const insumoAsociado = tam.Producto_Tamano_Insumos?.[0];
        if (insumoAsociado?.Id_Insumos_Insumo) {
          insumoExtra = {
            Id_Insumos: insumoAsociado.Id_Insumos_Insumo.Id_Insumos,
            Nombre: insumoAsociado.Id_Insumos_Insumo.Nombre
          };
          break;
        }
      }
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
      InsumoExtra: insumoExtra,
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