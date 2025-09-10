require("dotenv").config();
const { conectarBD } = require("./src/config/db");
const express = require("express");
const { limiter } = require('./src/middleware/rateLimiters');
const cors = require("cors");
const routes = require("./src/routes");
const favicon = require("serve-favicon");
const path = require("path");
const ora = require("ora");
const cookieParser = require('cookie-parser');
const { migrator } = require('./src/config/migrator');

const app = express();
const AUTOR = process.env.AUTOR || "SRD";
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || "http://localhost";
const APP_NAME = process.env.APP_NAME || "API THE BARBER HOUSE";
const APP_VERSION = process.env.APP_VERSION || "1.0.0";

const spinner = ora("Iniciando TBH API...").start();

const iniciarServidor = async () => {
  const conexionExitosa = await conectarBD();
  if (conexionExitosa) {
    await migrator.up();
    setTimeout(() => {
      spinner.succeed("TBH-API Iniciada correctamente");
      const spinnerUrl = ora("Preparando todo...").start();
      setTimeout(() => {
        spinnerUrl.succeed(`Servidor corriendo en ${APP_URL}:${PORT}`);
      }, 5000);
    }, 5500);

    app.set('trust proxy', 1);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://192.168.0.198:5173',
      'https://tbh-frontend.vercel.app',
      'https://tbh-frontend-git-main.vercel.app',
      'https://tbh-frontend-git-develop.vercel.app'
    ];

    app.use(cors({
      origin: function(origin, callback) {
        // Permitir requests sin origin (mobile apps, postman, etc.)
        if (!origin) return callback(null, true);

        // Permitir orígenes específicos
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Permitir subdominios de vercel
        if (origin.endsWith('.vercel.app')) {
          return callback(null, true);
        }

        // Permitir localhost en cualquier puerto para desarrollo
        if (origin.startsWith('http://localhost:')) {
          return callback(null, true);
        }

        // En producción, ser más permisivo con dominios HTTPS
        if (process.env.NODE_ENV === 'production' && origin.startsWith('https://')) {
          console.log(`Permitiendo origen en producción: ${origin}`);
          return callback(null, true);
        }

        const msg = `El CORS policy no permite el acceso desde el origen: ${origin}`;
        console.warn(msg);
        return callback(new Error(msg), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie']
    }));

    app.use(limiter);
    app.use(express.json());
    app.use(cookieParser());
    app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

    app.get("/", (req, res) => {
      res.json({
        nombre: APP_NAME,
        version: APP_VERSION,
        autor: AUTOR,
        fecha: new Date().toISOString(),
      });
    });

    // Endpoint de salud
    app.get("/health", (req, res) => {
      res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        version: APP_VERSION,
        author: AUTOR,
        jwt_secret_configured: !!process.env.JWT_SECRET,
        database_connected: true
      });
    });

    app.use("/api", routes);

    app.listen(PORT);
  } else {
    spinner.fail("Error al conectar con la base de datos. El servidor no se iniciará :(");
  }
};

iniciarServidor();

// ESTE ARCHIVO NO SE TOCA

// TOQUEME ESTA ROLDAN ;)