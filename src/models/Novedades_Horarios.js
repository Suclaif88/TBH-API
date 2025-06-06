const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Novedades_Horarios', {
    Id_Novedades_Horarios: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Empleados: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Empleados',
        key: 'Id_Empleados'
      }
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Hora_Inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Hora_Fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Motivo: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Novedades_Horarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Novedades_Horarios" },
        ]
      },
      {
        name: "Id_Empleados",
        using: "BTREE",
        fields: [
          { name: "Id_Empleados" },
        ]
      },
    ]
  });
};
