const express = require ('express');
const router = express.Router();
const db = require('../config/db');
const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const {sendResetPassword} = require('../config/email');
require('dotenv').config();


router.post('/olvide-contrasena',async(req, res) => {
    const { correo } = req.body;
    if(!correo){
        return res.status(400).send("El correo es requerido");
    }
    try{
        //Verificar si el correo existe en la base de datos
        db.query('SELECT * FROM usuarios WHERE correo = ?' , [correo],
            async(err,results)=>{
                if(err){
                    console.log('Error en la consoluta');
                    return res.status(500).send('Error interno')
                }

                if(results.lenght == 0){
                    return res.status(500).send("Si el correo existe recibiras una url")
                }

                const usuario = results[0];

                //Generando token del usuario
                const resetToken = crypto.randomBytes(20).toString('hex');
                const resetTokenExpiry = Date.now() + 360000; //1H VALIDEZ

                //Guardar en la db
                db.query(
                    'UPDATE usuarios SET reset_token= ?, reset_token_expiry = ? WHERE id =?',
                    [resetToken, resetTokenExpiry, usuario.id],
                    async (updateErr)=>{
                        if(updateErr){
                        console.error('Error al realizar la actualizacion');
                        return res.status(500).send('Error interno');
                    }

                    const frontendUrl = process.env.FRONTEND || 'http://localhost:5500/';
                    const resetUrl = `${frontendUrl}/cambiar_contrasena.html?token=${resetToken}`;

                    try{    
                        //Usar la funcion de envio de correo
                        await sendResetPassword(correo, resetUrl),
                        res.status(200).send('Si el correo existe recibiras un link');


                    }catch(mailError){
                        console.error('Error al enviar el correo ', mailError);
                        return res.status(500).send('Error al enviar el correo de restablecimiento');

                    }
                    }
                )


            }
        )

    }catch(error){
        console.error('Error en olvide contraseña')
        res.status(500).send('Error interno')
    }
})


// Verificar token y restablecer contraseña
router.post('/cambiar_contrasena', async (req, res) => {
  const { token, nueva_contraseña } = req.body;
  
  if (!token || !nueva_contraseña) {
    return res.status(400).send('Faltan datos obligatorios');
  }
  
  // Validar longitud mínima de contraseña
  if (nueva_contraseña.length < 6) {
    return res.status(400).send('La contraseña debe tener al menos 6 caracteres');
  }
  
  try {
    // Buscar usuario con ese token y que no haya expirado
    db.query(
      'SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiry > ?',
      [token, Date.now()],
      async (err, results) => {
        if (err) {
          console.error('Error en la consulta:', err);
          return res.status(500).send('Error interno');
        }
        
        if (results.length === 0) {
          return res.status(400).send('Token inválido o expirado');
        }
        
        const usuario = results[0];
        
        // Encriptar nueva contraseña
        const hash = await bcrypt.hash(nueva_contraseña, 10);
        
        // Actualizar contraseña y eliminar token
        db.query(
          'UPDATE usuarios SET contraseña = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
          [hash, usuario.id],
          (updateErr) => {
            if (updateErr) {
              console.error('Error al actualizar contraseña:', updateErr);
              return res.status(500).send('Error interno');
            }
            
            res.status(200).send('Contraseña actualizada correctamente');
          }
        );
      }
    );
  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).send('Error interno');
  }
});


module.exports = router;

