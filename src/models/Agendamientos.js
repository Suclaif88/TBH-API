const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Agendamientos', {
    Id_Agendamientos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Documento_Cliente: {
      type: DataTypes.STRING(20),
      allowNull: true,
      references: {
        model: 'Clientes',
        key: 'Documento_Cliente'
      }
    },
    Documento_Empleados: {
      type: DataTypes.STRING(20),
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
    Subtotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    Estado: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Agendamientos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Agendamientos" },
        ]
      },
      {
        name: "Documento_Cliente",
        using: "BTREE",
        fields: [
          { name: "Documento_Cliente" },
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
