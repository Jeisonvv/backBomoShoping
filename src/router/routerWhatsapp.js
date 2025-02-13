const { Router } = require("express");
const routerWhatsapp = Router();

const {
  sendMessageController,
  getQrCodeController,
  forwardTheMessageController,
  buyOnThePageControllerWhatsapp,
  sendSaleReportControlle
} = require("../controllers/whatsappController"); //controlador que envia el mensaje al grupo

routerWhatsapp.post("/send", sendMessageController); //ruta para enviar mensaje al grupo

routerWhatsapp.post("/forward-product/:id", forwardTheMessageController); //ruta para reenviar un producto existente

routerWhatsapp.post("/add-product/:numPhone", buyOnThePageControllerWhatsapp); //ruta para reenviar un producto existente

routerWhatsapp.post("/send-sale-report", sendSaleReportControlle )

routerWhatsapp.get("/qr", getQrCodeController); //ruta para enviar el qr

module.exports = { routerWhatsapp }; //exportamos el router
