const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ventas', {
    Id_Ventas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Agendamientos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Agendamientos',
        key: 'Id_Agendamientos'
      },
      unique: "Ventas_ibfk_1"
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
    Total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Estado: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Ventas',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Ventas" },
        ]
      },
      {
        name: "Id_Agendamientos",
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
