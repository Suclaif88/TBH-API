const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Producto_Tamano', {
    Id_Producto_Tamano: {
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
    Id_Tamano: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tamano',
        key: 'Id_Tamano'
      }
    }
  }, {
    sequelize,
    tableName: 'Producto_Tamano',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Producto_Tamano" },
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
    ]
  });
};
