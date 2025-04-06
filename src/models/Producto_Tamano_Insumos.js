const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Producto_Tamano_Insumos', {
    Id_Producto_Tamano_Insumos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Productos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos',
        key: 'Id_Productos'
      }
    },
    Id_Tamano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tamano',
        key: 'Id_Tamano'
      }
    },
    Id_Insumos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Insumos',
        key: 'Id_Insumos'
      }
    },
    Cantidad_Consumo: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Producto_Tamano_Insumos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Producto_Tamano_Insumos" },
        ]
      },
      {
        name: "Id_Productos",
        using: "BTREE",
        fields: [
          { name: "Id_Productos" },
        ]
      },
      {
        name: "Id_Tamano",
        using: "BTREE",
        fields: [
          { name: "Id_Tamano" },
        ]
      },
      {
        name: "Id_Insumos",
        using: "BTREE",
        fields: [
          { name: "Id_Insumos" },
        ]
      },
    ]
  });
};
