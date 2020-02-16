var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

// modelo Usuario y Dao Usuario 
var Usuario = require('../models/usuario');

//GOOGLE
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

let auth = require('../middlewares/autenticacion');


//=================================
//login normal
//=================================
app.post('/', (req, response) => {

    // request body
    var body = req.body;

    // busco usuario por mail
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        // error interno BD
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: "Error al obtener el usuario en la base de datos",
                errors: err
            });
        }

        // no hay usuario con el mail buscado
        if (!usuarioDB) {
            return response.status(400).json({
                ok: false,
                mensaje: "Error de credenciales - mail",
                errors: { message: 'No se pudo encontrar el usuario o contraseña' }
            });
        }

        // comparo contraseña del usuario con la del reqBody.
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).json({
                ok: false,
                mensaje: "Error de credenciales - password",
                errors: { message: 'No se pudo encontrar el usuario o contraseña' }
            });
        }


        //Caso feliz: No hubo error en BD, encontro al usuario por mail y la contraseña del usuarioDB coincide con la del body

        //tapo la contraseña para no mandarla en el token
        usuarioDB.password = '***';
        // lleno token con usuarioobtenido, clave secreta inventada y le seteo el tiempo que dura
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 3600 });




        response.status(200).json({
            ok: true,
            mensaje: 'Ha iniciado sesión correctamente',
            token: token,
            usuario: usuarioDB,
            menu: obtenerMenu(usuarioDB.role)
        });

    });




});


app.post('/google', async (req, res) => {

    var token = req.body.token

    //usuario identificado por google.  await > espera la respuesta de la promesa
    await verify(token).then(googleUser => {

        // busco por mail para saber si ya existe el usuario en la bd
        Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

            //error al obtener el usuario
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la base de datos al obtener el usuario',
                    errors: err
                });
            }

            //ya existe usuario con mail de google
            if (usuarioDB) {

                //no fue creado por google, debe usar su autenticacion normal
                if (!usuarioDB.google) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error en la autenticación',
                        errors: { message: 'Debe ingresar con otra cuenta debido a que no se ha registrado con google' }
                    });
                } else {
                    // usuario que ya existe y que fue autenticado por google
                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 3600 });

                    res.status(200).json({
                        ok: true,
                        mensaje: 'Ha iniciado sesión correctamente',
                        token: token,
                        usuario: usuarioDB
                    });
                }
                //no existe el usuario con mail de google, HAY QUE CREARLO
            } else {
                // new usuario con los datos del googleUser
                var usuario = new Usuario({

                    nombre: googleUser.nombre,
                    email: googleUser.email,
                    img: googleUser.nombre,
                    google: true,
                    password: googleUser.password
                });
                // guardo al usuario
                usuario.save((err, usuarioDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error en la base de datos al guardar el usuario',
                            errors: err
                        });
                    }

                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 3600 });


                    res.status(200).json({
                        ok: true,
                        mensaje: 'Ha iniciado sesión correctamente',
                        token: token,
                        usuario: usuarioDB
                    });


                });
            }

        });
    })
        //error   
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: e
            });

        });



});



async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



function obtenerMenu(ROLE) {


    let menu = [
        {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Progress', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' }
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // {  titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Medicos', url: '/medicos' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }


    return menu;
}

//=================================
//renovar token
//=================================
app.get('/renovartoken', auth.verificarToken, (req, res) => {

    // lleno token con usuarioobtenido, clave secreta inventada y le seteo el tiempo que dura
    let token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 });

    res.status(200).json({
        ok: true,
        token: token
    });
});






module.exports = app;