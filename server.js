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

    // Configuración de CORS más permisiva para producción
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'https://tbh-opal.vercel.app',
          'http://localhost:3000',
          'http://localhost:5173',
          'http://localhost:8080'
        ];

    // Middleware CORS personalizado más agresivo
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      
      // Log para debugging
      console.log('Request origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      
      // Permitir todos los orígenes en desarrollo, específicos en producción
      if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, Set-Cookie, X-Requested-With, Accept, Origin, X-HTTP-Method-Override');
        res.header('Access-Control-Expose-Headers', 'Set-Cookie');
        res.header('Access-Control-Max-Age', '86400'); // 24 horas
      } else {
        console.log('CORS bloqueado para origin:', origin);
      }
      
      // Manejar preflight requests
      if (req.method === 'OPTIONS') {
        console.log('OPTIONS request recibida');
        res.status(200).end();
        return;
      }
      
      next();
    });

    // Configuración adicional de CORS con la librería cors
    app.use(cors({
      origin: function (origin, callback) {
        // En desarrollo, permitir todo
        if (process.env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        
        // En producción, verificar orígenes permitidos
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        console.log('CORS bloqueado por librería cors:', origin);
        return callback(new Error('No permitido por CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Cookie', 
        'Set-Cookie', 
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-HTTP-Method-Override'
      ],
      exposedHeaders: ['Set-Cookie'],
      optionsSuccessStatus: 200
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
        database_connected: true,
        cors_origin: req.headers.origin,
        allowed_origins: allowedOrigins
      });
    });

    // Endpoint para probar CORS
    app.get("/cors-test", (req, res) => {
      res.status(200).json({
        message: "CORS funcionando correctamente",
        origin: req.headers.origin,
        timestamp: new Date().toISOString(),
        allowed_origins: allowedOrigins,
        node_env: process.env.NODE_ENV,
        headers: {
          origin: req.headers.origin,
          'user-agent': req.headers['user-agent'],
          'access-control-request-method': req.headers['access-control-request-method'],
          'access-control-request-headers': req.headers['access-control-request-headers']
        }
      });
    });

    // Endpoint OPTIONS específico para CORS
    app.options("*", (req, res) => {
      console.log('OPTIONS request para:', req.path);
      console.log('Origin:', req.headers.origin);
      res.status(200).end();
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