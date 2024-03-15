const conexion = require('../database/db');
const multer = require('multer'); //permite gestionar fácilmente la carga de archivos en Node.js
const { promisify } = require('util'); // promisify ya esta incluido en node por eso esta entre llaves, es para indicar que vamos a utilizar promesas, es una comunicacion asincrona (algo que se va a retornar)
const { Console } = require('console');
const { configDotenv } = require('dotenv');

// Configuración de multer para gestionar la carga de archivos 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');  // Directorio donde se guardarán las imágenes
    },
    //La función cb (callback) se utiliza para devolver el resultado de la operación asíncrona
    filename: (req, file, cb) => {
        //null indica que no ha ocurrido un error durante la operación. Date.now() devuelve el tiempo actual en milisegundos desde el 1 de enero de 1970 (también conocido como la marca de tiempo UNIX).
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('img');

//Crear un nuevo producto en la base de datos:
exports.product = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Error de multer
                console.log(err);
                return res.status(500).send('Error al cargar la imagen.');
            } else if (err) {
                // Otro tipo de error
                console.log(err);
                return res.status(500).send('Error interno del servidor.');
            }

            const nameP = req.body.nameP;
            const type = req.body.tipoP;
            const ava = req.body.cantidadDisponible;
            const amount = req.body.valor;
            const file = req.file.filename;

            //console.log(nameP, type, ava, amount, file);

            // Consulta para verificar si el producto ya existe
            const nameItem = await new Promise((resolve, reject) => {
                conexion.query('SELECT * FROM Productos WHERE NombreProd = ?', [nameP], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.length > 0);
                    }
                });
            });

            if (nameItem) {
                // El producto ya existe
                return res.render('index', {
                    alert: true,
                    alertTitle: "Tenemos un inconveniente",
                    alertMessage: "Este Producto ya existe",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'loginAdmin'
                });
            }

            // Creamos el insert para guardar los datos del formulario en la base de datos
            conexion.query('INSERT INTO Productos SET ?', { NombreProd: nameP, TipoMaterial: type, CantidadDisponible: ava, ValorProducto: amount, img: file }, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error al guardar el producto en la base de datos.');
                }

                return res.render('index', {
                    alert: true,
                    alertTitle: "Registro exitoso",
                    alertMessage: `El producto ${nameP}, ha sido creado`,
                    alertIcon: 'success',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'loginAdmin'
                });
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error interno del servidor.');
    }
};

// Mostrar lista de productos // OJOOO basicamente asyn es para funciones que realizan de manera syncronica, y si no se pone await puede que la funcion se ejecute sin un orden, porque no estaria esperando un proceso, await lo utilizamos normalmente con promesas
exports.listP = async (req, res, next) => {
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

        if (!results || results.length === 0) {
            return next();
        }

        req.items = results;
        return next();
    } catch (error) {
        console.error('Error en listP: ', error);
        return next();
    }
};

//editar
exports.edit = async (req, res, next) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Error de multer
                console.log(err);
                return res.status(500).send('Error al cargar la imagen.');
            } else if (err) {
                // Otro tipo de error
                console.log(err);
                return res.status(500).send('Error interno del servidor.');
            }

            const nameP = req.body.nameP;
            const type = req.body.tipoP;
            const ava = req.body.cantidadDisponible;
            const amount = req.body.valor;
            const code = req.body.cod

            const file = null;
            if (req.file) {
                // Si hay un archivo adjunto en la solicitud
                file = req.file.filename;
                //console.log(nameP, type, ava, amount, file, code);
                const changeItem = await new Promise((resolve, reject) => {
                    conexion.query(
                        'UPDATE Productos SET NombreProd = ?, TipoMaterial = ?, CantidadDisponible = ?, ValorProducto = ?, img = ? WHERE Codigo = ?',
                        [nameP, type, ava, amount, file, code],
                        (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                return res.render('index', {
                                    alert: true,
                                    alertTitle: "Registro exitoso",
                                    alertMessage: `El producto ${nameP}, ha sido actualizado`,
                                    alertIcon: 'success',
                                    showConfirmButton: true,
                                    timer: false,
                                    ruta: 'loginAdmin'
                                });
                            }
                        }
                    );
                });

            } else {
                //console.log(nameP, type, ava, amount, file, code);
                const remove = await new Promise((resolve, reject) => {
                    conexion.query('UPDATE Productos SET NombreProd = ?, TipoMaterial = ?, CantidadDisponible = ?, ValorProducto = ? WHERE Codigo = ?', [nameP, type, ava, amount, code],
                        (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                return res.render('index', {
                                    alert: true,
                                    alertTitle: "Registro exitoso",
                                    alertMessage: `El producto ${nameP}, ha sido actualizado`,
                                    alertIcon: 'success',
                                    showConfirmButton: true,
                                    timer: false,
                                    ruta: 'loginAdmin'
                                });
                            }
                        }
                    );
                });
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Error interno del servidor.');
    }
};

exports.delete = async (req, res, next) => {
    try {
        const code = req.body.codD;
        console.log("Código del producto a eliminar:", code);

        const remove = await new Promise((resolve, reject) => {
            conexion.query('DELETE FROM Productos WHERE Codigo = ?', [code], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    return res.render('index', {
                        alert: true,
                        alertTitle: "Tabla Actualizada",
                        alertMessage: `El producto ha sido eliminado`,
                        alertIcon: 'success',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'loginAdmin'
                    });
                }
            });
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send('Error interno del servidor.');
    }
};







