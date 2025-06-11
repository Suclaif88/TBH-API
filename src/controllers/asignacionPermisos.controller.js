const { Rol_Permiso } = require('../models');

exports.crearRolPermiso = async (req, res) => {
  try {
    const { Rol_Id, Permisos } = req.body;

    if (!Array.isArray(Permisos)) {
      return res.status(400).json({ status: 'error', message: 'El campo Permisos debe ser un array' });
    }

    if (Permisos.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Debe asignar al menos un permiso' });
    }

    await Rol_Permiso.destroy({ where: { Rol_Id } });

    const asignaciones = await Promise.all(
      Permisos.map((Permiso_Id) =>
        Rol_Permiso.create({ Rol_Id, Permiso_Id })
      )
    );

    res.json({ status: 'success', data: asignaciones });
  } catch (err) {
    console.error("Error en crearRolPermiso:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRolPermisos = async (req, res) => {
  try {
    const lista = await Rol_Permiso.findAll();
    res.json({ status: 'success', data: lista });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRolPermisoId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Rol_Permiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    res.json({ status: 'success', data: item });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarPermisosPorRol = async (req, res) => {
  try {
    const { rolId } = req.params;

    const permisos = await Rol_Permiso.findAll({
      where: { Rol_Id: rolId },
      attributes: ["Permiso_Id"]
    });

    res.json({ status: "success", data: permisos });
  } catch (err) {
    console.error("Error al listar permisos por Rol_Id:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


exports.actualizarRolPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Rol_Permiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    const { rol_id, permiso_id } = req.body;

    await Rol_Permiso.update({ rol_id, permiso_id }, { where: { id } });

    res.json({ status: 'success', message: 'Rol Permiso actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarRolPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Rol_Permiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    await Rol_Permiso.destroy({ where: { id } });

    res.json({ status: 'success', message: 'Rol Permiso eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
