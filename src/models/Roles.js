const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Roles', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: "Nombre"
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Roles',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
      {
        name: "Nombre",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Nombre" },
        ]
      },
    ]
  });
};
