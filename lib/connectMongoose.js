'use strict';

// cargar libreria
const mongoose = require('mongoose');
const conn = mongoose.connection;

// gestión de eventos de conexión
conn.on('error', err => {
   console.log('Error conexión', err);
   process.exit(1);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB en', conn.name);
});

// conectar
mongoose.connect('mongodb://localhost/gamerloop', { useNewUrlParser: true});

// exportar la conexión
module.exports = conn;