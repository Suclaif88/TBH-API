const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Agendamiento_Servicios', {
    Id_Agendamiento_Servicios: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Servicios: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Servicios',
        key: 'Id_Servicios'
      }
    },
    Id_Agendamientos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Agendamientos',
        key: 'Id_Agendamientos'
      },
      unique: "Agendamiento_Servicios_ibfk_2"
    },
    Precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Agendamiento_Servicios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Agendamiento_Servicios" },
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
        name: "Id_Servicios",
        using: "BTREE",
        fields: [
          { name: "Id_Servicios" },
        ]
      },
    ]
  });
};
