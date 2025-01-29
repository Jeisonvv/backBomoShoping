const { Router } = require('express');
const routerWhatsapp = Router();

const {sendMessageToGroup} = require('../controllers/whatsappController'); //controlador que envia el mensaje al grupo


routerWhatsapp.post('/send', sendMessageToGroup); //ruta para enviar mensaje al grupo




module.exports = { routerWhatsapp }; //exportamos el router
