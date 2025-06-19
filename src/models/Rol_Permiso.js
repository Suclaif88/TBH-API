const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Rol_Permiso', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Rol_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'Id'
      }
    },
    Permiso_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Permisos',
        key: 'Id'
      }
    },
     Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    tableName: 'Rol_Permiso',
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
        name: "Rol_Id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Rol_Id" },
          { name: "Permiso_Id" },
        ]
      },
      {
        name: "Permiso_Id",
        using: "BTREE",
        fields: [
          { name: "Permiso_Id" },
        ]
      },
    ]
  });
};
