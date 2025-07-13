'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('Insumos', null, {});
    
    await queryInterface.sequelize.query('ALTER TABLE Insumos AUTO_INCREMENT = 1');

    await queryInterface.bulkInsert('Insumos', [
      {
        Nombre: 'Alcohol Etílico',
        Stock: 1000,
        Id_Categoria_Insumos: 2,
        Estado: true
      },
      {
        Nombre: 'Frasco de vidrio 50ml',
        Stock: 500,
        Id_Categoria_Insumos: 3,
        Estado: true
      },
      {
        Nombre: 'Esencia de vainilla',
        Stock: 300,
        Id_Categoria_Insumos: 4,
        Estado: true
      },
      {
        Nombre: 'Tapa metálica negra',
        Stock: 400,
        Id_Categoria_Insumos: 3,
        Estado: true
      },
      {
        Nombre: 'Agua Destilada',
        Stock: 1200,
        Id_Categoria_Insumos: 2,
        Estado: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Insumos', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Insumos AUTO_INCREMENT = 1');
  }
};
