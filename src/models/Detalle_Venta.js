const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Detalle_Venta', {
    Id_Detalle_Venta: {
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
    Id_Producto_Tallas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Producto_Tallas',
        key: 'Id_Producto_Tallas'
      }
    },
    Id_Producto_Tamano_Insumos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Producto_Tamano_Insumos',
        key: 'Id_Producto_Tamano_Insumos'
      }
    },
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Detalle_Venta',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Venta" },
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
      {
        name: "Id_Producto_Tallas",
        using: "BTREE",
        fields: [
          { name: "Id_Producto_Tallas" },
        ]
      },
      {
        name: "Id_Producto_Tamano_Insumos",
        using: "BTREE",
        fields: [
          { name: "Id_Producto_Tamano_Insumos" },
        ]
      },
    ]
  });
};
