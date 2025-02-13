const { Router } = require('express');

const { loginController } = require('../controllers/authController'); // Importar el controlador de login
const {deleteFoldersController } = require('../controllers/deleteFolderController'); // Importar el controlador de eliminar carpetas

const {routerWhatsapp} = require('./routerWhatsapp'); // Importar el router de WhatsApp
const {routerProducts} = require('./routerProducts'); // Importar el router de productos
const {routerUser} = require('./routerUsers'); // Importar el router de usuarios

const router = Router();
// quiero hacer un comit 

router.post('/login', loginController);

router.use('/whatsapp', routerWhatsapp);

router.use('/products', routerProducts);

router.use('/users', routerUser);

router.delete('/delete-folders', deleteFoldersController); // Ruta para eliminar carpetas

module.exports = { router };

