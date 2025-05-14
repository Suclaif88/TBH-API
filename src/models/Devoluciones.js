const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Devoluciones', {
    Id_Devoluciones: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Clientes',
        key: 'Id_Cliente'
      }
    },
    Total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Devoluciones',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Devoluciones" },
        ]
      },
      {
        name: "Id_Cliente",
        using: "BTREE",
        fields: [
          { name: "Id_Cliente" },
        ]
      },
    ]
  });
};
