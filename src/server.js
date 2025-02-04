const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const appMogoShoping = express();
const { router } = require("./router/index");

appMogoShoping.get("/", (req, res) => {
  res.send("¡Servidor backend funcionando en Vercel!");
});

appMogoShoping.use(morgan('dev'));
appMogoShoping.use(cors());
appMogoShoping.use(express.json());
appMogoShoping.use(router);

module.exports = appMogoShoping; // Exportas el módulo appMogoShoping
