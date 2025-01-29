const {Router} = require('express');
const routerProducts = Router();
const {getProductscontroller, getProductByIdcontroller, createProductcontroller, updateProductcontroller, deleteProductcontroller, allDelateProductscontroller, decremenstockProductController} = require('../controllers/productsController');

routerProducts.get('/', getProductscontroller); //ruta para obtener todos los productos
routerProducts.get('/:id', getProductByIdcontroller); //ruta para obtener un productopor su id
routerProducts.post('/', createProductcontroller); // ruta para crear un producto
routerProducts.put('/:id', updateProductcontroller); //ruta para actualizar un producto
routerProducts.delete('/:id', deleteProductcontroller); //ruta para eliminar un producto
routerProducts.delete('/', allDelateProductscontroller); //ruta para eliminar todos los productos
routerProducts.put('/decrementstock/:id', decremenstockProductController); //ruta para decrementar el stock de un producto

module.exports = {routerProducts}; //exportamos el router