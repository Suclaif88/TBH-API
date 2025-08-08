// reset-db.js
const { sequelize } = require('./src/config/db'); // tu conexión
require('./src/models'); // esto carga index.js y define relaciones

(async () => {
  try {
    console.log('🚨 Esto borrará y recreará TODAS las tablas de la base de datos.');

    await sequelize.authenticate();
    console.log('✅ Conexión establecida con la base de datos.');

    await sequelize.sync({ force: true }); // borra y crea
    console.log('✅ Base de datos sincronizada (modelos y relaciones reflejados).');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error al resetear la base de datos:', err);
    process.exit(1);
  }
})();
