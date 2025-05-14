const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Agendamientos', {
    Id_Agendamientos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
