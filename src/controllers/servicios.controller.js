const { 
  Servicios, 
  Servicio_Imagen, 
  Imagenes, 
  Empleado_Servicio, 
  Empleados 
} = require('../models');
const { subirImagenesDesdeArchivos } = require('../controllers/imagenes.controller');
const { sequelize } = require("../config/db");

// ✅ CREAR SERVICIO con empleados e imágenes
// ✅ CREAR SERVICIO con empleados e imágenes
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

    // 1. Crear el servicio
    const nuevoServicio = await Servicios.create(req.body, { transaction });
    const Id_Servicios = nuevoServicio.Id_Servicios;

    // 2. Subir imágenes y relacionarlas
    const imagenesSubidas = await subirImagenesDesdeArchivos(archivos, transaction);
    if (imagenesSubidas.length > 0) {
      const relacionesImagenes = imagenesSubidas.map((img) => ({
        Id_Servicios,
        Id_Imagenes: img.Id_Imagenes,
      }));
      await Servicio_Imagen.bulkCreate(relacionesImagenes, { transaction });
    }

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


// ✅ LISTAR SERVICIOS con imágenes y empleados
exports.listarServicio = async (req, res) => {
  try {
    const servicios = await Servicios.findAll({
      include: [
        {
          model: Imagenes,
          as: "Imagenes",
          through: { attributes: [] },
        },
        {
          model: Empleado_Servicio,
          as: "Empleado_Servicios",
          include: [
            {
              model: Empleados,
              as: "Id_Empleados_Empleado", // 👈 alias definido en asociaciones
            },
          ],
        },
      ],
    });
    res.json({ status: "success", data: servicios });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ OBTENER SERVICIO POR ID con empleados
exports.obtenerServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicios.findByPk(id, {
      include: [
        { model: Imagenes, as: "Imagenes", through: { attributes: [] } },
        {
          model: Empleado_Servicio,
          as: "Empleado_Servicios",
          include: [
            { model: Empleados, as: "Id_Empleados_Empleado" },
          ],
        },
      ],
    });
    if (!servicio) {
      return res.status(404).json({ error: 'servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};

// ✅ ACTUALIZAR SERVICIO y empleados
exports.actualizarServicio = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { empleados = [] } = req.body;

    const servicio = await Servicios.findOne({ where: { Id_Servicios: id } });
    if (!servicio) {
      return res.status(404).json({ status: 'error', message: 'servicio no encontrado' });
    }

    // 1. Actualizar datos del servicio
    await servicio.update(req.body, { transaction });

    // 2. Actualizar empleados relacionados
    await Empleado_Servicio.destroy({ where: { Id_Servicios: id }, transaction });
    if (Array.isArray(empleados) && empleados.length > 0) {
      const relacionesEmpleados = empleados.map((Id_Empleados) => ({
        Id_Servicios: id,
        Id_Empleados,
      }));
      await Empleado_Servicio.bulkCreate(relacionesEmpleados, { transaction });
    }

    await transaction.commit();
    res.json({ status: 'success', message: 'servicio actualizado' });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ status: 'error', message: err.message });
  }
};



exports.eliminarServicio = async (req, res) => {
try {
    const { id } = req.params;
    const servicio = await Servicios.findOne({ where: { Id_Servicios: id } });
    if (!servicio) {
    return res.status(404).json({ status: 'error', message: 'servicio no encontrado' });
    }
    await servicio.destroy({ where: { Id_Servicios: id } });
    res.json({ status: 'success', message: 'Servicio eliminado' });
} catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
}
};

// Cambia el estado de un Servicio (activar o desactivar)
exports.cambiarEstadoServicio = async (req, res) => {
  try {
    const id = req.params.id;

    const servicio = await Servicios.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ status: 'error', message: 'servicio no encontrado' });
    }

    servicio.Estado = !servicio.Estado;
    await servicio.save();

    res.json({
      status: 'success',
      mensaje: `servicio ${servicio.Estado ? 'activado' : 'desactivado'} correctamente`,
      servicio
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};




