const { Insumos, Categoria_Insumos, Detalle_Compra_Insumos } = require("../models");
const { Op } = require('sequelize');


/**
 * --------------------------------------------------------------------------------------
 * Listar insumos
 * --------------------------------------------------------------------------------------
 */
exports.listarInsumos = async (req, res) => {
  try {
    const insumos = await Insumos.findAll({
      include: [
        {
          model: Categoria_Insumos,
          as: 'Id_Categoria_Insumos_Categoria_Insumo',
          attributes: ['Nombre'],
        },
        {
          model: Detalle_Compra_Insumos,
          as: 'Detalle_Compra_Insumos',
          attributes: ['Id_Detalle_Insumos'],
        },
      ],
    });

    const procesados = insumos.map(insumo => {
      const i = insumo.toJSON();
      i.TieneCompras = i.Detalle_Compra_Insumos.length > 0;
      delete i.Detalle_Compra_Insumos;
      return i;
    });

    res.json({ status: 'success', data: procesados });
  } catch (err) {
    console.error("Error al listar insumos:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Obtener insumo por ID
 * --------------------------------------------------------------------------------------
 */

exports.obtenerInsumoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumos.findByPk(id);

    if (!insumo) {
      return res.status(404).json({ 
        status: 'error', 
        message: `No se encontró insumo con id ${id}`
      });
    }

    res.status(200).json({
       status: 'success',
       data: insumo
    });
  } catch (err) {
    console.error(`Error al obtener insumo con id ${req.params.id}:`, err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */

 /**
 * --------------------------------------------------------------------------------------
 * Crear insumo
 * --------------------------------------------------------------------------------------
 */

exports.crearInsumo = async (req, res) => {
  try {
    const { Nombre, Stock, Id_Categoria_Insumos } = req.body;

    // --- Validaciones ---
    const nombreTrim = Nombre?.trim();

    if (!nombreTrim) {
      return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });
    }

    if (nombreTrim.length < 3) {
      return res.status(400).json({ status: "error", message: "El nombre debe tener al menos 3 caracteres" });
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9\s]+$/.test(nombreTrim)) {
      return res.status(400).json({
        status: "error",
        message: "El nombre solo puede contener letras, números y espacios",
      });
    }

    const stockParsed = Number(Stock);
    if (isNaN(stockParsed) || stockParsed < 0) {
      return res.status(400).json({
        status: "error",
        message: "El stock debe ser un número válido mayor o igual a cero",
      });
    }

    if (!Id_Categoria_Insumos) {
      return res.status(400).json({
        status: "error",
        message: "Debe seleccionar una categoría válida",
      });
    }

    // --- Validar existencia de la categoría ---
    const categoria = await Categoria_Insumos.findByPk(Id_Categoria_Insumos);
    if (!categoria) {
      return res.status(404).json({
        status: "error",
        message: "La categoría seleccionada no existe",
      });
    }

    // --- Validar duplicados ---
    const duplicado = await Insumos.findOne({
      where: { Nombre: nombreTrim },
    });

    if (duplicado) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe un insumo con ese nombre",
      });
    }

    // --- Crear insumo ---
    const nuevo = await Insumos.create({
      Nombre: nombreTrim,
      Stock: stockParsed,
      Id_Categoria_Insumos,
    });

    return res.status(201).json({
      status: "success",
      message: "Insumo creado correctamente",
      data: nuevo,
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */


 /**
 * --------------------------------------------------------------------------------------
 * Actualizar insumo
 * --------------------------------------------------------------------------------------
 */
exports.actualizarInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Stock, Id_Categoria_Insumos } = req.body;

    const insumo = await Insumos.findOne({ where: { Id_Insumos: id } });
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }

    // --- Validaciones ---
    if (!Nombre || !Nombre.trim()) {
      return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });
    }

    if (Nombre.trim().length < 3) {
      return res.status(400).json({ status: "error", message: "El nombre debe tener al menos 3 caracteres" });
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(Nombre.trim())) {
      return res.status(400).json({ status: "error", message: "El nombre solo puede contener letras, números y espacios" });
    }

    if (Stock < 0 || isNaN(Stock)) {
      return res.status(400).json({ status: "error", message: "El stock debe ser un número válido mayor o igual a cero" });
    }

    if (!Id_Categoria_Insumos) {
      return res.status(400).json({ status: "error", message: "Debe seleccionar una categoría válida" });
    }

    const categoria = await Categoria_Insumos.findByPk(Id_Categoria_Insumos);
    if (!categoria) {
      return res.status(404).json({ status: "error", message: "La categoría seleccionada no existe" });
    }

    // --- Validar que no esté duplicado con otro insumo ---
    const duplicado = await Insumos.findOne({
      where: {
        Nombre: Nombre.trim(),
        Id_Insumos: { [Op.ne]: id },
      },
    });

    if (duplicado) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe otro insumo con ese nombre",
      });
    }

    // --- Actualizar ---
    await Insumos.update(
      {
        ...req.body,
        Nombre: Nombre.trim(),
      },
      { where: { Id_Insumos: id } }
    );

    res.json({ status: 'success', message: 'Insumo actualizado correctamente' });

  } catch (err) {
    console.error("Error al actualizar insumo:", err);
    res.status(500).json({ status: 'error', message: "Error interno del servidor" });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */

 /**
 * --------------------------------------------------------------------------------------
 * Cambiar estado de insumo
 * --------------------------------------------------------------------------------------
 */

exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;

    const insumo = await Insumos.findByPk(id);
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }

    insumo.Estado = !insumo.Estado;
    await insumo.save();

    res.json({ status: 'success', data: insumo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */

 /**
 * --------------------------------------------------------------------------------------
 * Eliminar insumo
 * --------------------------------------------------------------------------------------
 */


exports.eliminarInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumos.findOne({ where: { Id_Insumos: id } });
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }
    await Insumos.destroy({ where: { Id_Insumos: id } });
    res.json({ status: 'success', message: 'Insumo eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Obtener insumos activos
 * --------------------------------------------------------------------------------------
 */

exports.obtenerInsumosActivos = async (req, res) => {
  try {
    const insumosActivos = await Insumos.findAll({
      where: {
        Estado: true
      },
      include: {
        model: Categoria_Insumos,
        as: 'Id_Categoria_Insumos_Categoria_Insumo',
        attributes: ['Nombre'],
      },
    });

    const respuesta = insumosActivos.map((insumo) => ({
      Id_Insumos: insumo.Id_Insumos,
      Nombre: insumo.Nombre,
      Stock: insumo.Stock,
      Estado: insumo.Estado,
      Id_Categoria_Insumos: insumo.Id_Categoria_Insumos,
      Categoria: insumo.Id_Categoria_Insumos_Categoria_Insumo?.Nombre || "Sin Categoría",
    }));

    res.json({ status: 'success', data: respuesta });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */

/**
 * --------------------------------------------------------------------------------------
 * Obtener insumos por nombre de categoría dinámica
 * Ejemplo: /insumos/categoria/Base o /insumos/categoria/Frasco
 * nando sos un fracaso y me toco refactorizar tu código
 * --------------------------------------------------------------------------------------
 */
exports.obtenerInsumosPorCategoria = async (req, res) => {
  try {
    const { nombre } = req.params;

    const insumos = await Insumos.findAll({
      where: {
        Estado: true
      },
      include: [
        {
          model: Categoria_Insumos,
          as: "Id_Categoria_Insumos_Categoria_Insumo",
          where: {
            Nombre: nombre
          },
          attributes: ['Nombre']
        }
      ]
    });

    res.json({ status: 'success', data: insumos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 *--------------------------------------------------------------------------------------
 */