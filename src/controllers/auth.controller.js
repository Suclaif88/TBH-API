const { Usuarios,
} = require('../models');
const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const { Documento, Correo } = req.body;

  if (!Documento) {
    return res.status(400).json({ 
      status: 'error',
      message: "Faltan campos obligatorios" 
    });
  }

  const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!correoRegex.test(Correo)) {
    return res.status(400).json({
      status: 'error',
      message: "Correo electrónico inválido"
    });
  }

  try {
    const response = await authService.register(req.body); 

    if (response.status && response.data) {
      return res.status(response.status).json({
        status: 'success',
        data: response.data
      });
    } else {
      return res.status(500).json({
        status: 'error',
        message: "Error interno"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: "Error interno",
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { Documento, Correo, Password } = req.body;

  if (!Documento && !Correo) {
    return res.status(400).json({
      status: 'error',
      message: 'Documento o correo son requeridos'
    });
  }

  if (!Password) {
    return res.status(400).json({
      status: 'error',
      message: 'La contraseña es requerida'
    });
  }

  try {
    const response = await authService.login({ Documento, Correo, Password });

    if (response.status === 200 && response.data?.token) {
      // Configuración de cookies para producción
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.cookie("token", response.data.token, {
        httpOnly: true,
        secure: isProduction, // true en producción, false en desarrollo
        sameSite: 'Lax', // Cambiar a Lax para mejor compatibilidad
        maxAge: 60 * 60 * 1000, // 1 hora
        domain: isProduction ? undefined : undefined // Dejar que el navegador maneje el dominio
      });

      return res.status(200).json({
        status: 'success',
        message: 'Login exitoso',
        usuario: response.data.usuario,
        token: response.data.token // Devolver token en respuesta como respaldo
      });
    } else {
      return res.status(response.status || 500).json({
        status: 'error',
        message: 'No se pudo iniciar sesión correctamente'
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Error de autenticación',
      error: error.message
    });
  }
};

exports.activate = async (req, res) => {
  const { token } = req.params;
  try {
    const response = await authService.activate(token);

    return res.status(response.status).json({
      status: "success",
      message: response.message,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const response = await authService.forgotPassword(req.body);
    return res.status(200).json({ status: "success", message: response.message });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error en forgotPassword",
      error: error.message
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaPassword } = req.body;

    const response = await authService.resetPassword(token, nuevaPassword);
    return res.status(200).json({ status: "success", message: response.message });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error en resetPassword",
      error: error.message
    });
  }
};