const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Detalle_Venta_Productos', {
    Id_Detalle_Venta_Productos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Ventas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Ventas',
        key: 'Id_Ventas'
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
    tableName: 'Detalle_Venta_Productos',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Venta_Productos" },
        ]
      },
      {
        name: "Id_Ventas",
        using: "BTREE",
        fields: [
          { name: "Id_Ventas" },
        ]
      },
      {
        name: "Id_Productos",
        using: "BTREE",
        fields: [
          { name: "Id_Productos" },
        ]
      },
    ]
  });
};
