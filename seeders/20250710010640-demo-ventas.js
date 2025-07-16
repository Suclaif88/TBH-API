'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Ventas', [
      {
        Id_Ventas: 2001,
        Id_Agendamientos: null,
        Id_Cliente: 2,        
        Id_Empleados: 2,       
        Fecha: '2025-07-16',
        Total: 75000,
        Estado: 1,
        M_Pago: 'Nequi',
        Referencia: 'SINAGD-001'
      }
    ], {});

    await queryInterface.bulkInsert('Detalle_Venta', [
      {
        Id_Detalle_Venta: 3001,
        Id_Ventas: 2001,
        Id_Productos: 2,
        Id_Producto_Tallas: 2,
        Id_Producto_Tamano_Insumos: 2,
        Cantidad: 3,
        Precio: 25000,
        Subtotal: 75000
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Detalle_Venta', {
      Id_Detalle_Venta: 3001
    }, {});

    await queryInterface.bulkDelete('Ventas', {
      Id_Ventas: 2001
    }, {});
  }
};
