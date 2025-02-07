const { sendMessage, getClientStatus } = require('../services/whatsappService');
const Product = require('../models/product');

const sendMessageController = async (req, res) => {
    const product = req.body;

    if (!product) {
        return res.status(400).json({ error: 'Faltan datos en el cuerpo de la solicitud.' });
    }

    try {
        // Verificar el estado del cliente
        const status =  getClientStatus();

        if (!status.authenticated) {
            return res.status(401).json({
                message: 'Cliente no autenticado. Escanea el código QR para continuar.',
            });
        }

        // Guardar el producto en MongoDB solo si está autenticado
        const newProduct = new Product(product);
        await newProduct.save();

        // Obtener el último producto guardado
        const lastProduct = await Product.findOne().sort({ _id: -1 });

        if (!lastProduct) {
            return res.status(404).json({ error: 'No se encontró el último producto guardado.' });
        }

        // Enviar el mensaje con el último producto
        await sendMessage(lastProduct);

        res.status(200).json({ success: true, message: 'Producto guardado y mensaje enviado correctamente.' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al procesar la solicitud.' });
    }
};


const getQrCode = (req, res) => {
    const status = getClientStatus();
    if (!status.authenticated && status.qrCode) {
        res.status(200).json({ qrCode: status.qrCode });
    } else if (status.authenticated) {
        res.status(200).json({ message: 'Cliente autenticado y listo.' });
    } else {
        res.status(500).json({ error: 'No se pudo obtener el QR en este momento.' });
    }
};

module.exports = {
    sendMessageController,
    getQrCode
};
