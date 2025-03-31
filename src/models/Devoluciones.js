const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Devoluciones', {
    Id_Devoluciones: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Detalle_Venta_Tallas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Detalle_Venta_Tallas',
        key: 'Id_Detalle_Venta_Tallas'
      }
    },
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Motivo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Devoluciones',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Devoluciones" },
        ]
      },
      {
        name: "Id_Detalle_Venta_Tallas",
        using: "BTREE",
        fields: [
          { name: "Id_Detalle_Venta_Tallas" },
        ]
      },
    ]
  });
};
