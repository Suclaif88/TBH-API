const { Categoria_Insumos, Insumos } = require('../models');
const { Op } = require("sequelize");

/*
* Crear una nueva categoría de insumo
* Verifica que el nombre y la descripción cumplan con las validaciones
* Verifica que no exista otra categoría con el mismo nombre
*/
exports.crearCategoria = async (req, res) => {
  try {
    let { Nombre, Descripcion } = req.body;

    // --- Validaciones básicas ---
    if (!Nombre || !Nombre.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre es obligatorio.',
      });
    }

    if (!Descripcion || !Descripcion.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'La descripción es obligatoria.',
      });
    }

    // Eliminar espacios al inicio y final
    Nombre = Nombre.trim();
    Descripcion = Descripcion.trim();

    // --- Validaciones estrictas ---
    if (Nombre.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre debe tener al menos 3 caracteres.',
      });
    }

    if (Nombre.includes(" ")) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre no debe contener espacios.',
      });
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+$/.test(Nombre)) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre solo debe contener letras y números, sin espacios.',
      });
    }

    if (Descripcion.length < 5 || Descripcion.length > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'La descripción debe tener entre 5 y 100 caracteres.',
      });
    }

    // --- Duplicado ---
    const categoriaExistente = await Categoria_Insumos.findOne({
      where: { Nombre }
    });

    if (categoriaExistente) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe una categoría con ese nombre.',
      });
    }

    // --- Crear categoría ---
    const nuevaCategoria = await Categoria_Insumos.create({
      Nombre,
      Descripcion,
      Estado: 1,
    });

    res.status(201).json({
      status: 'success',
      message: 'Categoría de insumo creada exitosamente.',
      data: nuevaCategoria,
    });


  } catch (err) {
    console.error('Error al crear categoría:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la categoría de insumo',
    });
  }
};

/*
*--------------------------------------------------------------------------
*/

/*
* Listar todas las categorías de insumos
* Incluye los insumos asociados a cada categoría
*/


exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria_Insumos.findAll({
      include: [
        {
          model: Insumos,
          as: 'Insumos',
        }
      ],
    });
    res.json({ status: 'success', data: categorias });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/*
*--------------------------------------------------------------------------
*/

/*
* Obtener una categoría de insumo por ID
* Incluye los insumos asociados a esa categoría
*/

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria_Insumos.findByPk(id, {
      include: [
        {
          model: Insumos,
          as: 'Insumos',
        },
      ],
    });

    if (!categoria) {
      return res.status(404).json({
        status: 'error',
        message: `No se encontró categoría con id ${id}`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: categoria,
    });
  } catch (err) {
    console.error(`Error al obtener categoría con id ${req.params.id}:`, err);
    res.status(500).json({
      status: 'error',
      message: 'Error del servidor al obtener la categoría.',
    });
  }
};

/*
*--------------------------------------------------------------------------
*/

/*
* Actualizar una categoría de insumo
* Verifica que el nombre y la descripción cumplan con las validaciones
* Verifica que no exista otra categoría con el mismo nombre
*/

exports.actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    let { Nombre, Descripcion } = req.body;

    const categoria = await Categoria_Insumos.findOne({
      where: { Id_Categoria_Insumos: id }
    });

    if (!categoria) {
      return res.status(404).json({
        status: 'error',
        message: 'Categoría de insumo no encontrada',
      });
    }

    // --- Validaciones ---
    if (!Nombre || !Nombre.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre es obligatorio.',
      });
    }

    if (!Descripcion || !Descripcion.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'La descripción es obligatoria.',
      });
    }

    Nombre = Nombre.trim();
    Descripcion = Descripcion.trim();

    if (Nombre.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre debe tener al menos 3 caracteres.',
      });
    }

    if (Nombre.includes(" ")) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre no debe contener espacios.',
      });
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]+$/.test(Nombre)) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre solo debe contener letras y números sin espacios.',
      });
    }

    if (Descripcion.length < 5 || Descripcion.length > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'La descripción debe tener entre 5 y 100 caracteres.',
      });
    }

    // --- Verificar duplicado en otras categorías ---
    const duplicada = await Categoria_Insumos.findOne({
      where: {
        Nombre,
        Id_Categoria_Insumos: { [Op.ne]: id }
      }
    });

    if (duplicada) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe otra categoría con ese nombre.',
      });
    }

    // --- Actualizar ---
    await Categoria_Insumos.update(
      { Nombre, Descripcion },
      { where: { Id_Categoria_Insumos: id } }
    );

    res.json({
      status: 'success',
      message: 'Categoría de insumo actualizada exitosamente.',
    });

  } catch (err) {
    console.error('Error al actualizar categoría:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor.',
    });
  }
};

/*
*--------------------------------------------------------------------------
*/

/*
* Cambiar el estado de una categoría de insumo
* Si la categoría está activa, se desactiva y viceversa
*/


exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria_Insumos.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' });
    }

    categoria.Estado = !categoria.Estado;
    await categoria.save();

    res.json({ status: 'success', data: categoria });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/*
*--------------------------------------------------------------------------
*/

/*
* Eliminar una categoría de insumo
* Verifica si la categoría tiene insumos asociados antes de eliminarla
*/

exports.eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria_Insumos.findOne({ where: { Id_Categoria_Insumos: id } });
    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'Categoría no encontrada' });
    }

    const insumosAsociados = await Insumos.count({ where: { Id_Categoria_Insumos: id } });
    if (insumosAsociados > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede eliminar la categoría porque tiene insumos asociados',
      });
    }

    await Categoria_Insumos.destroy({ where: { Id_Categoria_Insumos: id } });
    res.json({ status: 'success', message: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error interno en el servidor' });
  }
};

/*
*--------------------------------------------------------------------------
*/
