const { getProductByIdService, updateProductService } = require('../services/productsService');
const { addProductToUserService, getUserByIdService } = require('../services/userService');

let startTime = null; // Variable global para almacenar el tiempo de inicio

// Función para establecer el tiempo de inicio
const startReactionListener = () => {
    startTime = Date.now(); // Establecer el tiempo actual en milisegundos
    console.log(`Escucha de reacciones activada desde: ${new Date(startTime).toLocaleString()}`);
};

const reactionListener = async (reaction, client) => {
    try {
        const reactionTimestamp = reaction.timestamp * 1000; // Convertir la marca de tiempo a milisegundos

        if (!startTime || reactionTimestamp < startTime) {
            return;
        }

        const groupId = '120363322174878103@g.us'; // ID del grupo de ventas
        const groupBomo = '120363322174878103@g.us'; // Grupo de la agencia

        if (reaction.id.remote === groupId && reaction.reaction === '✅') {
            const senderPhoneNumber = reaction.senderId.split('@')[0];
            const originalSenderPhoneNumber = reaction.msgId.participant.split('@')[0];
            const message = await client.getMessageById(reaction.msgId._serialized);
            let title = ''; // título del producto para enviar a WhatsApp
            let id = ''; // id del producto para hacer la petición del producto
            let fecha = ''; // fecha en la que se compró el producto
            let hora = ''; // hora en la que se compró el producto

            if (message) {
                const timestampInMilliseconds = message.timestamp * 1000; // Convertir a milisegundos
                const messageDate = new Date(timestampInMilliseconds);

                const formatter = new Intl.DateTimeFormat('es-CO', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    timeZone: 'America/Bogota' // Configurar explícitamente la zona horaria
                });

                const formattedDate = formatter.format(messageDate);
                [fecha, hora] = formattedDate.split(', '); // Separar fecha y hora
            }

            if (message.hasQuotedMsg) {
                const quotedMessage = await message.getQuotedMessage();
                const parts = quotedMessage.body.split('\n');
                title = parts[0];
                id = parts[4];
            } else {
                console.log('El mensaje no es una respuesta a otro mensaje.');
            }

            const confirmationMessage = `✨ ¡Compra confirmada! ✨\n\n${title}\n\n📦 ¡Gracias por tu compra! 🙌\nℹ️ Para más información, contáctanos. 📱\n*BOMO SHOPING*\n👉 3124131990 👈`;
            const confirmationVenta = `🛒 *Venta de producto*\n\n${title}\n\n📱 *Cliente:* ${originalSenderPhoneNumber}\n🔑 *Confirmado por*: ${senderPhoneNumber}`;

            if (id) {
                const product = await getProductByIdService(id); // Ahora se usa después de asignar id

                const newProductAddUser = {
                    urlProduct: product.urlImg,
                    productId: product._id,
                    productName: product.name,
                    price: product.price,
                    purchaseDate: fecha,
                    purchaseTime: hora
                };
                const user = await getUserByIdService(senderPhoneNumber)
                const role = user.role
                
                if (senderPhoneNumber && role == 'trabajador' || role == 'administrador') {
                    await addProductToUserService(originalSenderPhoneNumber, newProductAddUser);

                    await client.sendMessage(originalSenderPhoneNumber + '@c.us', confirmationMessage);
                    await client.sendMessage(groupBomo, confirmationVenta);

                    if (product.countInStock > 0) {
                        product.countInStock -= 1;
                        await updateProductService(id, product);
                    } else {
                        console.error('No hay stock disponible');
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error al manejar la reacción:', error);
    }
};

module.exports = { reactionListener, startReactionListener };
