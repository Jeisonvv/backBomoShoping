const { getProductByIdService, updateProductService } = require('../services/productsService');

let startTime = null; // Variable global para almacenar el tiempo de inicio

const reactionListener = async (reaction, client) => {
    try {
        // Verifica si la reacción es posterior al tiempo de inicio
        const reactionTimestamp = reaction.timestamp * 1000; // Convertir la marca de tiempo de segundos a milisegundos
        
        if (startTime && reactionTimestamp < startTime) {
            console.log('Reacción antigua ignorada.');
            return;  // Si la reacción es anterior al tiempo de inicio, se ignora
        }

        const groupId = '120363322174878103@g.us'; // ID del grupo de ventas
        const groupBomo = '120363322174878103@g.us'; // Grupo de la agencia

        // Verifica si la reacción es del grupo correcto y si es la reacción ✅
        if (reaction.id.remote === groupId && reaction.reaction === '✅') {
            // Obtener el número del participante que reaccionó
            const senderPhoneNumber = reaction.senderId.split('@')[0];

            // Obtener el número del participante que escribió el mensaje original (el que recibió la reacción)
            const originalSenderPhoneNumber = reaction.msgId.participant.split('@')[0];

            // Verificar si el mensaje es una respuesta a otro mensaje
            const message = await client.getMessageById(reaction.msgId._serialized);

            // Inicializar las variables fuera del bloque condicional
            let title = '';
            let id = '';

            if (message.hasQuotedMsg) {
                // Obtener el mensaje citado
                const quotedMessage = await message.getQuotedMessage();
                const parts = quotedMessage.body.split('\n'); // Crear un array con las partes del mensaje que tienen un salto de línea 
                title = parts[0];
                id = parts[4];
            } else {
                console.log('El mensaje no es una respuesta a otro mensaje.');
            }

            // Enviar mensaje al participante que escribió el mensaje original
            const confirmationMessage = `✨ ¡Compra confirmada! ✨\n\n${title}\n\n📦 ¡Gracias por tu compra! 🙌\nℹ️ Para más información, contáctanos. 📱\n*BOMO SHOPING*\n👉 3124131990 👈`;
            // Mensaje para el grupo
            const confirmationVenta = `🛒 *Venta de producto*\n\n${title}\n\n📱 *Cliente:* ${originalSenderPhoneNumber}\n🔑 *Confirmado por*: ${senderPhoneNumber}`;

            if (originalSenderPhoneNumber) {
                await client.sendMessage(originalSenderPhoneNumber + '@c.us', confirmationMessage); // Enviar mensaje al participante que escribió el mensaje original
            }

            // Enviar el mensaje al grupo
            if (groupId) {
                await client.sendMessage(groupBomo, confirmationVenta); // Enviar mensaje al grupo de la agencia
            }
            
            // Descontar el stock del producto
            const product = await getProductByIdService(id);
            
            if (product.countInStock > 0) {
                product.countInStock -= 1;
                await updateProductService(id, product);
            } else {
                console.error('No hay stock disponible');
            }
        }
    } catch (error) {
        console.error('Error al manejar la reacción:', error);
    }
};

    module.exports = {reactionListener}; // Exportar la función