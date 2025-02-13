const { MessageMedia } = require("whatsapp-web.js");

const sendMessageToGroup = async (client, groupId, message, imageUrl) => {
  try {
    if (!client || !client.info || !client.info.wid) {
      throw new Error("El cliente de WhatsApp no está listo.");
    }

    const chat = await client.getChatById(groupId);
    if (!chat) {
      throw new Error("No se pudo obtener el chat del grupo.");
    }

    if (imageUrl) {
      const media = await MessageMedia.fromUrl(imageUrl);
      await chat.sendMessage(media, { caption: message });
    } else {
      await chat.sendMessage(message);
    }
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw error;
  }
};

module.exports = { sendMessageToGroup };
