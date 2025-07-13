'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('Categoria_Insumos', null, {});

    await queryInterface.sequelize.query('ALTER TABLE Categoria_Insumos AUTO_INCREMENT = 1');

    await queryInterface.bulkInsert('Categoria_Insumos', [
      {
        Nombre: 'Una categoria',
        Descripcion: 'La categoria es una categoria',
        Estado: true
      },
      {
        Nombre: 'Base',
        Descripcion: 'Bases para perfumes, NO BORRAR',
        Estado: true
      },
      {
        Nombre: 'Frasco',
        Descripcion: 'Los Envases de los Perfumes, NO BORRAR',
        Estado: true
      },
      {
        Nombre: 'Fragancia',
        Descripcion: 'Los Olores de los Perfumes, NO BORRAR',
        Estado: false
      },
      {
        Nombre: 'Categoría Extra',
        Descripcion: 'Otra categoría más',
        Estado: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categoria_Insumos', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Categoria_Insumos AUTO_INCREMENT = 1');
  }
};
