const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  const data = usuario?.get ? usuario.get() : usuario;

  const token = jwt.sign(
    {
      id: data.Id_Usuario,
      documento: data.Documento,
      rol_id: data.Rol_Id,
      correo: data.Correo
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

module.exports = generarToken;
