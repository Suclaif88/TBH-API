const { conectarBD } = require("./src/config/db");
require("dotenv").config();
const express = require("express");
const { limiter } = require('./src/middleware/rateLimiters');
const cors = require("cors");
const routes = require("./src/routes");
const favicon = require("serve-favicon");
const path = require("path");

const app = express();
const AUTOR = process.env.AUTOR || "SRD";
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || "http://localhost";
const APP_NAME = process.env.APP_NAME || "API THE BARBER HOUSE";
const APP_VERSION = process.env.APP_VERSION || "1.0.0";

const iniciarServidor = async () => {
  const conexionExitosa = await conectarBD();
  if (conexionExitosa) {
    app.use(cors());
    app.use(limiter);
    app.use(express.json());
    app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

    app.get("/", (req, res) => {
      res.json({
        nombre: APP_NAME,
        version: APP_VERSION,
        autor: AUTOR,
        fecha: new Date().toISOString(),
      });
    });

    app.use("/api", routes);

    app.listen(PORT, () => {
      console.log(`TBH-API Iniciada correctamente para produccion`);
    });
  } else {
    console.error("Error al conectar con la base de datos. El servidor no se iniciará :(");
  }
};

iniciarServidor();
