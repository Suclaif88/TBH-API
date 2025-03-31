const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Detalle_Venta_Cambio_Tallas', {
    Id_Detalle_Venta_Cambio_Tallas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Ventas_Cambio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Ventas_Cambio',
        key: 'Id_Ventas_Cambio'
      }
    },
    Id_Productos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Productos',
        key: 'Id_Productos'
      }
    },
    Id_Tallas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tallas',
        key: 'Id_Tallas'
      }
    },
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    Subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Detalle_Venta_Cambio_Tallas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Venta_Cambio_Tallas" },
        ]
      },
      {
        name: "Id_Ventas_Cambio",
        using: "BTREE",
        fields: [
          { name: "Id_Ventas_Cambio" },
        ]
      },
      {
        name: "Id_Productos",
        using: "BTREE",
        fields: [
          { name: "Id_Productos" },
        ]
      },
      {
        name: "Id_Tallas",
        using: "BTREE",
        fields: [
          { name: "Id_Tallas" },
        ]
      },
    ]
  });
};
