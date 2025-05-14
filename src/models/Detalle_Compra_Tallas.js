const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Detalle_Compra_Tallas', {
    Id_Detalle_Compra_Tallas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Compras: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Compras',
        key: 'Id_Compras'
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
    }
  }, {
    sequelize,
    tableName: 'Detalle_Compra_Tallas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Compra_Tallas" },
        ]
      },
      {
        name: "Id_Compras",
        using: "BTREE",
        fields: [
          { name: "Id_Compras" },
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
