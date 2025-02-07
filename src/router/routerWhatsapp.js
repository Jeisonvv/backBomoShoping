const { Router } = require('express');
const routerWhatsapp = Router();

const {sendMessageController, getQrCode} = require('../controllers/whatsappController'); //controlador que envia el mensaje al grupo


routerWhatsapp.post('/send', sendMessageController); //ruta para enviar mensaje al grupo
routerWhatsapp.get('/qr', getQrCode); //ruta para enviar el qr




module.exports = { routerWhatsapp }; //exportamos el router
