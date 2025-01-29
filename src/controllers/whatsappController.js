const { sendMessage, getClientStatus } = require('../services/whatsappService');
const Product = require('../models/product');

const sendMessageToGroup = async (req, res) => {
    const  product = req.body;

    if (!product) {
        return res.status(400).json({ error: 'Faltan datos en el cuerpo de la solicitud' });
    }

    try {
        // Guardar el producto en MongoDB
        const newProduct = new Product(product);
        await newProduct.save();

        // Obtener el último producto guardado (más reciente)
        const lastProduct = await Product.findOne().sort({ _id: -1 }); // Ordenamos por _id en orden descendente

        if (!lastProduct) {
            return res.status(404).json({ error: 'No se encontró el último producto guardado' });
        }

        // Crear el mensaje con los datos del último producto
        const fixedMessage =
            `📦 ${lastProduct.name}\n` +
            `${lastProduct.description}\n` +
            `💲$${lastProduct.price.toLocaleString()}\n` +
            `Und: ${lastProduct.countInStock}\n` +
            `${lastProduct._id.toString()}`;

        // El grupo es fijo
        const groupId = '120363322174878103@g.us';

        // Verificar si el cliente está autenticado
        const status = await getClientStatus();
        if (!status.authenticated) {
            return res.status(401).json({
                success: false,
                message: 'Cliente no autenticado. Escanea el código QR para continuar.',
                qr: status.qrCode,
            });
        }

        // Enviar el mensaje con la imagen si existe
        const sendMessagePromise = sendMessage(groupId, fixedMessage, lastProduct.image || null);

        // Responder al cliente inmediatamente después de intentar enviar el mensaje
        sendMessagePromise
            .then(() => {
                // Responder al cliente sin esperar la ejecución completa del mensaje
                res.status(200).json({ success: true, message: 'Producto guardado y mensaje enviado correctamente' });
            })
            .catch((error) => {
                console.error('Error al enviar el mensaje:', error);
                res.status(500).json({ success: false, error: 'Error al enviar el mensaje' });
            });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al procesar la solicitud' });
    }
};

module.exports = {
    sendMessageToGroup,
};
