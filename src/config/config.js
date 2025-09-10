require('dotenv').config();
module.exports = {
  development: {
    url: process.env.MYSQL_ADDON_URI,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    url: process.env.MYSQL_ADDON_URI,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    url: process.env.MYSQL_ADDON_URI,
    dialect: 'mysql',
    logging: false,
  },
};
