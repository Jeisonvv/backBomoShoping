const {Router} = require('express');

const routerUser = Router();

const {registerUserController, updateUserController, getUserController, getUserByIdController, deleteUserComtroller, getUserCredentialsController, updateCredentialsController, addProductToUserController, deleteProductFromUserController, getUserPurchasesController, removeProductUserController, registerUserPhoneControler } = require('../controllers/userContrller');

routerUser.get('/', getUserController); //ruta para obtener todos los usuarios

routerUser.get('/:numPhone', getUserByIdController); //ruta para obtener un usuario por su id

routerUser.get('/credentials/:numPhone', getUserCredentialsController); //ruta para obtener las credenciales de un usuario

routerUser.get('/purchases/:numPhone', getUserPurchasesController); //ruta para obtener las compras de un usuario

routerUser.post('/register', registerUserController); //ruta para registrar un usuario solo con el número de teléfono

routerUser.post('/register-User', registerUserPhoneControler); //ruta para registrar un usuario solo con el número de teléfono, userName, Pasword

routerUser.post('/add-product/:numPhone', addProductToUserController); //ruta para agregar un producto al carrito de un usuario

routerUser.put('/update/:numPhone', updateUserController); //ruta para actualizar las credenciales del usuario

routerUser.put('/update-credentials/:numPhone', updateCredentialsController);

routerUser.delete('/:numPhone', deleteUserComtroller); //ruta para eliminar un usuario

routerUser.delete('/purchases-delete-all/:numPhone', deleteProductFromUserController); //ruta para eliminar todos los usuarios

routerUser.delete('/remove-product/:numPhone', removeProductUserController); //ruta para eliminar un producto del carrito de un usuario



module.exports = {routerUser}; //exportamos el router
