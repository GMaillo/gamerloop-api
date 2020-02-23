'use strict';
const Usuario = require('../models/Usuario');
const Anuncio = require('../models/Anuncio');


// Método POST para crear nuevo usuario
class RegisterController {
    async postRegUser(req, res, next) {
        try{
            let data = req.body;
            const password = await Usuario.hashPassword(data.password);
            data.password = password;
            const usuario = new Usuario(data);
            const usuarioRegMail = await Usuario.findOne({ email: data.email });
            const usuarioRegUsername = await Usuario.findOne({ username: data.username});
            if (usuarioRegUsername || usuarioRegMail) {
                await res.json({success: false, error: 'El usuario ya existe'});
                return;
            }
                const regUser = await usuario.save();
                await res.json({ success: true, result: regUser });
        }catch (e) {
            next(e);
        }
    }

    /// Método DELETE para eliminar un usuario
    async deleteUser(req, res, next) {
        try {
            const userId = req.param('id');
            await Usuario.deleteOne({_id: userId});
            await Anuncio.deleteMany({autor: { _id: userId}});
            res.json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    // Método PUT para actualizar los datos de un usuario
    async updateUser(req, res, next) {
        try {
            const userId = req.param('id');
            const username = req.body.username;
            const email = req.body.email;
            const usuarioRegMail = await Usuario.findOne({ email: email });
            const usuarioRegUsername = await Usuario.findOne({ username: username});
            if (usuarioRegUsername) {
                if(typeof usuarioRegUsername._id !== userId) {
                    res.json({success: false, error: 'El nombre de usuario ya existe'});
                    return;
                }
            }
            if (usuarioRegMail) {
                if(usuarioRegMail._id != userId) {
                    res.json({success: false, error: 'El email ya esta en uso'});
                    return;
                }
            }
            const usuario = await Usuario.findOneAndUpdate({_id: userId}, {username: username, email: email});
            res.json({success: true, result: usuario});
        }catch (err) {
            next(err);
        }
    }

    // Método UPDATE para actualizar el password de un usuario
    async updatePassword(req, res, next) {
        try {
            const email = req.body.email;
            const password = await Usuario.hashPassword(req.body.password);
            await Usuario.update({email: email}, {password: password});
            res.json({success: true});
        }catch (e) {
            next(e);
        }
    }

   // Método PUT para actualizar favoritos de un usuario
    async favorites(req, res, next) {
        try {
            const anuncio = req.body;
            const userId = req.param('id');
            await Usuario.update({_id: userId}, {$push: {favoritos: anuncio._id}});
            const favs = await Usuario.findOne({_id:userId}).populate('favoritos').exec();
            res.json({success: true, favorites: favs});
        }catch (e) {
            next(e);
        }
    }

    // Método GET para recuperar favoritos de un usuario
    async getAllFavs(req, res, next) {
        try {
            const userId = req.param('id');
            const favs = await Usuario.findOne({_id:userId}).populate('favoritos').exec();
            res.json({success: true, favorites: favs});
        }catch (e) {
            next(e);
        }
    }

    // Método DELETE para borrar favoritos de un usuario
    async deleteFavorite(req, res, next) {
        try {
            const anuncio = req.body;
            const userId = req.param('id');
            await Usuario.updateOne({_id: userId}, {$pull: {favoritos: anuncio._id}});
            const favs = await Usuario.findOne({_id:userId}).populate('favoritos').exec();
            res.json({success: true, favorites: favs});
        }catch (e) {
            next(e);
        }
    }

    
}

module.exports = new RegisterController();