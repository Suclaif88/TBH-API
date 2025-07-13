const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('./db');

const migrator = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

module.exports = { migrator };
