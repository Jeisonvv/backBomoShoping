const {getProductService, getProductByIdService, createProductService, updateProductService, deleteProductService, alldeleteService  } = require('../services/productsService');


const getProductscontroller = async (req, res) => {
    try {
        const products = await getProductService();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const getProductByIdcontroller = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await getProductByIdService(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const createProductcontroller = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await createProductService(product);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const updateProductcontroller = async (req, res) => {
    try {
        const {id} = req.params;
        const product = req.body;
        const updatedProduct = await updateProductService(id, product);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deleteProductcontroller = async (req, res) => {
    try {
        const {id} = req.params;
        await deleteProductService(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const allDelateProductscontroller = async (req, res) => {        
    try {
        await alldeleteService();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const decremenstockProductController = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await getProductByIdService(id);
        if (product.countInStock > 0) {
            product.countInStock -= 1;
            await updateProductService(id, product);
            res.status(200).json(product);
        } else {
            res.status(400).json({error: 'No hay stock disponible'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = { getProductscontroller, getProductByIdcontroller, createProductcontroller, updateProductcontroller, deleteProductcontroller, allDelateProductscontroller, decremenstockProductController }; // Exportamos los controladores