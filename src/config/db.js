const { Sequelize } = require("sequelize");
require("dotenv").config();

// Intentar diferentes nombres de variables de entorno para compatibilidad
const databaseUrl = process.env.MYSQL_ADDON_URI || 
                   process.env.DATABASE_URL || 
                   process.env.MYSQL_URL ||
                   process.env.CLEVER_DATABASE_URL;

// Validar que la URL de la base de datos esté definida
if (!databaseUrl) {
  console.error("Error: No se encontró la variable de entorno para la base de datos.");
  console.error("Buscando variables relacionadas con base de datos...");
  
  const dbRelatedVars = Object.keys(process.env).filter(key => 
    key.includes('DATABASE') || key.includes('MYSQL') || key.includes('DB') || key.includes('CLEVER')
  );
  
  if (dbRelatedVars.length > 0) {
    console.error("Variables encontradas:", dbRelatedVars);
    dbRelatedVars.forEach(key => {
      console.error(`   ${key}: ${process.env[key] ? 'definida' : 'undefined'}`);
    });
  } else {
    console.error("No se encontraron variables relacionadas con base de datos");
  }
  
  console.error("Todas las variables de entorno disponibles:");
  console.error(Object.keys(process.env).sort());
  
  throw new Error("Variable de entorno de base de datos no encontrada");
}

console.log("Conectando a la base de datos con:", databaseUrl.replace(/\/\/.*@/, '//***:***@'));

const sequelize = new Sequelize(databaseUrl, {
  dialect: "mysql",
  logging: false,
});

const conectarBD = async () => {
  const ora = require("ora");
  const spinner = ora("Conectando a la base de datos...").start();

  try {
    await sequelize.authenticate();
    setTimeout(() => {
      spinner.succeed("Conexión exitosa a la base de datos");
    }, 2000);
    return true;
  } catch (err) {
    setTimeout(() => {
      spinner.fail("Error de conexión de base de datos");
    }, 1500);
    console.error(err);
    return false;
  }
};

module.exports = { sequelize, conectarBD };
