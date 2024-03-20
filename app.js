// 1. Invocamolos los modulos de node.js
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const severless = require('serverless-http');

// mire otro video asi que lo que tenga un = al final, es que es una estructura que se define por defecto, es decir, siempre sera igual.

// 2. Aisgnamos los metodos de express a auna variable =
const app = express();

//5. Seteamos el motor de plantillas =
app.set('view engine', 'ejs'); // ejs como html

// 6. Seteamos lA CARPETA PUBLIC PARA ARCHIVOS ESTATICOS (imagenes, videos, ect.) OJO YA NO HAY QUE ESCRIBIR TODA LA RUTA PORQUE YA SABE QUE LOS ARCHIVOS ESTATICOS ESTAN EN LA CARPETA PUBLIC
app.use(express.static('public'));

// 7. configurar node para procsar, enviar data (vamos a trabajar con formularios (login/registro/etc)) =
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // vamos trabajar con json =

// 8. Seteamos la carpeta para las vriables de entorno 
dotenv.config({ path: './env/.env' });

//9. para poder trabajar con las cookies
app.use(cookieParser())

// 10. Llamar al archivo router
app.use('/', require('./routes/router'))

//Para eliminar el cache y no se pueda volver atras con el boton del back del navegador
app.use(function (req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


// 4. Especificamos la ruta raiz. 
// app.get('/', (req, res) => {
//     res.render('index'); // Mensaje de prueba de que esta conectada
// }); OJOO COMENTAMOS ESTO PORQUE ES MEJOR UTILIZAR UN ARCHIVO EXTERNO CON LAS RUTAS COMO SE HIZO EN EL PUNTO 10

// 3. Configuramos el puerto donde va a escuchar nuestra app
app.listen(3000, () => {
    console.log('SERVER UP in http://localhost:3000');
});

//----------------------------- HASTA AQUI PRIMER VIDEO
