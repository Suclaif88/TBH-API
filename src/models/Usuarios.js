const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Usuarios', {
    Id_Usuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "Documento"
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "Correo"
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    Rol_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'Id'
      }
    }
  }, {
    sequelize,
    tableName: 'Usuarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Usuario" },
        ]
      },
      {
        name: "Documento",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Documento" },
        ]
      },
      {
        name: "Correo",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Correo" },
        ]
      },
      {
        name: "Rol_Id",
        using: "BTREE",
        fields: [
          { name: "Rol_Id" },
        ]
      },
    ]
  });
};
