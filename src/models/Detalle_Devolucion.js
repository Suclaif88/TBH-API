const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Detalle_Devolucion', {
    Id_Detalle_Devolucion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Devoluciones: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Devoluciones',
        key: 'Id_Devoluciones'
      }
    },
    Id_Detalle_Venta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Detalle_Venta',
        key: 'Id_Detalle_Venta'
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
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    Motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Detalle_Devolucion',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Devolucion" },
        ]
      },
      {
        name: "Id_Devoluciones",
        using: "BTREE",
        fields: [
          { name: "Id_Devoluciones" },
        ]
      },
      {
        name: "Id_Detalle_Venta",
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Venta" },
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
    ]
  });
};
