const { MessageMedia } = require('whatsapp-web.js');

const sendMessageToGroup = async (client, groupId, message, imageUrl) => {
    try {
        const chat = await client.getChatById(groupId);
        if (imageUrl) {
            const media = await MessageMedia.fromUrl(imageUrl);
            await chat.sendMessage(media, { caption: message });
        } else {
            await chat.sendMessage(message);
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error;
    }
};

module.exports = {sendMessageToGroup}