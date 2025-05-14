const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Empleado_Servicio', {
    Id_Empleado_Servicio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Empleados: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Empleados',
        key: 'Id_Empleados'
      }
    },
    Id_Servicios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Servicios',
        key: 'Id_Servicios'
      }
    }
  }, {
    sequelize,
    tableName: 'Empleado_Servicio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Empleado_Servicio" },
        ]
      },
      {
        name: "Id_Empleados",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Empleados" },
          { name: "Id_Servicios" },
        ]
      },
      {
        name: "Id_Servicios",
        using: "BTREE",
        fields: [
          { name: "Id_Servicios" },
        ]
      },
    ]
  });
};
