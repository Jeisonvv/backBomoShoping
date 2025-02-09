const { Client, LocalAuth} = require('whatsapp-web.js');
const { reactionListener, startReactionListener } = require('../utils/reactionListener');
const {sendMessageToGroup} = require('../utils/sendMessage')
const { getProductByIdService, updateProductService} = require('./productsService')
const {addProductToUserService} = require('./userService')

const groupBomo = '120363322174878103@g.us';
const workigGroup = '120363322174878103@g.us';


let qrCode = null;
let isClientReady = false;

const client = new Client({
    puppeteer: { headless: true },
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    console.log('Código QR generado.');
    qrCode = qr;
});

client.on('ready', () => {
    console.log('Cliente de WhatsApp listo.');
    isClientReady = true;
    qrCode = null;
    
    startReactionListener()
     
});

client.on('authenticated', () => {
    console.log('Cliente autenticado.');
    qrCode = null;
});

client.on('message_reaction', async (reaction) => {
    
    reactionListener(reaction, client);
});

client.initialize();

const getClientStatus = () => {
    if (qrCode) {
        return { authenticated: false, qrCode };
    }
    return { authenticated: isClientReady };
};



const sendMessageServiceWhatsapp = async (product) => {
    
    
    try {
        const status = await getClientStatus();

        if (!status.authenticated) {
            console.error('Cliente no autenticado.');
            throw new Error('Cliente no autenticado. Escanea el código QR para continuar.');
        }

        // Crear el mensaje
        const fixedMessage =
            `📦 ${product.name}\n` +
            `${product.description}\n` +
            `💲Prescio $${product.price}\n` +
            `Und: ${product.countInStock}\n` +
            `${product._id}`;

        // Enviar el mensaje con o sin imagen
        await sendMessageToGroup( client, groupBomo, fixedMessage, product.urlImg || null);
        console.log('Mensaje enviado con éxito.');
        
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error;
    }
};
// reenviar el producto a el grupo
const forwardTheMessageServiceWatsapp = async (id) => {
    
    
    try {
      let product = await getProductByIdService(id);
  
      // Validar si el producto existe
      if (!product) {
        throw new Error('Producto no encontrado');
      }
  
      // Incrementar el stock en uno
      const newStock = product.countInStock + 1;
      
  
      // Actualizar el producto con el nuevo stock
      await updateProductService(id, { countInStock: newStock });
  
      // Obtener el producto actualizado (opcional)
      const inStockproduct = await getProductByIdService(id);
  
      const fixedMessage =
        `📦 ${inStockproduct.name}\n` +
        `${inStockproduct.description}\n` +
        `💲Precio $${inStockproduct.price}\n` +
        `Und: ${inStockproduct.countInStock}\n` +
        `${inStockproduct._id}`;
  
      await sendMessageToGroup(client, groupBomo, fixedMessage, product.urlImg || null);
  
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      throw error;
    }
  };

  const buyOnThePageServiceWhatsapp = async (numPhone, productData) => {
    try {
      console.log(productData.productId);
  
      // Busca el producto por el ID
      let product = await getProductByIdService(productData.productId);
  
      // Validar si el producto existe
      if (!product) {
        throw new Error('Producto no encontrado');
      }
  
      // Verificar si el stock es 0
      if (product.countInStock === 0) {
        throw new Error('Artículo no disponible, sin stock');
      }
  
      // Reducir el stock en uno
      const newStock = product.countInStock - 1;
  
      // Actualizar el producto con el nuevo stock
      await updateProductService(productData.productId, { countInStock: newStock });
  
      // Agrega el producto al cliente
      await addProductToUserService(numPhone, productData);
  
      // Crear el mensaje para el grupo
      const newMessage = `Producto vendido desde la página web\n${productData.productName}\nValor: ${productData.price}\nCliente: ${numPhone}`;
  
      // Enviar el mensaje
      sendMessageToGroup(client, workigGroup, newMessage, productData.urlProduct || null);
  
    } catch (error) {
      console.error(error.message);
      throw error; // Lanzar el error para que el controlador lo maneje
    }
  };
  
  


module.exports = {
    client,
    getClientStatus,
    sendMessageServiceWhatsapp,
    forwardTheMessageServiceWatsapp,
    buyOnThePageServiceWhatsapp
};
