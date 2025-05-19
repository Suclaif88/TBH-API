const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Compras', {
    Id_Compras: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Proveedores: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Proveedores',
        key: 'Id_Proveedores'
      }
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    Total: {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0.0,
      allowNull: false
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Compras',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Compras" },
        ]
      },
      {
        name: "Id_Proveedores",
        using: "BTREE",
        fields: [
          { name: "Id_Proveedores" },
        ]
      },
    ]
  });
};
