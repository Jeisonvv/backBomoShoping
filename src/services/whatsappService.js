const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { reactionListener } = require('../utils/reactionListener');

let qrCode = null;
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Variable de estado para saber si el cliente está listo
let isClientReady = false;

// Evento para capturar el QR
client.on('qr', (qr) => {
    qrCode = qr;
    
});

// Evento para cuando el cliente está listo
client.on('ready', () => {
    console.log('Cliente de WhatsApp listo.');
    isClientReady = true;
    qrCode = null;

    // Inicializar escuchador de reacciones cuando el cliente esté listo
    initializeReactionListener();
});

// Evento para autenticación exitosa
client.on('authenticated', () => {
    console.log('Cliente autenticado.');
    qrCode = null;
});

// Inicialización del cliente
client.initialize();

// Función para verificar el estado del cliente
const getClientStatus = () => {
    if (qrCode) {
        return { authenticated: false, qrCode };
    }
    return { authenticated: isClientReady };
};

// Función para enviar mensajes
const sendMessage = async (groupId, message, imageUrl) => {
    try {
        if (!isClientReady) {
            console.error('El cliente no está listo para enviar mensajes.');
            return;
        }

        const chat = await client.getChatById(groupId);
        if (imageUrl) {
            const media = await MessageMedia.fromUrl(imageUrl);
            await chat.sendMessage(media, { caption: message });
        } else {
            await chat.sendMessage(message);
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
};

// Función para escuchar reacciones solo después de que el cliente esté listo
const initializeReactionListener = () => {
    if (!isClientReady) {
        console.log('El cliente no está listo para escuchar reacciones aún.');
        return;
    }

    console.log('Inicializando el escuchador de reacciones...');
    // Registra el evento de reacción solo si el cliente está listo
    client.on('message_reaction', async (reaction) => {
        // Llama la función que captura las reacciones y envía el mensaje
        reactionListener(reaction, client);
    });
};

module.exports = {
    client,
    getClientStatus,
    sendMessage,
    initializeReactionListener,
};
