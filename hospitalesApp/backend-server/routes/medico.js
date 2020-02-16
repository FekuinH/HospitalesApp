var express = require('express');


var auth = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

//=================================
//obtener todos los medicos
//=================================
app.get('/', (request, response, next) => {

    //parametro opcional para paginación
    var desde = Number(request.query.desde) || 0;

    Medico.find({})
        //desde que paginacion    
        .skip(desde)
        //registros por paginacion    
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec(
            (err, listaMedicosResponse) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error en la base de datos al obtener la lista de medicos',
                        errors: err
                    });
                }
                //total de medicos para la response
                Medico.count({}, (err, total) => {

                    response.status(200).json({
                        ok: true,
                        medicos: listaMedicosResponse,
                        total: total
                    });
                });
            });
});

//=================================
//Crear un nuevo medico
//=================================
app.post('/', auth.verificarToken, (req, response, next) => {

    //obtengo el cuerpo del jsonResponse
    var body = req.body;

    //Creo un nuevo medico y lo lleno con la informacion del body
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    // guardo el medico en BD. Puedo recibir un ERROR o el medico guardado correctamente
    medico.save((err, medicoGuardado) => {

        //error
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos al guardar el medico',
                errors: err
            });
        }
        //caso feliz
        response.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioSolicitante: req.usuario
        });
    });


});

//=================================
//Actualizar un medico
//=================================
app.put('/:id', auth.verificarToken, (req, response, next) => {

    // obtengo el id proveniente del request
    var id = req.params.id;
    // obtengo el body proveniente del request. SOLO LO USO SI NO HAY ERRORES
    var body = req.body;

    // obtengo al medico con el id
    Medico.findById(id, (err, medico) => {

        // error al buscar el medico en la base de datos
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al obtener medico en la base de datos',
                errors: err
            });
        }

        //no encontro medico con el id especificado
        if (medico === null) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe medico con  el id numero :' + id,
                errors: { message: 'no existe medico con ese ID' }
            });
        }

        // caso de que no haya error y exista medico
        //seteo al medico todos los datos del requestBody
        medico.nombre = body.nombre;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;


        //guardo los cambios en el medico
        medico.save((err, medicoGuardado) => {

            //error al guardar medico en la BD
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }

            //caso feliz, medico actualizado
            response.status(200).json({
                ok: true,
                mensaje: 'Medico actualizado correctamente',
                medico: medicoGuardado
            });

        });







    });

});

//=================================
//Eliminar un medico
//=================================
app.delete('/:id', auth.verificarToken, (req, response, next) => {

    //get req id
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el medico',
                errors: err
            });
        }


        if (!medicoBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con el id :' + id,
                errors: { message: 'No se puede borrar un medico inexistente' }
            });
        }

        response.status(200).json({
            ok: true,
            mensaje: 'Medico eliminado de la base de datos correctamente',
            medico: medicoBorrado
        });

    });
});


//=================================
//Obtener médico por id
//=================================
app.get('/:id', (req, res, next) => {

    let id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medicoResponse) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al obtener el médico en la BD',
                    errors: err
                });
            }

            if (!medicoResponse) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe médico con ese ID',
                    errors: { message: 'El id seleccionado no pertenece a ningún médico' }
                });

            }
            res.status(200).json({
                ok: true,
                medico: medicoResponse
            });
        });
})










module.exports = app;