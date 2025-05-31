const express = require ('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

//Login de usuario 
router.post('/login', (req, res) => {
  const { nombre_usuario, contraseña} = req.body;

  //Validacion basica 
  if (!nombre_usuario || !contraseña) {
    return res.status(400).send("Todos los campos son requeridos")
  }

  //Buscar el usuario en la base de datos 
  db.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario],
    async (err, results) => {
      if (err) {
        console.log("Error en la consulta", err);
        return res.status(400).send("Error interno");
      }

      //Si el usuario existe

      if (results.length == 0){
        return res.status(500).send("El usuario no existe");
      }
      const usuario = results[0];

      //Comparar si la contraseña son iguales 

      const match = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!match) {
        return res.status(401).send("Contraseña incorrecta");
    }
    return res.status(200).json({
        mensaje : "Login susefyly",
        usuario: {
            id: usuario.id,
            nombre_usuario: usuario.nombre_usuario,
            correo: usuario.correo 
        },
    });



    })
    router.post('/login/google', async (req, res) => {

 const { nombre_usuario, correo, firebase_uid, email_verified } = req.body;



 if (!correo || !firebase_uid) {

  return res.status(400).send('Faltan datos obligatorios');

 }



 db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {

  if (err) {

   console.error('Error en consulta:', err);

   return res.status(500).send('Error en el servidor');

  }



  if (results.length === 0) {

   // Usuario no existe, lo registramos

   const insertQuery = `

    INSERT INTO usuarios (nombre_usuario, correo, fecha_registro, auth_provider, firebase_uid, email_verified)

    VALUES (?, ?, NOW(), 'google', ?, ?)

   `;

   db.query(insertQuery, [nombre_usuario, correo, firebase_uid, email_verified ? 1 : 0], (err, result) => {

    if (err) {

     console.error('Error al insertar usuario Google:', err);

     return res.status(500).send('Error al registrar usuario');

    }



    return res.status(201).json({

     mensaje: 'Usuario registrado con Google',

     usuario: {

      id: result.insertId,

      nombre_usuario,

      correo,

      auth_provider: 'google'

     }

    });

   });

  } else {

   // Usuario ya existe
                                                                                                                              0
   return res.status(200).json({

    mensaje: 'Login con Google exitoso',

    usuario: results[0]

   });

  }

 });

});



});


module.exports = router;

