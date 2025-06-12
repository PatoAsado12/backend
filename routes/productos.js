const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los productos
router.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ mensaje: 'Error del servidor' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto
router.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;

    if (!nombre || !precio || !stock) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const nuevoProducto = {
        nombre,
        descripcion,
        precio,
        stock,
        categoria_id
    };

    db.query('INSERT INTO productos SET ?', nuevoProducto, (err, result) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            return res.status(500).json({ mensaje: 'Error al crear el producto' });
        }

        res.status(201).json({ mensaje: 'Producto creado correctamente', id: result.insertId });
    });
});

// Actualizar producto
router.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id } = req.body;

    const productoActualizado = { nombre, descripcion, precio, stock, categoria_id };

    db.query('UPDATE productos SET ? WHERE id = ?', [productoActualizado, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ mensaje: 'Error al actualizar el producto' });
        }

        res.json({ mensaje: 'Producto actualizado correctamente' });
    });
});

// Eliminar producto
router.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ mensaje: 'Error al eliminar el producto' });
        }

        res.json({ mensaje: 'Producto eliminado correctamente' });
    });
});

module.exports = router;