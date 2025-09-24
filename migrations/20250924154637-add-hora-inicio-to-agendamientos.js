'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Agendamientos', 'Hora_Inicio', {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: '09:00:00'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Agendamientos', 'Hora_Inicio');
  }
};
