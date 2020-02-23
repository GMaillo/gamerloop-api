'use strict';

// Registrados en la web de mailtrap hacemos uso de nodemailer para generar el mail de recuperación de contraseña 

const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

class MailController {
    async resetPassword(req, res, next) {
        try {
            const email = req.body.email;
            const usuario = await Usuario.findOne({ email: email })
            if(!usuario) {
                res.json({success: false, error: 'El email introducido no existe: ' + email});
                return;
            }

            const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            var transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  usuario: "a064271ca4620e",
                  pass: "ba8adcfb1cda3f"
                }
              });

              const info = await transporter.sendMail({
                  from: "'GamerLoop Team' <admin@gamerloop.es>",
                  to: `${email}`,
                  subject: 'Solicitud de recuperación de password',
                  text:'¿Ha olvidado su password? No se preocupe, haga click en el siguiente enlace\n'
                  + `http://localhost:3002/reset/${email}/${token}\n\n`,
              });
              transport.sendMail(info, async (err, response) => {
                  if (err) {
                      console.error('error', e);

                  } else {
                      res.json({
                    success: true,
                    result: 'Mail enviado con exito a' + email,
                    response: response});
                  }
                });
            }       catch (err){
                    next(err);
          }
              
        }
    }
    


module.exports = new MailController();