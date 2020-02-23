'use strict';

const express = require('express');
const router = express.Router();
const cote = require('cote');
const Anuncio = require('../../models/Anuncio');
const jwtAuth = require('../../lib/jwtAuth');
const requester = new cote.Requester({ name: 'Client' });
const Usuario = require('../../models/Usuario');
//Método GET anuncios. Devuelve lista de anuncios

router.get('/', async (req, res, next) => {
    try {
        const nombre = req.query.nombre;
        const usuario =  req.query.usuario;
        const tags = req.query.tag;
        const precio = req.query.precio;
        const venta = req.query.venta;
        const limit = parseInt(req.query.limit) || 0;
        const start = parseInt(req.query.start) || 10;
        const sort = req.query.sort;
        const filter = {};

        if(nombre) {
            filter.nombre = new RegExp('^' + nombre, "i");
        }

        if(usuario) {
            filter.usuario = usuario;
        }

        if (typeof precio !== 'undefined') {
            if (precio !== '') {
                if (precio[0] === '-') {
                    filter.precio = {'$lte': Math.abs(parseInt(precio))};
                } else if (precio[precio.length - 1] === '-'){
                    filter.precio = {'$gte': parseInt(precio)};
                } else if (precio.indexOf('-') > 0 && precio.indexOf('-') < precio.length - 1){
                    let precio1 = precio.substring(0, precio.indexOf('-'));
                    let precio2 = precio.substring(precio.indexOf('-') + 1 , precio.length);
                    filter.precio = {'$gte': parseInt(precio1), '$lte': parseInt(precio2)};
                } else {
                    filter.precio = precio;
                }
            }
        }

        if (tags) {
            if (tags.includes(tags) === true) {
                filter.tags = tags;
            }
        }
        
        if(typeof venta !== 'undefined') {
            if (venta !== '') {
                filter.venta = venta;
            }
        }
        const anuncios = await Anuncio.list({filter: filter, limit, start, sort});
            res.json({ success: true, result: anuncios});
    }catch (err) {
        next(err);
    }
});

// Método GET para recuperar anuncios

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.param('id');
        const ad = await Anuncio.findById(id).populate('autor', 'username');
        await res.json({ success: true, result: ad });
    } catch (e) {
        next(e);
    }
});

// Método GET de tags de los anuncios

router.get('/tags', async (req, res, next) => {
   try {
       const tags = await Anuncio.distinct('tags').exec();
       await res.json({ success: true, result: tags });
   } catch (e) {
       next(e);
   }
});

// Método POST para crear un anuncio

router.post('/',jwtAuth(), async (req, res, next) => {
    try {
      const data = req.body;
      data.date = new Date();
      data.foto = req.file.filename;
      const anuncio = new Anuncio(data);

    requester.send({
           type: 'transform',
           filename: req.file.filename,
           path: req.file.path,
           destination: req.file.destination
       });

       const anuncioSave = await anuncio.save();

       res.json({ success: true, result: anuncioSave });
   } catch (e) {
       next(e);
   }
});


// Método PUT para actualizar los anuncios

router.put('/update/:id', jwtAuth(), async (req, res, next) => {
    try {
        const adId = req.param('id');
        const ad = req.body;
        let tags = [];
        req.body.tags.map(tag => {
             tags.push(tag.value);
        });
        await Anuncio.findByIdAndUpdate(adId,
            {
                nombre: ad.nombre,
                descripcion: ad.descripcion,
                precio: ad.precio,
                tags: tags,
                venta: ad.venta.value,
                 });
        res.json({ success: true });
    } catch (e) {
        console.log('ERROR: ', e);
        next(e);
    }
 });

// Método DELETE  para eliminar un anuncio

router.delete('/delete/:id', jwtAuth(), async (req, res, next) => {
    try {
        const adId = req.param('id');
        await Anuncio.deleteOne({_id: adId});
        await Usuario.updateMany( {}, { $pullAll: {favs: [adId] } });
        res.json({ success: true });
    } catch (e) {
        console.log('ERROR: ', e);
        next(e);
    }
});


module.exports = router;