const jwt = require('jsonwebtoken');

// ===================================
//  Verificar Token
// ==================================
let verificaToken = (req, res, nex) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        nex();

    });

};

// ===================================
//  Verificar Token
// ==================================
let verificaAdmin_ROle = (req, res, nex) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        nex();

    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verificaAdmin_ROle
}