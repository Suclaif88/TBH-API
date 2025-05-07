const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Productos', {
    Id_Productos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Categoria_Producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categoria_Productos',
        key: 'Id_Categoria_Producto'
      }
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Precio_Venta: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Precio_Compra: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    Stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Productos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Productos" },
        ]
      },
      {
        name: "Id_Categoria_Producto",
        using: "BTREE",
        fields: [
          { name: "Id_Categoria_Producto" },
        ]
      },
    ]
  });
};
