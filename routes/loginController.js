'use strict';
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    
    index(req, res) {
        res.locals.username = '';
        res.locals.email = '';
        res.locals.error = '';
        res.render('login');
    }

    async loginJWT(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const usuario = await Usuario.findOne({ username: username }).populate('favoritos');

            if (!usuario ||!await bcrypt.compare(password, usuario.password)) {
                await res.json({success: false, error: res.__('El nombre de usuario o la contraseña no son correctos')});
                return;
            }

            const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: '2d'
            });

            await res.json({success: true, session: {token: token, username: usuario.username, email: usuario.email, favoritos: usuario.favoritos, id: usuario._id, }});

        } catch (err) {
            next(err);
        }
    }
}

module.exports = new LoginController();