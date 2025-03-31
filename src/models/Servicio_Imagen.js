const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Servicio_Imagen', {
    Id_Servicio_Imagen: {
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
    Id_Imagenes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Imagenes',
        key: 'Id_Imagenes'
      }
    }
  }, {
    sequelize,
    tableName: 'Servicio_Imagen',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Servicio_Imagen" },
        ]
      },
      {
        name: "Id_Servicios",
        using: "BTREE",
        fields: [
          { name: "Id_Servicios" },
        ]
      },
      {
        name: "Id_Imagenes",
        using: "BTREE",
        fields: [
          { name: "Id_Imagenes" },
        ]
      },
    ]
  });
};
