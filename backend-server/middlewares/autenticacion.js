
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
