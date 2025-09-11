// controllers/servicios.controller.js
const { Sequelize } = require("sequelize");
const { Servicios, Imagenes, Servicio_Imagen, Empleado_Servicio } = require("../models");
const { subirImagenesDesdeArchivos } = require("../controllers/imagenes.controller");
const { sequelize } = require("../config/db");

// Crear servicio
exports.crearServicio = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const archivos = req.files || [];
    let { empleados = "[]" } = req.body; // viene como string en form-data

    // 🔹 Asegurar que empleados sea array
    if (typeof empleados === "string") {
      try {
        empleados = JSON.parse(empleados);
      } catch {
        empleados = [];
      }
    }

    // 1. Crear servicio
    const nuevoServicio = await Servicios.create(req.body, { transaction });
    const Id_Servicios = nuevoServicio.Id_Servicios;

    // 2. Subir imágenes
    const imagenesSubidas = await subirImagenesDesdeArchivos(archivos, transaction);

    // 3. Relacionar imágenes con el servicio
    if (imagenesSubidas && imagenesSubidas.length > 0) {
      const relacionesImagenes = imagenesSubidas.map((imagen) => ({
        Id_Servicios,
        Id_Imagenes: imagen.Id_Imagenes,
      }));
      await Servicio_Imagen.bulkCreate(relacionesImagenes, { transaction });
    }

    // 4. Relacionar empleados con el servicio
    if (Array.isArray(empleados) && empleados.length > 0) {
      const relacionesEmpleados = empleados.map((Id_Empleados) => ({
        Id_Servicios,
        Id_Empleados,
      }));
      await Empleado_Servicio.bulkCreate(relacionesEmpleados, { transaction });
    }

    await transaction.commit();

    res.json({
      status: "success",
      data: nuevoServicio,
      imagenes: imagenesSubidas,
      empleados,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error al crear servicio:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 📌 1. Obtener TODOS los servicios (Admin)
exports.obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicios.findAll({
      include: [
        {
          model: Imagenes,
          as: "Imagenes",
          through: { attributes: [] },
        },
      ],
    });

    res.json({ status: "success", data: servicios });
  } catch (err) {
    console.error("Error al obtener servicios:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// 📌 2. Obtener SOLO los servicios ACTIVOS (Landing)
exports.obtenerServiciosActivos = async (req, res) => {
  try {
    const servicios = await Servicios.findAll({
      where: { Estado: true },
      include: [
        {
          model: Imagenes,
          as: "Imagenes",
          through: { attributes: [] },
        },
      ],
    });

    res.json({ status: "success", data: servicios });
  } catch (err) {
    console.error("Error al obtener servicios activos:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Obtener servicio por ID (para edición)
exports.obtenerServicioById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el servicio con todas sus relaciones
    const servicio = await Servicios.findByPk(id, {
      include: [
        {
          model: Imagenes,
          as: "Imagenes",
          through: { attributes: [] },
        },
        {
          model: Empleado_Servicio,
          as: "Empleado_Servicios",
          attributes: ["Id_Empleados"],
        },
      ],
    });

    if (!servicio) {
      return res.status(404).json({ status: "error", message: "Servicio no encontrado" });
    }

    // Extraer los IDs de empleados asociados
    const empleadosAsociados = servicio.Empleado_Servicios
      ? servicio.Empleado_Servicios.map((rel) => rel.Id_Empleados)
      : [];

    // Formatear la respuesta con toda la información necesaria para edición
    const servicioCompleto = {
      ...servicio.toJSON(),
      empleados: empleadosAsociados,
    };

    res.json({
      status: "success",
      data: servicioCompleto,
    });
  } catch (error) {
    console.error("Error al obtener servicio por ID:", error);
    res.status(500).json({ status: "error", message: "Error al obtener el servicio" });
  }
};

// Actualizar servicio
exports.actualizarServicio = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const archivos = req.files || [];
    let { empleados = [] } = req.body;

    // Asegurar que empleados sea array
    if (typeof empleados === "string") {
      try {
        empleados = JSON.parse(empleados);
      } catch {
        empleados = [];
      }
    }

    const servicio = await Servicios.findOne({
      where: { Id_Servicios: id },
      transaction,
    });

    if (!servicio) {
      await transaction.rollback();
      return res.status(404).json({ status: "error", message: "Servicio no encontrado" });
    }

    // Actualizar datos del servicio
    await servicio.update(req.body, { transaction });

    // Manejar imágenes: eliminar las anteriores y agregar las nuevas
    let imagenesSubidas = [];
    if (archivos && archivos.length > 0) {
      // 1. Obtener las imágenes actuales del servicio
      const servicioConImagenes = await Servicios.findByPk(id, {
        include: [
          {
            model: Imagenes,
            as: "Imagenes",
            through: { attributes: [] },
          },
        ],
        transaction,
      });

      // 2. Eliminar las imágenes anteriores de Cloudinary y la base de datos
      if (servicioConImagenes && servicioConImagenes.Imagenes && servicioConImagenes.Imagenes.length > 0) {
        const cloudinary = require("../config/cloudinaryConfig");

        for (const imagen of servicioConImagenes.Imagenes) {
          try {
            const urlParts = imagen.URL.split("/");
            const fileName = urlParts[urlParts.length - 1];
            const publicId = `imagenes/${fileName.split(".")[0]}`;

            await cloudinary.uploader.destroy(publicId);
            await imagen.destroy({ transaction });
          } catch (error) {
            console.error("Error al eliminar imagen anterior de Cloudinary:", error);
          }
        }
      }

      // 3. Eliminar todas las relaciones de imágenes existentes
      await Servicio_Imagen.destroy({
        where: { Id_Servicios: id },
        transaction,
      });

      // 4. Subir las nuevas imágenes
      imagenesSubidas = await subirImagenesDesdeArchivos(archivos, transaction);

      // 5. Relacionar las nuevas imágenes con el servicio
      if (imagenesSubidas && imagenesSubidas.length > 0) {
        const relacionesImagenes = imagenesSubidas.map((imagen) => ({
          Id_Servicios: id,
          Id_Imagenes: imagen.Id_Imagenes,
        }));
        await Servicio_Imagen.bulkCreate(relacionesImagenes, { transaction });
      }
    }

    // Actualizar empleados asociados
    if (Array.isArray(empleados)) {
      // Eliminar relaciones existentes
      await Empleado_Servicio.destroy({
        where: { Id_Servicios: id },
        transaction,
      });

      // Crear nuevas relaciones
      if (empleados.length > 0) {
        const relacionesEmpleados = empleados.map((Id_Empleados) => ({
          Id_Servicios: id,
          Id_Empleados,
        }));
        await Empleado_Servicio.bulkCreate(relacionesEmpleados, { transaction });
      }
    }

    await transaction.commit();

    res.json({
      status: "success",
      message: "Servicio actualizado correctamente",
      data: {
        Id_Servicios: servicio.Id_Servicios,
        empleados: empleados,
        imagenes: imagenesSubidas,
      },
    });
  } catch (err) {
    try {
      if (transaction) await transaction.rollback();
    } catch (rbErr) {
      console.error("Error en rollback (actualizarServicio):", rbErr);
    }
    console.error("Error al actualizar servicio:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ---------- CORRECCIÓN PRINCIPAL: eliminarServicio ----------
exports.eliminarServicio = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;

    // Validación básica del id
    if (!id || isNaN(Number(id))) {
      if (transaction) await transaction.rollback();
      return res.status(400).json({ status: "error", message: "Id inválido" });
    }

    const servicio = await Servicios.findOne({
      where: { Id_Servicios: id },
      include: [
        {
          model: Imagenes,
          as: "Imagenes",
          through: { attributes: [] },
        },
      ],
      transaction,
    });

    if (!servicio) {
      if (transaction) await transaction.rollback();
      return res.status(404).json({ status: "error", message: "Servicio no encontrado" });
    }

    // Eliminar relaciones de empleados
    await Empleado_Servicio.destroy({
      where: { Id_Servicios: id },
      transaction,
    });

    // Eliminar relaciones de imágenes (tabla intermedia)
    await Servicio_Imagen.destroy({
      where: { Id_Servicios: id },
      transaction,
    });

    // Eliminar las imágenes de Cloudinary y de la base de datos (no aborta si Cloudinary falla)
    if (servicio.Imagenes && servicio.Imagenes.length > 0) {
      const cloudinary = require("../config/cloudinaryConfig");

      for (const imagen of servicio.Imagenes) {
        try {
          const urlParts = imagen.URL.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const publicId = `imagenes/${fileName.split(".")[0]}`;

          await cloudinary.uploader.destroy(publicId);
          await imagen.destroy({ transaction });
        } catch (error) {
          console.error("Warning: fallo eliminando imagen en Cloudinary o DB (seguimos):", error);
        }
      }
    }

    // Intentar eliminar el servicio (aquí puede saltar FK constraint)
    await servicio.destroy({ transaction });

    await transaction.commit();
    return res.json({ status: "success", message: "Servicio eliminado correctamente" });
  } catch (err) {
    // Rollback seguro
    try {
      if (transaction) await transaction.rollback();
    } catch (rbErr) {
      console.error("Error en rollback (eliminarServicio):", rbErr);
    }

    console.error("Error al eliminar servicio (stack):", err.stack || err);

    // Manejo específico para errores de FK
    if (err instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(409).json({
        status: "error",
        message: "No se puede eliminar el servicio: existen registros relacionados en otras tablas.",
        detail: err.parent?.detail || null,
        sql: err.sql || null,
      });
    }

    if (err instanceof Sequelize.DatabaseError) {
      return res.status(500).json({
        status: "error",
        message: "Error de base de datos al eliminar servicio.",
        detail: err.parent?.detail || err.message,
      });
    }

    return res.status(500).json({ status: "error", message: err.message || "Error interno del servidor" });
  }
};
// -----------------------------------------------------------

exports.eliminarImagenServicio = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id, imagenId } = req.params;

    // Verificar que el servicio existe
    const servicio = await Servicios.findByPk(id, { transaction });
    if (!servicio) {
      if (transaction) await transaction.rollback();
      return res.status(404).json({ status: "error", message: "Servicio no encontrado" });
    }

    // Verificar que la imagen existe y está relacionada con el servicio
    const relacionImagen = await Servicio_Imagen.findOne({
      where: {
        Id_Servicios: id,
        Id_Imagenes: imagenId,
      },
      transaction,
    });

    if (!relacionImagen) {
      if (transaction) await transaction.rollback();
      return res.status(404).json({ status: "error", message: "Imagen no encontrada en este servicio" });
    }

    // Obtener la imagen para eliminar de Cloudinary
    const imagen = await Imagenes.findByPk(imagenId, { transaction });
    if (imagen) {
      try {
        const cloudinary = require("../config/cloudinaryConfig");
        const urlParts = imagen.URL.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `imagenes/${fileName.split(".")[0]}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error al eliminar imagen de Cloudinary:", error);
      }
    }

    // Eliminar la relación
    await Servicio_Imagen.destroy({
      where: {
        Id_Servicios: id,
        Id_Imagenes: imagenId,
      },
      transaction,
    });

    // Eliminar la imagen de la base de datos
    if (imagen) {
      await imagen.destroy({ transaction });
    }

    await transaction.commit();

    res.json({
      status: "success",
      message: "Imagen eliminada correctamente del servicio",
    });
  } catch (err) {
    try {
      if (transaction) await transaction.rollback();
    } catch (rbErr) {
      console.error("Error en rollback (eliminarImagenServicio):", rbErr);
    }
    console.error("Error al eliminar imagen del servicio:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Cambiar estado (activar / desactivar)
exports.cambiarEstadoServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await Servicios.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ status: "error", message: "Servicio no encontrado" });
    }

    servicio.Estado = !servicio.Estado;
    await servicio.save();

    res.json({
      status: "success",
      mensaje: `Servicio ${servicio.Estado ? "activado" : "desactivado"} correctamente`,
      data: servicio,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
  