const mongoose = require('mongoose');
//Para obtener Schema
const Schema = mongoose.Schema;


//Declaracion de un nuevo Schema
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: [true, 'La descripcion es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);