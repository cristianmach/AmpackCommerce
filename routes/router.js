// Definimos las rutas para las visatas y para llamar al controlador.

const express = require('express');
const router = express.Router(); // asignamos el metodo de express.Router a una constante.
//const conexion = require('../database/db'); // SEGUNDO VIDEO Requerimos a nuestro archivo db.js (los requerimientos de deben hacer en la parte superior) 

router.get('/', (req, res) => {
    res.render('index')
}); // Ruta para el inicio

router.get('/register', (req, res) => {
    res.render('register')
}); // Ruta el registro

module.exports = router // exportar Para que se pueda incluir el archivo router en otros archivos. 

// -----------------------------------------HASTA AQUI PRIMER VIDEO

