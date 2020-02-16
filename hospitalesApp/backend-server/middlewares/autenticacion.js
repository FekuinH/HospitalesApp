
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


//=================================
//Verificar token válido
//=================================


exports.verificarToken = function (req, res, next) {

    //obtengo token la url
    var token = req.query.token;

    //verifico si el token es válido
    jwt.verify(token, SEED, (err, decoded) => {

        //token invalido
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Acceso prohibido: Token inválido',
                errors: err
            });
        }

        // inyecto el usuario solicitante en la request
        req.usuario = decoded.usuario;

        // si la autorización salio bien dejo seguir
        next();

    });

}



//=================================
//Verificar los permisos del usuario
//=================================
exports.verificarRol = function (req, res, next) {

    //extraigo usuario del request
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso prohibido: No tiene permisos para acceder',
            errors: {message: 'No tiene permisos suficientes para acceder a esta acción'}
        });
    }

}


//=================================
//Verificar si es admin o si es el mismo usuario que hace la peticion de editar
//=================================
exports.verificarRolYUser = function (req, res, next) {

    //extraigo usuario del request
    let usuario = req.usuario;
    let id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            mensaje: 'Acceso prohibido: No tiene permisos para acceder',
            errors: {message: 'No tiene permisos suficientes para acceder a esta acción'}
        });
    }

}







