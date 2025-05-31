const nodemailer = require("nodemailer");
require('dotenv').config();

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//Funcion para enviar el correo de restablecimiento de contraseña
const sendResetPassword = (async (to,resetUrl) => {
  try {
    const mailOptions ={
      from: process.SMTP_USER,
      to: to,
      subject: 'Restablecimiento de contraseña',
      html: `<b>Solicistaste el restablecimiento de tu contraseña?</b>
      <p>Haz click en el siguiente enlace para restablecer tu contraseña</p>
      <a href="${resetUrl}" target="_blank">Restablecer contraseña</a>
      <p>Este enlace expira en 1h</p>
      <p>Si no fuiste tu ignoralo</p>
      
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente", info.messageID);
    return true;


  } catch (err) {
    console.error("Error al enviar correo", err);
  }
});

module.exports = {
    transporter,
    sendResetPassword
}