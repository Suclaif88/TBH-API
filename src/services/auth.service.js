const bcrypt = require('bcryptjs');
const generarToken = require('../utils/generarToken');
const { Usuarios, Roles } = require('../models');

exports.register = async (data) => {
  const { documento, correo ,password} = data;
  const rol_id = 2; // Asignar rol_id por defecto a 2 (Usuario)

  try {
    if (!documento) {
      throw new Error('El campo documento es obligatorio');
    }

    if (!correo) {
      throw new Error('El campo correo es obligatorio');
    }

    const usuarioExistente = await Usuarios.findOne({ where: { documento } });
    if (usuarioExistente) {
      throw new Error('El documento ya está registrado');
    }

    const usuarioExistenteCorreo = await Usuarios.findOne({ where: { correo } });
    if (usuarioExistenteCorreo) {
      throw new Error('El correo ya está registrado');
    }

    const rolExistente = await Roles.findByPk(rol_id);
    if (!rolExistente) {
      throw new Error('Rol no encontrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuarios.create({
      documento,
      correo,
      password: hashedPassword,
      rol_id,
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
    const { documento, correo, password } = data;
  
    try {
      let usuario;

      if (documento) {
        usuario = await Usuarios.findOne({ where: { documento } });
      } else if (correo) {
        usuario = await Usuarios.findOne({ where: { correo } });
      }
  
      if (!usuario) {
        throw new Error('Credenciales incorrectas');
      }
  
      const esContraseñaValida = await bcrypt.compare(password, usuario.password);
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
