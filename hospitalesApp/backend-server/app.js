// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//inicializar variables
var app= express();
let port = process.env.PORT || 3000;

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });
  


//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





//Importo rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalesRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if (err) throw err;
    console.log('Base de datos \x1b[32m%s\x1b[0m escuchando en el puerto 27017', 'ONLINE');
});

//Rutas

app.use('/usuario',usuarioRoutes);
app.use('/medico',medicosRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalesRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/',appRoutes);


//escuchar peticiones
app.listen(port, ()=>{
    console.log('Servidor \x1b[32m%s\x1b[0m escuchando en el puerto 3000', 'ONLINE');
})

