const { RolPermiso } = require('../models');

exports.crearRolPermiso = async (req, res) => {
  try {
    const { rol_id, Permisos } = req.body;

    if (!Array.isArray(Permisos)) {
      return res.status(400).json({ status: 'error', message: 'El campo Permisos debe ser un array' });
    }

    if (Permisos.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Debe asignar al menos un permiso' });
    }

    const asignaciones = await Promise.all(
      Permisos.map(async (permiso_id) => {
        const [asignacion, creado] = await RolPermiso.findOrCreate({
          where: { rol_id, permiso_id },
        });
        return asignacion;
      })
    );

    res.json({ status: 'success', data: asignaciones });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRolPermisos = async (req, res) => {
  try {
    const lista = await RolPermiso.findAll({
    });
    res.json({ status: 'success', data: lista });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRolPermisoId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await RolPermiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    res.json({ status: 'success', data: item });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarRolPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await RolPermiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    const { rol_id, permiso_id } = req.body;

    await RolPermiso.update({ rol_id, permiso_id }, { where: { id } });

    res.json({ status: 'success', message: 'Rol Permiso actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarRolPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await RolPermiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    await RolPermiso.destroy({ where: { id } });

    res.json({ status: 'success', message: 'Rol Permiso eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
