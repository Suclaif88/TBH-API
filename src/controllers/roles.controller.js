const { Roles } = require('../models');


exports.crearRoles = async (req, res) => {
  try {
    const nuevoRol = await Roles.create(req.body);
    return res.status(201).json({ status: 'success', data: nuevoRol });
  } catch (err) {
    const errorMsg = err.name === 'SequelizeUniqueConstraintError'
      ? 'El nombre del rol ya existe'
      : err.message;
    return res.status(400).json({ status: 'error', message: errorMsg });
  }
};


exports.listarRoles = async (_req, res) => {
  try {
    const roles = await Roles.findAll();
    return res.json({ status: 'success', data: roles });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRolesId = async (req, res) => {
  try {
    const { id } = req.params;

    const rol = await Roles.findOne({
      where: { id }
    });

    if (!rol) {
      return res.status(404).json({ status: 'error', message: 'Rol no encontrado' });
    }

    res.json({ status: 'success', data: rol });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.actualizarRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizados] = await Roles.update(req.body, { where: { id } });

    if (!actualizados) {
      return res.status(404).json({ status: 'error', message: 'Rol no encontrado' });
    }

    return res.json({ status: 'success', message: 'Rol actualizado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminados = await Roles.destroy({ where: { id } });

    if (!eliminados) {
      return res.status(404).json({ status: 'error', message: 'Rol no encontrado' });
    }

    return res.json({ status: 'success', message: 'Rol eliminado' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
