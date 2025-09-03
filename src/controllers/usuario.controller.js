const { Usuarios,
  Clientes,
  Empleados,
  Roles 
} = require('../models');
const bcrypt = require('bcryptjs');

exports.crearUsuario = async (req, res) => {
  const t = await Usuarios.sequelize.transaction();

  try {
    const datosUsuario = { ...req.body };

    if (datosUsuario.Rol_Id) {
        const rol = await Roles.findOne({ where: { Id: datosUsuario.Rol_Id } });
        if (rol && rol.Nombre === "Cliente") {
            const clienteExistente = await Clientes.findOne({ where: { Documento: datosUsuario.Documento }, transaction: t });
            if (clienteExistente) {
                throw new Error("El documento ya está registrado como cliente.");
            }
            const correoExistente = await Clientes.findOne({ where: { Correo: datosUsuario.Correo }, transaction: t });
            if (correoExistente) {
                throw new Error("El correo ya está registrado como cliente.");
            }
        }
    }


    if (datosUsuario.Password && datosUsuario.Password.trim() !== "") {
      datosUsuario.Password = await bcrypt.hash(datosUsuario.Password, 10);
    } else {
      datosUsuario.Password = await bcrypt.hash('password_inicial', 10);
    }

    const nuevoUsuario = await Usuarios.create(datosUsuario, { transaction: t });
    
    const rol = await Roles.findOne({ where: { Id: datosUsuario.Rol_Id } });
    if (!rol) {
      throw new Error("Rol no válido");
    }

    const datosAdicionales = {
      Tipo_Documento: datosUsuario.Tipo_Documento,
      Documento: datosUsuario.Documento,
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
  const t = await Usuarios.sequelize.transaction();

  try {
      const { id } = req.params;
      const usuario = await Usuarios.findOne({ where: { Id_Usuario: id } });

      if (!usuario) {
          await t.rollback();
          return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }

      const datosActualizados = { ...req.body };

      if (datosActualizados.Password && datosActualizados.Password.trim() !== "") {
          datosActualizados.Password = await bcrypt.hash(datosActualizados.Password, 10);
      } else {
          delete datosActualizados.Password;
      }

      await Usuarios.update(datosActualizados, {
          where: { Id_Usuario: id },
          transaction: t
      });

      const rol = await Roles.findOne({ where: { Id: datosActualizados.Rol_Id || usuario.Rol_Id } });
      if (!rol) {
          throw new Error("Rol no válido");
      }

      if (rol.Nombre === "Cliente") {
          const clienteExistente = await Clientes.findOne({ where: { Correo: usuario.Correo } });

          if (clienteExistente) {
              const datosClienteParaActualizar = {
                  ...clienteExistente.dataValues,
                  ...datosActualizados
              };
              
              delete datosClienteParaActualizar.Id_Cliente;
              delete datosClienteParaActualizar.Saldo_A_Favor;
              
              await clienteExistente.update(datosClienteParaActualizar, { transaction: t });
          } else {
              const datosClienteParaCrear = {
                  Tipo_Documento: datosActualizados.Tipo_Documento,
                  Documento: datosActualizados.Documento,
                  Nombre: datosActualizados.Nombre,
                  Correo: datosActualizados.Correo,
                  Celular: datosActualizados.Celular,
                  F_Nacimiento: datosActualizados.F_Nacimiento,
                  Direccion: datosActualizados.Direccion,
                  Sexo: datosActualizados.Sexo,
                  Estado: datosActualizados.Estado
              };
              await Clientes.create(datosClienteParaCrear, { transaction: t });
          }
      } else if (rol.Nombre === "Empleado") {
          const empleadoExistente = await Empleados.findOne({ where: { Correo: usuario.Correo } });

          if (empleadoExistente) {
              const datosEmpleadoParaActualizar = {
                  ...empleadoExistente.dataValues,
                  ...datosActualizados
              };
              
              delete datosEmpleadoParaActualizar.Id_Empleado;
              
              await empleadoExistente.update(datosEmpleadoParaActualizar, { transaction: t });
          } else {
              await Empleados.create(datosActualizados, { transaction: t });
          }
      }

      await t.commit();
      res.json({ status: 'success', message: 'Usuario actualizado correctamente' });

  } catch (err) {
      await t.rollback();
      res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const t = await Usuarios.sequelize.transaction();
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findOne({ where: { Id_Usuario: id } });
    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    
    const rol = await Roles.findOne({ where: { Id: usuario.Rol_Id } });
    if (rol && rol.Nombre === "Cliente") {
        await Clientes.destroy({ where: { Documento: usuario.Documento }, transaction: t });
    } else if (rol && rol.Nombre === "Empleado") {
        await Empleados.destroy({ where: { Documento: usuario.Documento }, transaction: t });
    }

    await Usuarios.destroy({ where: { Id_Usuario: id }, transaction: t });

    await t.commit();
    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.buscarUsuarioPorEmail = async (req, res) => {
  try {
    const { email } = req.params; 

    const usuario = await Usuarios.findOne({ where: { Correo: email } });

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    res.json({ status: 'success', data: usuario });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.cambiarEstadoUsuario = async (req, res) => {
  const t = await Usuarios.sequelize.transaction();
  try {
    const id = req.params.id;

    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ status: 'error', message: 'usuario no encontrado' });
    }

    usuario.Estado = !usuario.Estado;
    await usuario.save({ transaction: t });
    
    const rol = await Roles.findByPk(usuario.Rol_Id);
    if (rol && rol.Nombre === 'Cliente') {
        await Clientes.update({ Estado: usuario.Estado }, { where: { Correo: usuario.Correo }, transaction: t });
    } else if (rol && rol.Nombre === 'Empleado') {
        await Empleados.update({ Estado: usuario.Estado }, { where: { Correo: usuario.Correo }, transaction: t });
    }

    await t.commit();

    res.json({
      status: 'success',
      mensaje: `usuario ${usuario.Estado ? 'activado' : 'desactivado'} correctamente`,
      usuario
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ status: 'error', message: error.message });
  }
};