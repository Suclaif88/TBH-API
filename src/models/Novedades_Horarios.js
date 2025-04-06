const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Novedades_Horarios', {
    Id_Novedades_Horarios: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Documento_Empleados: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'Empleados',
        key: 'Documento_Empleados'
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
        name: "Documento_Empleados",
        using: "BTREE",
        fields: [
          { name: "Documento_Empleados" },
        ]
      },
    ]
  });
};
