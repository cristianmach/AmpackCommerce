// Aqui vamos a realizar la conexion a la base de datos =
const mysql = require('mysql');

// Asignamos los valores que de la conexion que hicimos en nuestro .env =
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

// Conectamos la base de datos conn .connect y damos un Mensaje de Confirmacion de la conexion =
conexion.connect((error) => {
    if (error) {
        console.log('El error de la conecxion es: ' + error);
        return
    }
    console.log('Conectados a la Base de Datos');
})

// =
module.exports = conexion;

//----------------------------------------------------------- HASTA AQUI SEGUNDO VIDEO