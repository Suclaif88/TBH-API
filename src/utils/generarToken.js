const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  const token = jwt.sign(
    { id: usuario.id, documento: usuario.documento, rol_id: usuario.rol_id, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

module.exports = generarToken;
