const express = require('express');

let { verificaToken, verificaAdmin_ROle } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
const categoria = require('../models/categoria');


// =======================================
// Mostar todas las categorias
// =======================================
app.get('/categoria', verificaToken, (req, res) => {

    //El primer arg del pupulate es el objeto que esta en Categoria que queremos mostrar y 
    //el segundo arg son los campos que deseo mostrar Nota: si hay otro esquema se agrega debajo
    //sort para ordenar la lista
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

// =======================================
// Mostrar una categoria por ID
// =======================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =======================================
// Crear nueva categoria
// =======================================
app.post('/categoria', verificaToken, (req, res) => {
    //regresar la nueva categoria
    //Para obtener el id del usuario: req.usuario._id Nota: esto funciona xq estamos verificando el token y trae el id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// =======================================
// Actualizar la catgoria
// =======================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    };

    //el primer parametro es el id, el segundo es la informacion que yo quiero actualizar 
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// =======================================
// Eliminar una categoria
// =======================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_ROle], (req, res) => {
    //solo un administrador puede borrar categorias
    //Categoria.findByAndRemove
    let id = req.params.id;

    //Borrar un registro cambiando si estado 
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            //categoria: categoriaBorrada
            message: 'Categoria borrada'
        });

    });

});







module.exports = app;