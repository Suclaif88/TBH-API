const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Detalle_Productos', {
    Id_Detalle_Productos: {
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
    tableName: 'Detalle_Productos',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Productos" },
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
    ]
  });
};
