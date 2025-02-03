const mongoose = require('mongoose');
 // crea el esquema para los productos en la base de datos 
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    urlImg: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
    },
});

// crea el modelo de la base de datos
const Product = mongoose.model('product', productSchema);
// exporto el modelo
module.exports = Product;