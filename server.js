require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");

const app = express();
const AUTOR = process.env.AUTOR || "SRD";
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || 'http://localhost';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    nombre: 'API de THE BARBER HOUSE',
    version: '1.0.0',
    autor: AUTOR,
    fecha: new Date().toISOString()
  });
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${APP_URL}:${PORT}`);
});

//ESTE ARCHIVO NO SE TOCA