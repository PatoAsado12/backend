const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Ruta: POST /api/suscribirse
router.post('/suscribirse', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ mensaje: 'El correo es obligatorio.' });
    }

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });

    const mailOptions = {
        from: `"Romis" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Gracias por suscribirte a Romis',
        html: `
            <h2>¡Bienvenido a Romis!</h2>
            <p>Gracias por suscribirte. Pronto recibirás nuestras novedades y ofertas especiales.</p>
            <p>— El equipo de Romis 🎉</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ mensaje: 'Correo de suscripción enviado con éxito.' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ mensaje: 'No se pudo enviar el correo.', error: error.message });
    }
});

module.exports = router;
