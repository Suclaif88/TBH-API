  const Sequelize = require('sequelize');
  module.exports = function(sequelize, DataTypes) {
    return sequelize.define('rol_permiso', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      permiso_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'permisos',
          key: 'id'
        }
      }
    }, {
      sequelize,
      tableName: 'rol_permiso',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "rol_id",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "rol_id" },
            { name: "permiso_id" },
          ]
        },
        {
          name: "permiso_id",
          using: "BTREE",
          fields: [
            { name: "permiso_id" },
          ]
        },
      ]
    });
  };
