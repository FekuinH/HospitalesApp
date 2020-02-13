var express = require('express');
var auth = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');


// lista hospitales
app.get('/', (req, response, next) => {

    //parametro opcional para paginación
    var desde = Number(req.query.desde) || 0;

    //buscar todos sin condicion
    Hospital.find({})
        //desde que paginacion    
        .skip(desde)
        //registros por paginacion    
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, listaHospitalesResponse) => {

                //error
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error en la base de datos al obtener los hospitales',
                        errors: err
                    });
                }

                //0 hospitales en la lista
                if (listaHospitalesResponse.length === 0) {
                    return response.status(200).json({
                        ok: true,
                        mensaje: 'No hay hospitales agregados actualmente',
                    });
                }

                //total registros para response
                Hospital.count({}, (err, total) => {

                    //ok
                    response.status(200).json({
                        ok: true,
                        mensaje: 'Lista de hospitales :',
                        hospitales: listaHospitalesResponse,
                        total: total
                    });

                });




            });
});

// new hospital
app.post('/', auth.verificarToken, (req, response, next) => {

    //body request
    var body = req.body;

    // new hospital con los datos del request
    var hospitalNuevo = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    //intento guardar hospital
    hospitalNuevo.save((err, hospitalGuardado) => {

        //error
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos al guardar el hospital',
                errors: err
            });
        }

        //caso feliz
        response.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioSolicitante: req.usuario
        });
    });

});

//=================================
//Actualizar un hospital
//=================================
app.put('/:id', auth.verificarToken, (req, response, next) => {

    // obtengo el id proveniente del request
    var id = req.params.id;
    // obtengo el body proveniente del request. SOLO LO USO SI NO HAY ERRORES
    var body = req.body;

    // obtengo al hospital con el id
    Hospital.findById(id, (err, hospital) => {

        // error al buscar el hospital en la base de datos
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al obtener el hospital en la base de datos',
                errors: err
            });
        }

        //no encontro hospital con el id especificado
        if (hospital === null) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe hospital con  el id numero :' + id,
                errors: { message: 'no existe hospital con ese ID' }
            });
        }

        // caso de que no haya error y exista hospital
        //seteo al hospital todos los datos del requestBody
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        //guardo los cambios en el hospital
        hospital.save((err, hospitalGuardado) => {

            //error al guardar hospital en la BD
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            //caso feliz, hospital actualizado
            response.status(200).json({
                ok: true,
                mensaje: 'Hospital actualizado correctamente',
                hospital: hospitalGuardado
            });

        });







    });

});


//delete hospital
app.delete('/:id', auth.verificarToken, (req, response, next) => {

    //id hospital obtenido de parametros
    let id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {

        // error en bd
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'error en la base de datos al eliminar hispital',
                errors: err
            });
        }

        //no existe hospital con ese id
        if (!hospitalBorrado) {

            return response.status(400).json({
                ok: false,
                mensaje: 'No existe hospital con ese id',
                errors: 'No se pudo eliminar el hospital ya que el id es incorrecto'
            });
        }

        //caso feliz
        response.status(200).json({
            ok: true,
            mensaje: 'Hospital borrado exitosamente',
            hospitalBorrado: hospitalBorrado
        });


    });
});


module.exports = app;