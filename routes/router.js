// Definimos las rutas para las vistas y para llamar al controlador.
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const producController = require('../controllers/producController');

// Rutas para las vistas
router.get('/', (req, res) => {
    res.render('index', { alert: false });
});

router.get('/index', authController.isAuthenticated, (req, res) => {
    res.render('index', { alert: false });
});

router.get('/register', (req, res) => {
    res.render('register', { alert: false });
});

router.get('/login', authController.isAuthenticated, (req, res) => {
    res.render('login', { user: req.user });
});

// Ruta para renderizar la vista loginAdmin
router.get('/loginAdmin', authController.isAuthenticated, producController.listP, (req, res) => {
    res.render('loginAdmin', { user: req.user, items: req.items });
});

// Rutas para los métodos del controlador
router.post('/register', authController.register);
router.post('/index', authController.login);
router.get('/logout', authController.logout);
router.post('/save', producController.product);
router.post('/edit', producController.edit);
router.post('/delete', producController.delete);


module.exports = router;

