require('dotenv').config();
const nodemailer = require('nodemailer');

const generarNumeroPedido = () => {
  return `PED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

exports.enviarCorreo = async (req, res) => {
  const { destinatario, pedido } = req.body;
  const numeroPedido = generarNumeroPedido();

  const productosHtml = pedido.items.map(item => `
    <tr>
      <td>${item.nombre}</td>
      <td>${item.talla}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precio}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif;">
      <h2>¡Gracias por tu pedido en THE BARBER HOUSE! 🛒</h2>
      <p><strong>Número de Pedido:</strong> ${numeroPedido}</p>
      <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      <p><strong>Estado:</strong> ${pedido.estado}</p>
      <h3>Detalle del pedido:</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Talla</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          ${productosHtml}
        </tbody>
      </table>
      <p><strong>Total: $${pedido.total.toFixed(2)}</strong></p>
      <p>Nos pondremos en contacto contigo cuando el pedido esté listo para ser recogido.</p>
      <p style="color: #888;">THE BARBER HOUSE © 2025</p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: `"TBH" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: 'Confirmación de pedido',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado con éxito', info });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ success: false, error: 'Error al enviar el correo' });
  }
};
