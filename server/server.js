const express = require('express');
const mongoose = require('mongoose');
//Paquete de node por defecto  (path)
const path = require('path');


const app = express();


const bodyParser = require('body-parser');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//********** Conexion a la Base de Datos MongoDB ******************************************
//Port= 27017, Nombre de BD= cafe
//La funcion flecha va recibir un callback en caso de que lo anterio logre hacer la conexion.
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos ONLINE');

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});