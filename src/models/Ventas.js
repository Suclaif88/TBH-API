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
    Id_Cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Clientes',
        key: 'Id_Cliente'
      }
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
    Total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    M_Pago: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Referencia: {
      type: DataTypes.STRING(100),
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
        name: "Id_Cliente",
        using: "BTREE",
        fields: [
          { name: "Id_Cliente" },
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
