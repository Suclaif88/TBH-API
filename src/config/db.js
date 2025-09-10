const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.MYSQL_ADDON_URI;

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
