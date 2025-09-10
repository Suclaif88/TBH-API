const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const generarToken = require('../utils/generarToken');
const { Usuarios, Roles } = require('../models');
const { sendMail } = require('../utils/mailer');
const nodemailer = require("nodemailer");


exports.register = async (data) => {
  const { Documento, Correo, Password, Estado, Rol_Id } = data;

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

    const hashedPassword = await bcrypt.hash(Password, 10);

    const nuevoUsuario = await Usuarios.create({
      Documento,
      Password: hashedPassword,
      Correo,
      Estado,
      Rol_Id,
    });


  const token = jwt.sign(
        { id: nuevoUsuario.Id_Usuario },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

       const link = `http://localhost:5173/activate/${token}`;  //Cambiar el link a produccion

    // Enviar correo
    await sendMail(
      nuevoUsuario.Correo,
        "✨ Activa tu cuenta - The Barber House",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
          
          <h2 style="color: #333; text-align: center;">Bienvenido a <span style="color:#1a73e8;">The Barber House 💈</span></h2>
          
          <p style="font-size: 16px; color: #555;">
            Hola <strong>${nuevoUsuario.Documento}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #555;">
            Gracias por registrarte. Para completar tu registro debes 
            <b>activar tu cuenta</b> haciendo clic en el botón de abajo:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" 
              style="display: inline-block; padding: 12px 20px; background: #34a853; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              ✅ Activar mi cuenta
            </a>
          </div>

          <p style="font-size: 14px; color: #777;">
            ⚠️ Este enlace caduca en <b>1 hora</b>.  
            Si no creaste esta cuenta, ignora este correo.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            © 2025 The Barber House - Todos los derechos reservados.
          </p>
        </div>
        `
    );

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

      if (!usuario.Estado) {
      throw new Error('La cuenta no está activa. Por favor, Activa por el mensaje que previamente se te envio al correo.');
      }
  
      const esContraseñaValida = await bcrypt.compare(Password, usuario.Password);
      if (!esContraseñaValida) {
        throw new Error('Credenciales incorrectas');
      }
  
      const token = generarToken(usuario);
  
      const usuarioLimpio = { ...usuario.get() };
      delete usuarioLimpio.Password;

      return {
        status: 200,
        data: {
          usuario: usuarioLimpio,
          token,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  exports.activate = async (token) => {
  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // buscar usuario
    const usuario = await Usuarios.findOne({ where: { Id_Usuario: decoded.id } });
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

   
    usuario.Estado = true;
    await usuario.save();

    return {
      status: 200,
      message: "Cuenta activada correctamente",
    };
  } catch (error) {
    throw new Error(error.message || "Token inválido o expirado");
  }
};


exports.forgotPassword = async ({ Correo }) => {
  const usuario = await Usuarios.findOne({ where: { Correo } });

  if (!usuario) throw new Error("Usuario no encontrado");

  // Token solo para reset
  const resetToken = jwt.sign(
    { id: usuario.Id_Usuario },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  await sendMail(
    usuario.Correo,
    "🔐 Recupera tu contraseña - The Barber House",
  `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
    
    <h2 style="color: #333; text-align: center;">The Barber House 💈</h2>
    
    <p style="font-size: 16px; color: #555;">
      Hola <strong>${usuario.Documento}</strong>,
    </p>
    
    <p style="font-size: 16px; color: #555;">
      Recibimos una solicitud para <b>restablecer tu contraseña</b>.  
      Haz clic en el botón de abajo para continuar:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="display: inline-block; padding: 12px 20px; background: #000000ff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        🔑 Restablecer Contraseña
      </a>
    </div>

    <p style="font-size: 14px; color: #777;">
      ⚠️ Este enlace caduca en <b>15 minutos</b>.  
      Si no solicitaste este cambio, ignora este mensaje.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #999; text-align: center;">
      © 2025 The Barber House - Todos los derechos reservados.
    </p>
  </div>
  `
  );

  return { message: "Correo enviado con instrucciones" };
};

exports.resetPassword = async (token, nuevaPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    await Usuarios.update(
      { Password: hashedPassword },
      { where: { Id_Usuario: decoded.id } }
    );

    return { message: "Contraseña actualizada correctamente" };
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};