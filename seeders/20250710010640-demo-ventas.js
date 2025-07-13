'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Detalle_Venta', null, {});
    await queryInterface.bulkDelete('Ventas', null, {});

    await queryInterface.sequelize.query('ALTER TABLE Detalle_Venta AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('ALTER TABLE Ventas AUTO_INCREMENT = 1');

    await queryInterface.bulkInsert('Ventas', [
      {
        Id_Agendamientos: null, 
        Id_Cliente: 1,
        Id_Empleados: 1,
        Id_Servicios: 1,           
        Fecha: '2025-07-10',
        Total: 120000.00,
        Estado: 1,
        M_Pago: 'Efectivo'
      }
    ], {});

    await queryInterface.bulkInsert('Detalle_Venta', [
      {
        Id_Ventas: 1,
        Id_Productos: 1,
        Id_Producto_Tallas: null,
        Id_Producto_Tamano_Insumos: null,
        Cantidad: 1,
        Precio: 60000.00,
        Subtotal: 60000.00
      },
      {
        Id_Ventas: 1,
        Id_Productos: null,
        Id_Producto_Tallas: null,
        Id_Producto_Tamano_Insumos: 1,
        Cantidad: 1,
        Precio: 30000.00,
        Subtotal: 30000.00
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Detalle_Venta', null, {});
    await queryInterface.bulkDelete('Ventas', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Detalle_Venta AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('ALTER TABLE Ventas AUTO_INCREMENT = 1');
  }
};
