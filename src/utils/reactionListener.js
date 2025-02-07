const { getProductByIdService, updateProductService } = require('../services/productsService');
const {addProductToUserService} = require('../services/userService')

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
            let title = ''; // titulo del producto para enviar whatsapp
            let id = ''; // id del producto para hacer la peticion del producto
            let fecha = '' // fecha en la que se compro el producto
            let hora = '' // hora en la que se compro el producto
            
            
        if (message) {
            const timestampInMilliseconds = message.timestamp * 1000; // Convertir a milisegundos
            const messageDate = new Date(timestampInMilliseconds);
            
            fecha = messageDate.toLocaleDateString();
            hora = messageDate.toLocaleTimeString();
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

            
            if(id){
                const product = await getProductByIdService(id); // Ahora se usa después de asignar id
                

                const newProductAddUser = {
                    
                      urlProduct: product.urlImg,
                      productId: product._id,
                      productName: product.name,
                      price: product.price,
                      purchaseDate: fecha,
                      purchaseTime: hora
                    
                }
                const allowedPhoneNumbers = ['573017532906', '573112345678', '573023456789']; // Lista de números permitidos
                if (senderPhoneNumber && allowedPhoneNumbers.includes(senderPhoneNumber)) { 

                    await addProductToUserService(originalSenderPhoneNumber, newProductAddUser)

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