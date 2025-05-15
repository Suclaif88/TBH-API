const bcrypt = require('bcryptjs');
const generarToken = require('../utils/generarToken');
const { Usuarios, Roles } = require('../models');

exports.register = async (data) => {
  const { Documento, Correo, Password, Estado, Rol_Id } = data;

  const rolId = Rol_Id || 2; // Por defecto, rol usuario
  const estado = Estado !== undefined ? Estado : 0; // Por defecto, inactivo (0)


  try {
    if (!Documento) {
      throw new Error('El campo documento es obligatorio');
    }
    if (!Correo) {
      throw new Error('El campo correo es obligatorio');
    }

    const usuarioExistenteDocumento = await Usuarios.findOne({ where: { Documento } });
    if (usuarioExistenteDocumento) {
      throw new Error('El documento ya está registrado');
    }

    const usuarioExistenteCorreo = await Usuarios.findOne({ where: { Correo } });

    if (usuarioExistenteCorreo) {
      throw new Error('El correo ya está registrado');
    }

    const rolExistente = await Roles.findByPk(Rol_Id);
    if (!rolExistente) {
      throw new Error('Rol no encontrado');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const nuevoUsuario = await Usuarios.create({
      Documento,
      Password: hashedPassword,
      Correo,
      Estado,
      Rol_Id,
    });

    const token = generarToken(nuevoUsuario);

    return {
      status: 201,
      data: {
        usuario: nuevoUsuario,
        token,
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

  
  exports.login = async (data) => {
    const { Documento, Correo, Password } = data;

  
    try {
      let usuario;

      if (Documento) {
        usuario = await Usuarios.findOne({ where: { Documento } });
      } else if (Correo) {
        usuario = await Usuarios.findOne({ where: { Correo } });

      }
  
      if (!usuario) {
        throw new Error('Credenciales incorrectas');
      }
  
      const esContraseñaValida = await bcrypt.compare(Password, usuario.Password);
      if (!esContraseñaValida) {
        throw new Error('Credenciales incorrectas');
      }
  
      const token = generarToken(usuario);
  
      return {
        status: 200,
        data: {
          usuario,
          token,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
