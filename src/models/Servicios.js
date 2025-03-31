const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Servicios', {
    Id_Servicios: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    Duracion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Servicios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Servicios" },
        ]
      },
    ]
  });
};
