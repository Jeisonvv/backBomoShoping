const { Router } = require('express');

const { loginController } = require('../controllers/authController'); // Importar el controlador de login

const {routerWhatsapp} = require('./routerWhatsapp'); // Importar el router de WhatsApp
const {routerProducts} = require('./routerProducts'); // Importar el router de productos
const {routerUser} = require('./routerUsers'); // Importar el router de usuarios

const router = Router();

router.post('/login', loginController);

router.use('/whatsapp', routerWhatsapp);

router.use('/products', routerProducts);

router.use('/users', routerUser);

module.exports = { router };

