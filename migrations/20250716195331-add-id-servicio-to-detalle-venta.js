'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('Detalle_Venta', 'Id_Servicios', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint('Detalle_Venta', {
      fields: ['Id_Servicios'],
      type: 'foreign key',
      name: 'fk_detalleventa_servicio',
      references: {
        table: 'Servicios',
        field: 'Id_Servicios',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('Detalle_Venta', 'fk_detalleventa_servicio');
    await queryInterface.removeColumn('Detalle_Venta', 'Id_Servicios');
  }
};
