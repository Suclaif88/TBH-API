const { Sequelize } = require("sequelize");
require("dotenv").config();
const ora = require("ora");

const spinner = ora("Conectando a la base de datos...").start();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  spinner.fail("DATABASE_URL no está definido en las variables de entorno");
  process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "mysql",
  logging: false,
});

const conectarBD = async () => {
  try {
    await sequelize.authenticate();
    spinner.succeed("Conexión exitosa a la base de datos");
    return true;
  } catch (err) {
    spinner.fail("Error de conexión de base de datos");
    console.error("Error de conexión Sequelize:", err.message || err);
    return false;
  }
};

module.exports = { sequelize, conectarBD };
