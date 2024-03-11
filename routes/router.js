// Definimos las rutas para las visatas y para llamar al controlador.

const express = require('express');
const router = express.Router(); // asignamos el metodo de express.Router a una constante.
//const conexion = require('../database/db'); // SEGUNDO VIDEO Requerimos a nuestro archivo db.js (los requerimientos de deben hacer en la parte superior) 
const authController = require('../controllers/authController'); // Incluimos nuestro archivo controlador para establecer las rutas del metodo controller.

// Rutas para las vistas (ventanas de la pagina)
router.get('/', (req, res) => {
    res.render('index', { alert: false })
}); // Ruta para el inicio

router.get('/index', authController.isAuthenticated, (req, res) => {
    res.render('index', { alert: false })
}); // Ruta para el inicio

router.get('/register', (req, res) => {
    res.render('register', { alert: false })
}); // Ruta el registro

router.get('/login', authController.isAuthenticated, (req, res) => {
    res.render('login', { user: req.user })
}); // Ruta cuando un usuario inicia session

// Rutas para el metodo del controller (TERCER VIDEO) (Utilizamos .post porque en nuestro form de la vista register tenemos el method="POST")
router.post('/register', authController.register);
// (CUARTO VIDEO)
router.post('/index', authController.login);
router.get('/logout', authController.logout);

module.exports = router // exportar Para que se pueda incluir el archivo router en otros archivos. 





