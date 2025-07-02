const { Servicios, Servicio_Imagen, Imagenes   } = require('../models');
const { subirImagenesDesdeArchivos, eliminarImagenesPorIdsArray } = require('../controllers/imagenes.controller');
const { sequelize } = require("../config/db");


exports.crearServicio = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const archivos = req.files || [];

    // 1. Crear el servicio
    const nuevoServicio = await Servicios.create(req.body, { transaction });
    const Id_Servicios = nuevoServicio.Id_Servicios;

    // 2. Subir imágenes a Cloudinary y guardarlas en tabla Imagenes
    const imagenesSubidas = await subirImagenesDesdeArchivos(archivos, transaction);

    // 3. Relacionar servicio con imágenes
    const relaciones = imagenesSubidas.map((img) => ({
      Id_Servicios,
      Id_Imagenes: img.Id_Imagenes,
    }));

    await Servicio_Imagen.bulkCreate(relaciones, { transaction });

    await transaction.commit();

    res.json({
      status: "success",
      data: nuevoServicio,
      imagenes: imagenesSubidas,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Error al crear servicio:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.listarServicio = async (req, res) => {
  try {
    const servicios = await Servicios.findAll({
      include: [
        {
          model: Imagenes,
          as: "Imagenes", // 👈 Asegúrate de que coincide con el alias del belongsToMany
          through: { attributes: [] } // omitir campos de la tabla intermedia
        }
      ]
    });
    res.json({ status: "success", data: servicios });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};



exports.obtenerServicioById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicios.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ error: 'servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};

exports.actualizarServicio = async (req, res) => {
try {
    const { id } = req.params;
    const servicio = await Servicios.findOne({ where: { Id_Servicios: id } });
    if (!servicio) {
    return res.status(404).json({ status: 'error', message: 'servicio no encontrado' });
    }
    await servicio.update(req.body, { where: { Id_Servicios: id } });
    res.json({ status: 'success', message: 'servicio actualizado' });
} catch (err) {
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




