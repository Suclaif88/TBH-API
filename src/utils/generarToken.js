const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

module.exports = generarToken;
