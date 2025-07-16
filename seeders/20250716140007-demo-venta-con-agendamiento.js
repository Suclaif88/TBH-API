'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Inserta agendamiento con subtotal
    await queryInterface.bulkInsert('Agendamientos', [
      {
        Id_Agendamientos: 1000,
        Id_Cliente: 1,    
        Id_Empleados: 1,    
        Fecha: '2025-07-16',
        Subtotal: 50000,
        Estado: 1
      }
    ], {});

    // 2. Inserta venta vinculada al agendamiento
    await queryInterface.bulkInsert('Ventas', [
      {
        Id_Ventas: 2000,
        Id_Agendamientos: 1000,
        Id_Cliente: 1,
        Id_Empleados: 1,
        Fecha: '2025-07-16',
        Total: 100000,      
        Estado: 1,
        M_Pago: 'Efectivo',
        Referencia: null
      }
    ], {});

    // 3. Inserta detalle
    await queryInterface.bulkInsert('Detalle_Venta', [
      {
        Id_Detalle_Venta: 3000,
        Id_Ventas: 2000,
        Id_Productos: 1,             
        Id_Producto_Tallas: 1,           
        Id_Producto_Tamano_Insumos: 1,  
        Cantidad: 2,
        Precio: 25000,
        Subtotal: 50000
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Borrado ordenado por dependencias
    await queryInterface.bulkDelete('Detalle_Venta', {
      Id_Detalle_Venta: 3000
    }, {});

    await queryInterface.bulkDelete('Ventas', {
      Id_Ventas: 2000
    }, {});

    await queryInterface.bulkDelete('Agendamientos', {
      Id_Agendamientos: 1000
    }, {});
  }
};
