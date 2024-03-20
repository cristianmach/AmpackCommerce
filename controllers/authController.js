// TERCER VIDEO
const jwt = require('jsonwebtoken'); // Para hacer la autenticacion
const bcryptjs = require('bcryptjs'); // Modulo para Encriptar la clave
const conexion = require('../database/db') // esto el clave para poder hacer las queries de la base de datos
const { promisify } = require('util'); // promisify ya esta incluido en node por eso esta entre llaves, es para indicar que vamos a utilizar promesas, es una comunicacion asincrona (algo que se va a retornar)
const { Console } = require('console');

// Metodo para Registrarnos (el .register es el nombre que nosotros le damos al metodo) (cada vez que utilizamos async, tambien utilizamos await)
exports.register = async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM Productos', (error, results) => {
                if (error) {
                    console.error('Error al obtener datos: ', error);
                    reject('Error interno del servidor.');
                } else {
                    resolve(results);
                }
            });
        });

        req.items = results;

        const name = req.body.name;
        const lName = req.body.lName;
        const phone = req.body.phone;
        const email = req.body.email;
        const pass = req.body.pass;
        const address = req.body.address;
        const city = req.body.city;

        //Encriptamos la contraseña
        let passHash = await bcryptjs.hash(pass, 8)

        // Consulta para verificar si el correo ya existe
        const emailExists = await new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM Usuario WHERE Correo = ?', [email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0);
                }
            });
        });

        if (emailExists) {
            // El correo ya existe
            res.render('register', {
                alert: true,
                alertTitle: "Tenemos un inconveniente",
                alertMessage: "El correo ya fue registrado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            })
        } else {
            // creamos el insert para guardar los datos del form en la base de datos
            conexion.query('INSERT INTO Usuario SET ?', { Nombres: name, Apellidos: lName, Telefono: phone, Correo: email, Contraseña: passHash, Direccion: address, Ciudad: city }, (err, results) => {
                res.render('index', {
                    alert: true,
                    items: req.items,
                    alertTitle: "Registro exitoso",
                    alertMessage: `Bienvenido ${name}, por favor inicia sesion`,
                    alertIcon: 'success',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                })
                if (err) { console.log(err) }
            });
        }

    } catch (err) {
        console.error(err);
    }
}

//Creamos el metodo para hacer el login (CUARTO VIDEO)
exports.login = async (req, res) => {
    try {

        const results = await new Promise((resolve, reject) => {
            conexion.query('SELECT * FROM Productos', (error, results) => {
                if (error) {
                    console.error('Error al obtener datos: ', error);
                    reject('Error interno del servidor.');
                } else {
                    resolve(results);
                }
            });
        });

        req.items = results;

        const user = req.body.email;
        const pass = req.body.pass;
        //console.log(user, pass); //Por buenas practicas revisamos que este bien el metodo.

        // Este es if es para validar que el usuario si llene los dos inputs
        if (!user || !pass) {
            //console.log('No se han llenado los campos');
            // utilizamos sweet alert para generar la alerta
            res.render('index', {
                alert: true, // Aqui se pueden definir varias variables y renderizar la vista, pero tiene que tener almenos las mismas varibles que enrouter, por ejemplo alert: true y items: req.item
                items: req.items,
                alertTitle: "Advertencia",
                alertMessage: "Los campos de Usuario y Contraseña son obligatorios",
                alertIcon: 'warning',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            })
        } else {
            // Este else es para verificar que los datos sean correctos
            conexion.query('SELECT * FROM Usuario WHERE Correo = ?', [user], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].Contraseña))) {

                    res.render('index', {
                        alert: true,
                        items: req.items,
                        alertTitle: "Datos Incorrectos",
                        alertMessage: "Contraseña o Correo incorrecto",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: ''
                    })
                } else {
                    // Este else es porque si estaria validado el inicio de sesion
                    const id = results[0].id;
                    const rol = results[0].Rol; // Capturamos el rol del usuario para saber si en admin o no
                    //console.log('El rol es: ' + rol);
                    const name = results[0].Nombres; // Obtener el nombre desde la base de datos
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    //console.log("Token: " + token + " para el Usuario: " + user);
                    //console.log(results); //results atrapa el objeto ussuario que se esta buscando, toda la informacion saved en la base de datos

                    //Configuracion de las cookies
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }

                    if (rol === "admin") {
                        //Nombre con el que va aparecer la cookie en el navegador
                        res.cookie('jwt', token, cookiesOptions)
                        res.render('index', {
                            alert: true,
                            items: req.items,
                            alertTitle: "Bienvenido a Ampack",
                            alertMessage: `Hola ${name}`,
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: 800,
                            ruta: 'loginAdmin' // Este era mi error porque al dejar login en la pate re res.render, no dabe tiempo de que cargara isAuthenticated lo que hacia que user no estuviera definida, es decir cargamos ahora en mensaje en el index y que la ruta nos lleve al login
                        })
                    } else {
                        //Nombre con el que va aparecer la cookie en el navegador
                        res.cookie('jwt', token, cookiesOptions)
                        res.render('index', {
                            alert: true,
                            items: req.items,
                            alertTitle: "Bienvenido a Ampack",
                            alertMessage: `Hola ${name}`,
                            alertIcon: 'success',
                            showConfirmButton: true,
                            timer: 800,
                            ruta: 'login' // Este era mi error porque al dejar login en la pate re res.render, no dabe tiempo de que cargara isAuthenticated lo que hacia que user no estuviera definida, es decir cargamos ahora en mensaje en el index y que la ruta nos lleve al login
                        })
                    }
                }
            })
        }

    } catch (error) {
        console.log(error);
    }
};

// Metodo para saber si el usuario esta autenticado
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            const userId = parseInt(decodificada.id);

            conexion.query('SELECT * FROM Usuario WHERE id = ?', [userId], (error, results) => {
                if (error) {
                    console.error('Error al verificar la autenticación:', error);
                    return res.redirect('/');
                }

                if (!results || results.length === 0) {
                    return res.redirect('/');
                }

                req.user = results[0];
                //console.log('Esto es user: ' + req.user)
                return next();
            });
        } catch (error) {
            console.error('Error al verificar la autenticación:', error);
            return res.redirect('/');
        }
    } else {
        return res.redirect('/');
    }
}

//Cerrar sesion
exports.logout = (req, res) => {
    res.clearCookie('jwt');
    //console.log(res.clearCookie('jwt'))

    // Evitar el almacenamiento en caché
    res.setHeader('Cache-Control', 'no-store, private, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return res.redirect('/');
}

