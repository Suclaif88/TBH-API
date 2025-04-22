const bcrypt = require('bcryptjs');
const generarToken = require('../utils/generarToken');
const { Usuarios } = require('../models');
const { Roles } = require('../models');

exports.register = async (data) => {
  const { documento, nombre, celular, email, password, direccion } = data;
  const rol_id = 2; // Asignar rol_id por defecto a 2 (Usuario)

  try {
    if (!documento) {
      throw new Error('El campo documento es obligatorio');
    }

    const usuarioExistente = await Usuarios.findOne({ where: { documento } });
    if (usuarioExistente) {
      throw new Error('El documento ya está registrado');
    }

    const rolExistente = await Roles.findByPk(rol_id);
    if (!rolExistente) {
      throw new Error('Rol no encontrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuarios.create({
      documento,
      nombre,
      celular,
      email,
      password: hashedPassword,
      direccion,
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
    const { documento, email, password } = data;
  
    try {
      let usuario;

      if (documento) {
        usuario = await Usuarios.findOne({ where: { documento } });
      } else if (email) {
        usuario = await Usuarios.findOne({ where: { email } });
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
