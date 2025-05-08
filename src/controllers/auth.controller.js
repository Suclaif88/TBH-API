const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const { documento, correo, password } = req.body;

  if (!documento ) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  const correoRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!correoRegex.test(correo)) {
    return res.status(400).json({ message: "Correo electrónico inválido" });
  }

  try {
    const response = await authService.register({ documento, correo, password });
    if (response.status && response.data) {
      return res.status(response.status).json(response.data);
    } else {
      return res.status(500).json({ message: "Error interno" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
};

  exports.login = async (req, res) => {
    const { documento, correo, password } = req.body;
  
    if (!documento && !correo) {
      return res.status(400).json({ message: 'Documento o email son requeridos' });
    }
  
    if (!password) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }
  
    try {
      const response = await authService.login({ documento, correo, password });
  
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(401).json({ message: 'Error de autenticación', error: error.message });
    }
  };
