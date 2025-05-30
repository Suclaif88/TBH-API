const { Usuarios } = require('../models');

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuarios.create(req.body);
    res.json({ status: 'success', data: nuevoUsuario });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarUsuario = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    res.json({ status: 'success', data: usuarios });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarUsuarioPorDocumento = async (req, res) => {
  try {
    const { documento } = req.params;

    const usuario = await Usuarios.findOne({
      where: { documento }
    });

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', data: usuario });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findOne({ where: { documento: id } });
    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    await Usuarios.update(req.body, { where: { documento: id } });
    res.json({ status: 'success', message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findOne({ where: { documento: id } });
    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    await Usuarios.destroy({ where: { documento: id } });
    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.buscarUsuarioPorEmail = async (req, res) => {
  try {
    const { email } = req.params;  

    const usuario = await Usuarios.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', data: usuario });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.cambiarEstadoUsuario = async (req, res) => {
  try {
    const id = req.params.id;

    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'usuario no encontrado' });
    }

    usuario.Estado = !usuario.Estado;
    await usuario.save();

    res.json({
      status: 'success',
      mensaje: `usuario ${usuario.Estado ? 'activado' : 'desactivado'} correctamente`,
      usuario
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

