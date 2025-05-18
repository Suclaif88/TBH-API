const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  console.log('Usuario recibido en generarToken:', usuario);
  const data = usuario?.get ? usuario.get() : usuario;
  console.log('Datos usados para firmar el token:', data);

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

  console.log('Token generado:', token);
  return token;
};

module.exports = generarToken;
