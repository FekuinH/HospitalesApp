var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;

    var id = req.params.id;


    //tipos de coleccion
    var tiposValidos = ['medicos', 'usuarios', 'hospitales'];

    //check si es un tipo valido
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se pueden subir archivos a esa coleccion',
            error: { message: 'Las colecciones validas son: ' + tiposValidos.join(', ') }
        });
    }


    //check imagen en el request
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No ha seleccionado un archivo',
            error: { message: 'Debe seleccionar al menos un archivo' }
        });
    }

    //get archivo
    var archivo = req.files.imagen;
    //get name archivo
    var name = archivo.name;
    //separo el nombre en .
    var nombreSeparado = name.split('.');
    // get extension del archivo
    var extension = nombreSeparado[nombreSeparado.length - 1];


    //extensiones validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //check si la extension del archivo es valida
    if (!extensionesValidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            error: { message: 'Las extensiones validas son' + extensionesValidas.join(', ') }
        });

    }


    //generar nombre random al archivo
    var nombreRandom = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //get path para guardar archivos
    var path = `./uploads/${tipo}/${nombreRandom}`;

    //mover el archivo a la ruta nueva
    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                error: err
            });
        }


        subirPorTipo(tipo, id, nombreRandom, res);

    });





});






function subirPorTipo(tipo, id, nombreRandom, res) {


    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario){
                return res.status(200).json({
                    ok: false,
                    mensaje: 'no existe usuario con ese id'
                });
            }

            //get path viejo
            var pathViejo = './uploads/usuarios/' + usuario.img;
            console.log(pathViejo);

            // check si existe el path viejo
            if (fs.existsSync(pathViejo)) {
                //borro el path viejo
                fs.unlinkSync(pathViejo)
            }

            // seto nuevo nombre de imagne
            usuario.img = nombreRandom;

            // actualizo al usuario con sus cambios
            usuario.save((err, usuarioActualizado) => {
                if (err){
                    return res.status(200).json({
                        ok: false,
                        errors: err
                    })
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada correctamente',
                    usuario: usuarioActualizado
                });
            });

        });

    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico){
                return res.status(200).json({
                    ok: false,
                    mensaje: 'no existe medico con ese id'
                });
            }

            //get path viejo
            var pathViejo = './uploads/medicos/' + medico.img;

            // check si existe el path viejo
            if (fs.existsSync(pathViejo)) {
                //borro el path viejo
                fs.unlinkSync(pathViejo);
            }

            // seto nuevo nombre de imagne
            medico.img = nombreRandom;

            // actualizo al usuario con sus cambios
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada correctamente',
                    medico: medicoActualizado
                });
            });

        });
    
    }
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital){
                return res.status(200).json({
                    ok: false,
                    mensaje: 'no existe hospital con ese id'
                });
            }
            //get path viejo
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // check si existe el path viejo
            if (fs.existsSync(pathViejo)) {
                //borro el path viejo
                fs.unlinkSync(pathViejo);
            }

            // seto nuevo nombre de imagne
            hospital.img = nombreRandom;

            // actualizo al usuario con sus cambios
            hospital.save((err, hospitalActualizado) => {

                if (err){
                   
                    return res.status(500).json({
                        ok: false,
                        errors: err
                    })
                    

                }


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada correctamente',
                    hospital: hospitalActualizado
                });
            });

        });
    
    }


}





module.exports = app;