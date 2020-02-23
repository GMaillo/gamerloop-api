'use strict';

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    venta: Boolean,
    precio: { type: Number, index: true },
    descripcion: String,
    foto: String,
    tags: [String],
    usuario: String,
    date: Date,
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection : 'anuncios' });



anuncioSchema.statics.list = function ({filter, limit, start, sort}) {
    const query = Anuncio.find(filter).populate('autor', 'username');
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec(); 
};

anuncioSchema.statics.getAd = function (id) {
    const query = Anuncio.find(id).populate('autor', 'username').exec();
    return query.exec();
};

const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;