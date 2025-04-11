const { Roles } = require('../models');

exports.crearRoles = async (req, res) => {
  try {
    const nuevoRoles = await Roles.create(req.body);
    res.json({ status: 'success', data: nuevoRoles });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll();
    res.json({ status: 'success', data: roles });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
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

    res.json({ status: 'success', data: usuario });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.actualizarRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Roles.findOne({ where: { id: id } });
    if (!rol) {
      return res.status(404).json({ status: 'error', message: 'rol no encontrado' });
    }
    await Roles.update(req.body, { where: { id: id } });
    res.json({ status: 'success', message: 'Rol actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Roles.findOne({ where: { id: id } });
    if (!rol) {
      return res.status(404).json({ status: 'error', message: 'Rol no encontrado' });
    }
    await Roles.destroy({ where: { id: id } });
    res.json({ status: 'success', message: 'Rol eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

