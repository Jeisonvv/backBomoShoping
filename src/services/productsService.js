const Product = require('../models/product');
// trae todos los productos 
const getProductService = async () => {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw new Error(`Error al obtener los productos: ${error.message}`);
    }
};
// trae un producto por id
const getProductByIdService = async (id) => {
    try {
        // Buscar el producto por su _id
        const product = await Product.findOne({ _id: id });

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return product;
    } catch (error) {
        throw new Error(`Error al obtener el producto: ${error.message}`);
    }
};
// crea el producto
const createProductService = async (product) => {
    try {
        const newProduct = new Product(product);
        await newProduct.save();
        return newProduct;
    } catch (error) {
        throw new Error(`Error al crear el producto: ${error.message}`);
    }
};

const updateProductService = async (id, product) => {
    try {
        // Asegúrate de que el ID sea válido
        if (!id) {
            throw new Error("El ID del producto es obligatorio.");
        }

        // Actualizar el producto en la base de datos
        const updatedProduct = await Product.findByIdAndUpdate(
            id,                     // ID del producto
            { $set: product },  // Campos a actualizar
            { new: true, runValidators: true } // Retorna el producto actualizado y valida datos
        );

        // Validar si el producto existe
        if (!updatedProduct) {
            throw new Error("Producto no encontrado o no se pudo actualizar.");
        }

        return updatedProduct;
    } catch (error) {
        throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
};

const deleteProductService = async (id) => {
    try {
        // Asegúrate de que el ID sea válido
        if (!id) {
            throw new Error("El ID del producto es obligatorio.");
        }

        // Eliminar el producto de la base de datos
        await Product.findByIdAndDelete(id);

    } catch (error) {
        throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
};

const alldeleteService = async () => {
    try {
        await Product.deleteMany();
    } catch (error) {
        throw new Error(`Error al eliminar los productos: ${error.message}`);
    }
};

module.exports = {
    getProductService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService,
    alldeleteService
}; // Exportamos los servicios

