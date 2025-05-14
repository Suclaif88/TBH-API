const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Empleados', {
    Id_Empleados: {
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
    Tipo_Documento: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    Nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Celular: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    F_Nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Direccion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Sexo: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Empleados',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Empleados" },
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
    ]
  });
};
