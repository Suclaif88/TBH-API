const { Usuarios,Clientes,Empleados,Roles } = require('../models');
const bcrypt = require('bcryptjs');

exports.crearUsuario = async (req, res) => {
  const t = await Usuarios.sequelize.transaction();

  try {
    const datosUsuario = { ...req.body };

    if (datosUsuario.Password && datosUsuario.Password.trim() !== "") {
      datosUsuario.Password = await bcrypt.hash(datosUsuario.Password, 10);
    }

    const nuevoUsuario = await Usuarios.create(datosUsuario, { transaction: t });

    const rol = await Roles.findOne({ where: { Id: datosUsuario.Rol_Id } });
    if (!rol) {
      throw new Error("Rol no válido");
    }

    const datosAdicionales = {
      Documento: datosUsuario.Documento,
      Tipo_Documento: datosUsuario.Tipo_Documento,
      Nombre: datosUsuario.Nombre,
      Celular: datosUsuario.Celular,
      F_Nacimiento: datosUsuario.F_Nacimiento,
      Direccion: datosUsuario.Direccion,
      Sexo: datosUsuario.Sexo,
      Correo: datosUsuario.Correo,
    };

    if (rol.Nombre === "Cliente") {
      await Clientes.create(datosAdicionales, { transaction: t });
    } else if (rol.Nombre === "Empleado") {
      await Empleados.create(datosAdicionales, { transaction: t });
    }

    await t.commit();
    res.json({ status: 'success', data: nuevoUsuario });

  } catch (err) {
    await t.rollback();
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

exports.listarUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuarios.findOne({
      where: { Id_Usuario: id }
    });

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', data: usuario });
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
    const usuario = await Usuarios.findOne({ where: { Id_Usuario: id } });

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const datosActualizados = { ...req.body };

    if (datosActualizados.Password && datosActualizados.Password.trim() !== "") {
      datosActualizados.Password = await bcrypt.hash(datosActualizados.Password, 10);
    } else {
      delete datosActualizados.Password;
    }

    await Usuarios.update(datosActualizados, { where: { Id_Usuario: id } });

    res.json({ status: 'success', message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findOne({ where: { Id_Usuario: id } });
    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    await Usuarios.destroy({ where: { Id_Usuario: id } });
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

