const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Proveedores', {
    Id_Proveedores: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Tipo_Proveedor: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    NIT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Nombre_Empresa: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Asesor: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Celular_Empresa: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    Celular_Asesor: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    Tipo_Documento: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    Documento: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Nombre: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Celular: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Direccion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Proveedores',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Proveedores" },
        ]
      },
    ]
  });
};
