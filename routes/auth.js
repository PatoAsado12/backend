const express = require ('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

//Registro usuario
router.post('/registro', async(req,res)=>{
    const{nombre_usuario,correo,contraseña} = req.body;

    //Validacion basica
    if(!nombre_usuario || !correo || !contraseña){
        return res.status(400).send('Faltan datos obligatorios')
    }

    try{
        //Aqui se encripta la contraseña
        const hash = await bcrypt.hash(contraseña,10);
        const fecha =new Date();

        //Insertar en la base de datos
        const query=`INSERT INTO usuarios (nombre_usuario,correo,contraseña,fecha_registro) VALUES (?,?,?,?)`;

        //Consumir el query
        db.query(query,[nombre_usuario,correo,hash,fecha], (err,result) =>{
            if(err){
                console.log('Error al registrar',err);
                return res.status(400).send('Error al registrar');
        }
        res.status(200).send('Usuario registrado');
        })
        }catch(err){
                console.log('Error al registrar');
                res.status(500).send('Error interno');

    }
 
});

module.exports = router;