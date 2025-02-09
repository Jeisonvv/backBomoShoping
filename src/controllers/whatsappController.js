const Product = require('../models/product');
const { sendMessageServiceWhatsapp, getClientStatus, forwardTheMessageServiceWatsapp, buyOnThePageServiceWhatsapp } = require('../services/whatsappService');

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
        await sendMessageServiceWhatsapp(lastProduct);

        res.status(200).json({ success: true, message: 'Producto guardado y mensaje enviado correctamente.' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al procesar la solicitud.' });
    }
};


const getQrCodeController = (req, res) => {
    const status = getClientStatus();
    if (!status.authenticated && status.qrCode) {
        res.status(200).json({ qrCode: status.qrCode });
    } else if (status.authenticated) {
        res.status(200).json({ message: 'Cliente autenticado y listo.' });
    } else {
        res.status(500).json({ error: 'No se pudo obtener el QR en este momento.' });
    }
};
const forwardTheMessageController = async (req, res) => {
    const { id } = req.params;
  
    try {
      await forwardTheMessageServiceWatsapp(id); // No necesitas capturar el retorno si solo realiza acciones
      res.status(200).json({ message: 'Mensaje reenviado con éxito' });
    } catch (error) {
      console.error('Error en forwardTheMessageController:', error);
      res.status(500).json({ error: 'Ocurrió un error al reenviar el mensaje' });
    }
  };
// controlador del mensaje para la venta desde la pagina 
const buyOnThePageControllerWhatsapp  = async (req, res) =>{
    try {
        const { numPhone } = req.params; // Obtener el número de teléfono desde los parámetros de la URL
        const productData = req.body; // Obtener los datos del producto desde el cuerpo de la solicitud

        // Llamar al servicio para agregar el producto al usuario
        const result = await buyOnThePageServiceWhatsapp(numPhone, productData);

        // Responder con el mensaje de éxito
        res.status(200).json({message:'producto vendido desde la pagina'});
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
  

module.exports = {
    sendMessageController,
    getQrCodeController,
    forwardTheMessageController,
    buyOnThePageControllerWhatsapp
};
