const { Roles , Usuarios} = require('../models');

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
      where: { Id:id }
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

exports.cambiarEstadoRoles = async (req, res) => {
  try {
    const id = req.params.id;

    const rol = await Roles.findByPk(id);
    if (!rol) {
      return res.status(404).json({ status: 'error', message: 'Rol no encontrado' });
    }

    const usuariosConRol = await Usuarios.findOne({ where: { Rol_Id: id } });

    if (usuariosConRol && rol.Estado === true) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede desactivar el rol porque está asignado a uno o más usuarios.'
      });
    }

    rol.Estado = !rol.Estado;
    await rol.save();

    res.json({
      status: 'success',
      mensaje: `Rol ${rol.Estado ? 'activado' : 'desactivado'} correctamente`,
      rol
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};