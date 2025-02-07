const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { reactionListener, startReactionListener } = require('../utils/reactionListener');
const {sendMessageToGroup} = require('../utils/sendMessage')


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

const sendMessage = async (product) => {
    const groupId = '120363322174878103@g.us';
    
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
        await sendMessageToGroup( client, groupId, fixedMessage, product.urlImg || null);
        console.log('Mensaje enviado con éxito.');
        
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error;
    }
};


module.exports = {
    client,
    getClientStatus,
    sendMessage,
};
