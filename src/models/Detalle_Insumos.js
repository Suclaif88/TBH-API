const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Detalle_Insumos', {
    Id_Detalle_Insumos: {
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
    Id_Insumos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Insumos',
        key: 'Id_Insumos'
      }
    },
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Detalle_Insumos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Insumos" },
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
        name: "Id_Insumos",
        using: "BTREE",
        fields: [
          { name: "Id_Insumos" },
        ]
      },
    ]
  });
};
