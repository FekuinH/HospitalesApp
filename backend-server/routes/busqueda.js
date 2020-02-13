var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//========================================
// BUSQUEDA GENERAL
//========================================
app.get('/todo/:busqueda', (req, res, next) => {

    //extraigo termino de busqueda de la url
    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');

    //metodo que recibe un arreglo de promesas y devuelve la respuestas de todos tambien en un arreglo
    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
        //arreglo de respuestas
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

});


//========================================
// BUSQUEDA ESPECIFICA
//========================================

app.get('/:tabla/:termino', (req, res, next) => {

    var tabla = req.params.tabla;
    var termino = req.params.termino;
    var regex = new RegExp(termino, 'i');
    var promesa;

    switch (tabla) {

        case 'usuarios': promesa = buscarUsuarios(termino, regex);
            break;

        case 'medicos': promesa = buscarMedicos(termino, regex);
            break;

        case 'hospitales': promesa = buscarHospitales(termino, regex);
            break;

        default: return res.status(400).json({
            ok: false,
            mensaje: 'No se pudo realizar la busqueda',
            errors: { message: 'Solo se pueden realizar busquedas sobre Medicos, Usuarios y Hospitales' }

        });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });

});

//busqueda hospitales, devuelve promesa con los hospitales
function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                // si hay error cancelo la promesa
                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    //resuelvo la promesa con la lista de hospitales
                    resolve(hospitales);
                }
            });
    });
}

//busqueda medicos, devuelve promesa con los medicos
function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre , email')
            .populate('hospital')
            .exec((err, medicos) => {

                // si hay error cancelo la promesa
                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    //resuelvo la promesa con la lista de medicos
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre mail role email')
            //buscar por mas de una condicion. Recibe un arreglo
            .or([{ 'nombre': regex }, { 'email': regex }])
            //ejecuto el query
            .exec((err, listaUsuarios) => {

                //error al obtenerla
                if (err) {
                    reject('Error al cargar los usuarios', err)
                } else {
                    // si esta todo bien resuelvo la promesa
                    resolve(listaUsuarios)
                }

            });
    });
}






module.exports = app;