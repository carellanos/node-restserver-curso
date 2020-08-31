const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


// =======================================
// Obtener productos 
// =======================================
app.get('/producto', verificaToken, (req, res) => {
    //Trae todos los productos 
    //populate: usuarios y categoria
    //paginado : skip para saltar la pagina 

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    //va trae todos los productos disponibles = true
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuarios', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

// =======================================
// Obtener un producto por ID
// =======================================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuarios y categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuarios', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });
});


// =======================================
// Buscar producto
// =======================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //Expresion regular para buscar en BD lo que conicida con o que se esta solicitando
    //la 'i' para que sea sensible a mayus y minus. Se pueden pasar otros parametros en el  obj por EJ: Producto.find({ nombre: regex, disponible: })
    let regex = RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productos
            });
        });
});

// =======================================
// Crear un nuevo producto
// =======================================
app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria de la lista que ya tenemos

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

// =======================================
// Actualizar un producto
// =======================================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

    /*
     * Otra forma de actualizar: Producto.findById(id, (err, productoDB))
     * si no hay error, "productoDB.nombre = body.nombre" esto se debe hacer por cada propiedad del esquema
     * productoDbB.save((err, productoGuardado)) => { if(err), res.json}
     */

});

// =======================================
// Borra un producto
// =======================================
app.delete('/producto/:id', verificaToken, (req, res) => {
    //cambiar el estado de disponible sin eliminar fisicamente el registro

    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            message: 'Producto Borrado'
        });

    });

    /*
     * Otra forma de eliminar: Producto.findById(id, (err, productoDB))
     * si no hay error, "productoDB.disponible = false" 
     * productoDbB.save((err, productoBorrado)) => { if(err), res.json}
     */

});



module.exports = app;