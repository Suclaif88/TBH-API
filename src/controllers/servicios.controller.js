const { Servicios, Imagenes, Servicio_Imagen } = require("../models");
const {
  subirImagenesDesdeArchivos,
} = require("../controllers/imagenes.controller");
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
    const imagenesSubidas = await subirImagenesDesdeArchivos(
      archivos,
      transaction
    );

    // 3. Relacionar empleados con el servicio
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

// Obtener servicio por ID
exports.obtenerServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicios.findByPk(id, {
      include: [
        {
          model: Imagenes,
          as: "Imagenes",
          through: { attributes: [] },
        },
      ],
    });

    if (!servicio) {
      return res
        .status(404)
        .json({ status: "error", message: "Servicio no encontrado" });
    }

    res.json({ status: "success", data: servicio });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener el servicio" });
  }
};

// Actualizar servicio
exports.actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { empleados = [] } = req.body;

    const servicio = await Servicios.findOne({ where: { Id_Servicios: id } });

    if (!servicio) {

      return res
        .status(404)
        .json({ status: "error", message: "Servicio no encontrado" });
    }

    await servicio.update(req.body);

    res.json({ status: "success", message: "Servicio actualizado" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicios.findOne({ where: { Id_Servicios: id } });

    if (!servicio) {
      return res
        .status(404)
        .json({ status: "error", message: "Servicio no encontrado" });
    }

    await servicio.destroy();

    res.json({ status: "success", message: "Servicio eliminado" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Cambiar estado (activar / desactivar)
exports.cambiarEstadoServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const servicio = await Servicios.findByPk(id);
    if (!servicio) {
      return res
        .status(404)
        .json({ status: "error", message: "Servicio no encontrado" });
    }

    servicio.Estado = !servicio.Estado;
    await servicio.save();

    res.json({
      status: "success",
      mensaje: `Servicio ${
        servicio.Estado ? "activado" : "desactivado"
      } correctamente`,
      data: servicio,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
