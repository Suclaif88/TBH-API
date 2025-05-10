const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Usuarios', {
    Documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
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
          { name: "Documento" },
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
