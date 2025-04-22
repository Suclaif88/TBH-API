const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const { documento, nombre, celular, email, password, direccion } = req.body;

  if (!documento || !nombre || !celular || !direccion) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  if (celular.length !== 10) {
    return res.status(400).json({ message: "El número de celular debe tener 10 dígitos" });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo electrónico inválido" });
  }

  try {
    const response = await authService.register({ documento, nombre, celular, email, password, direccion });
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
    const { documento, email, password } = req.body;
  
    if (!documento && !email) {
      return res.status(400).json({ message: 'Documento o email son requeridos' });
    }
  
    if (!password) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }
  
    try {
      const response = await authService.login({ documento, email, password });
  
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(401).json({ message: 'Error de autenticación', error: error.message });
    }
  };
