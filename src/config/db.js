const { Sequelize } = require("sequelize");
require("dotenv").config();
const ora = require("ora");

const spinner = ora("Conectando a la base de datos...").start();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

const conectarBD = async () => {
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
