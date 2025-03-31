const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tallas', {
    Id_Tallas: {
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
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Tallas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Tallas" },
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
