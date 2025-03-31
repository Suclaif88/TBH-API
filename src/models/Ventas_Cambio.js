const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ventas_Cambio', {
    Id_Ventas_Cambio: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Devoluciones: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Devoluciones',
        key: 'Id_Devoluciones'
      }
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
      allowNull: false
    },
    Observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Ventas_Cambio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Ventas_Cambio" },
        ]
      },
      {
        name: "Id_Devoluciones",
        using: "BTREE",
        fields: [
          { name: "Id_Devoluciones" },
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
