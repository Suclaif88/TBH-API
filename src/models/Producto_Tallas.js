const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Producto_Tallas', {
    Id_Producto_Tallas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Productos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Productos',
        key: 'Id_Productos'
      },
      onDelete: 'CASCADE'
    },
    Id_Tallas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tallas',
        key: 'Id_Tallas'
      }
    },
    Stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
}

  }, {
    sequelize,
    tableName: 'Producto_Tallas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Producto_Tallas" },
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
        name: "Id_Tallas",
        using: "BTREE",
        fields: [
          { name: "Id_Tallas" },
        ]
      },
    ]
  });
};
