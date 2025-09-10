require('dotenv').config();

// Función para obtener la URL de la base de datos con fallbacks
const getDatabaseUrl = () => {
  return process.env.MYSQL_ADDON_URI || 
         process.env.DATABASE_URL || 
         process.env.MYSQL_URL ||
         process.env.CLEVER_DATABASE_URL;
};

module.exports = {
  development: {
    url: getDatabaseUrl(),
    dialect: 'mysql',
    logging: false,
  },
  test: {
    url: getDatabaseUrl(),
    dialect: 'mysql',
    logging: false,
  },
  production: {
    url: getDatabaseUrl(),
    dialect: 'mysql',
    logging: false,
  },
};
