var express = require('express');
var bcrypt = require('bcryptjs');


var auth = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

//=================================
//obtener todos los usuarios
//=================================
app.get('/', (request, response, next) => {

    //parametro opcional para paginación
    var desde = Number(request.query.desde) || 0;

    Usuario.find({}, 'nombre email img role google')
        //desde que paginacion    
        .skip(desde)
        //registros por paginacion    
        .limit(5)
        .exec(
            (err, listaUsuariosResponse) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error en la base de datos al obtener la lista de usuarios',
                        errors: err
                    });
                }

                //cuento la cantidad total para mandarla en la respuesta del servicio
                Usuario.count({}, (err, total) => {
                    response.status(200).json({
                        ok: true,
                        usuarios: listaUsuariosResponse,
                        total: total
                    });

                });

            });
});

//=================================
//Crear un nuevo usuario  auth.verificarToken,
//=================================
app.post('/', (req, response, next) => {

    //obtengo el cuerpo del jsonResponse
    var body = req.body;

    //Creo un nuevo usuario y lo lleno con la informacion del body
    var usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    // guardo el usuario en BD. Puedo recibir un ERROR o el usuario guardado correctamente
    usuario.save((err, usuarioGuardado) => {

        //error
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos al guardar el usuario',
                errors: err
            });
        }
        //caso feliz
        response.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioSolicitante: req.usuario
        });
    });


});

//=================================
//Actualizar un uzuario
//=================================
app.put('/:id', [auth.verificarToken, auth.verificarRolYUser], (req, response, next) => {

    // obtengo el id proveniente del request
    var id = req.params.id;
    // obtengo el body proveniente del request. SOLO LO USO SI NO HAY ERRORES
    var body = req.body;

    // obtengo al usuario con el id
    Usuario.findById(id, (err, usuario) => {

        // error al buscar el usuario en la base de datos
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al obtener usuario en la base de datos',
                errors: err
            });
        }

        //no encontro usuario con el id especificado
        if (usuario === null) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con  el id numero :' + id,
                errors: { message: 'no existe usuario con ese ID' }
            });
        }

        // caso de que no haya error y exista usuario
        //seteo al usuario todos los datos del requestBody
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;


        //guardo los cambios en el usuario
        usuario.save((err, usuarioGuardado) => {

            //error al guardar usuario en la BD
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            //caso feliz, usuario actualizado
            response.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado correctamente',
                usuario: usuarioGuardado
            });

        });







    });

});

//=================================
//Eliminar un usuario
//=================================
app.delete('/:id', [auth.verificarToken, auth.verificarRol], (req, response, next) => {

    //get req id
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el usuario',
                errors: err
            });
        }


        if (!usuarioBorrado) {
            return response.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con el id :' + id,
                errors: { message: 'No se puede borrar un usuario inexistente' }
            });
        }

        response.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado de la base de datos correctamente',
            usuario: usuarioBorrado
        });

    });
});







module.exports = app;