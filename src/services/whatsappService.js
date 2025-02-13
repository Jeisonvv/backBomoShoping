const { Client, LocalAuth } = require("whatsapp-web.js");
// funcion de las recionnes
const {
  reactionListener,
  startReactionListener,
} = require("../utils/reactionListener");
const { sendMessageToGroup } = require("../utils/sendMessage"); // funcion para enviar mensaje
// servicion de producto
const {
  getProductByIdService,
  updateProductService,
} = require("./productsService");
// servicio de user
const { addProductToUserService, getUserService } = require("./userService");
const groupBomo = "120363322174878103@g.us"; // gropu de la agencia

const workigGroup = "120363322174878103@g.us"; // de trabajo

let qrCode = null; // variable para el QR

let isClientReady = false; // variable para saber si el cliente esta listo

// creacion del cliente
const client = new Client({
  puppeteer: { headless: true },
  authStrategy: new LocalAuth(),
});

// creacion del qr
client.on("qr", (qr) => {
  console.log("Código QR generado.");
  qrCode = qr;
});

// verificacion que el cliente esta listo
client.on("ready", () => {
  console.log("Cliente de WhatsApp listo.");
  isClientReady = true;
  qrCode = null;

  startReactionListener();
});
// verificacion del cliente autenticado
client.on("authenticated", () => {
  console.log("Cliente autenticado.");
  qrCode = null;
});
// escucha de reaciones para en pesar a trabajar
client.on("message_reaction", async (reaction) => {
  reactionListener(reaction, client);
});
// inicializa el cliente
client.initialize();
// verificacion del estado del cliente
const getClientStatus = () => {
  if (qrCode) {
    return { authenticated: false, qrCode };
  }
  return { authenticated: isClientReady };
};

// servicio para enviar el mensaje al grupo de ventas
const sendMessageServiceWhatsapp = async (product) => {
  try {
    const status = await getClientStatus();

    if (!status.authenticated) {
      console.error("Cliente no autenticado.");
      throw new Error(
        "Cliente no autenticado. Escanea el código QR para continuar."
      );
    }

    // Crear el mensaje
    const fixedMessage =
      `📦 ${product.name}\n` +
      `${product.description}\n` +
      `💲Prescio $${product.price}\n` +
      `Und: ${product.countInStock}\n` +
      `${product._id}`;

    // Enviar el mensaje con o sin imagen
    await sendMessageToGroup(
      client,
      groupBomo,
      fixedMessage,
      product.urlImg || null
    );
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw error;
  }
};

// ruta ta para renviar el producto desde la pagina web
const forwardTheMessageServiceWatsapp = async (id) => {
  try {
    let product = await getProductByIdService(id);

    // Validar si el producto existe
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (product.countInStock > 0) {
      // Si el stock es mayor a 0, enviar el mensaje sin aumentar el stock
      const message =
        `📦 ${product.name}\n` +
        `${product.description}\n` +
        `💲Precio $${product.price}\n` +
        `Und: ${product.countInStock}\n` +
        `${product._id}`;
      await sendMessageToGroup(
        client,
        groupBomo,
        message,
        product.urlImg || null
      );
    } else {
      // Incrementar el stock en uno si es 0
      const newStock = product.countInStock + 1;

      // Actualizar el producto con el nuevo stock
      await updateProductService(id, { countInStock: newStock });

      // Obtener el producto actualizado
      inStockproduct = await getProductByIdService(id);

      const fixedMessage =
        `📦 ${inStockproduct.name}\n` +
        `${inStockproduct.description}\n` +
        `💲Precio $${inStockproduct.price}\n` +
        `Und: ${inStockproduct.countInStock}\n` +
        `${inStockproduct._id}`;

      await sendMessageToGroup(
        client,
        groupBomo,
        fixedMessage,
        product.urlImg || null
      );
    }
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw error;
  }
};

// notificacion de venta de la venta la pagina de whatsapp
const buyOnThePageServiceWhatsapp = async (numPhone, productData) => {
  try {
    // Busca el producto por el ID
    let product = await getProductByIdService(productData.productId);

    // Validar si el producto existe
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // Verificar si el stock es 0
    if (product.countInStock === 0) {
      throw new Error("Artículo no disponible, sin stock");
    }

    // Reducir el stock en uno
    const newStock = product.countInStock - 1;

    // Actualizar el producto con el nuevo stock
    await updateProductService(productData.productId, {
      countInStock: newStock,
    });

    // Agrega el producto al cliente
    await addProductToUserService(numPhone, productData);

    // Crear el mensaje para el grupo
    const newMessage = `Producto vendido desde la página web\n${productData.productName}\nValor: ${productData.price}\nCliente: ${numPhone}`;

    // Enviar el mensaje
    sendMessageToGroup(
      client,
      workigGroup,
      newMessage,
      productData.urlProduct || null
    );
  } catch (error) {
    console.error(error.message);
    throw error; // Lanzar el error para que el controlador lo maneje
  }
};

// servivio de reporte de las ventas no pago
const saleReportWatsappService = async () => {
  try {
    const dataUsers = await getUserService();

    if (!Array.isArray(dataUsers)) {
      throw new Error("El servicio de usuarios no devolvió un array.");
    }

    let index = 0;

    // Función para enviar mensajes
    const sendMessage = () => {
      if (index >= dataUsers.length) {
        clearInterval(sendMessageInterval); // Limpia el intervalo cuando se envían todos los mensajes
        return;
      }

      const user = dataUsers[index];
      const unpaidPurchases = user.purchases.filter(purchase => !purchase.paid);

      if (unpaidPurchases.length > 0) {
        const totalUnpaid = unpaidPurchases.reduce((total, purchase) => total + purchase.price, 0);
        let message = `*USUARIO:* ${user.name.split(' ')[0]},\n*TELEFONO:* ${user.numPhone}\n*DIRECCION:* ${user.address || 'Sin direccion'}\n*BARRIO:* ${user.neighborhood || 'Sin barrio'}\n*TOTAL:* ${totalUnpaid}\n\n`;

        unpaidPurchases.forEach((purchase) => {
          message += `\nProducto: ${purchase.productName}\n`;
          message += `Precio: ${purchase.price}\n`;
        });
        sendMessageToGroup(client, workigGroup, message, null);
      }

      index++; // Incrementa el índice para el próximo usuario
    };

    // Enviar el primer mensaje inmediatamente
    sendMessage();

    // Establecer el intervalo para enviar mensajes cada 30 segundos
    const sendMessageInterval = setInterval(sendMessage, 30000); // Intervalo de 30 segundos
  } catch (error) {
    console.error(`Error en saleReportWatsappService: ${error.message}`);
    throw new Error(`Error al generar el reporte de ventas: ${error.message}`);
  }
};

module.exports = {
  client,
  getClientStatus,
  sendMessageServiceWhatsapp,
  forwardTheMessageServiceWatsapp,
  buyOnThePageServiceWhatsapp,
  saleReportWatsappService
};
