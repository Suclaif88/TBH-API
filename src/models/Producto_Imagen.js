const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Producto_Imagen', {
    Id_Producto_Imagen: {
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
      onDelete: 'CASCADE' // <--- IMPORTANTE
    },
    Id_Imagenes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Imagenes',
        key: 'Id_Imagenes'
      },
      onDelete: 'CASCADE' // <--- IMPORTANTE
    }
  }, {
    sequelize,
    tableName: 'Producto_Imagen',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Producto_Imagen" },
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
        name: "Id_Imagenes",
        using: "BTREE",
        fields: [
          { name: "Id_Imagenes" },
        ]
      },
    ]
  });
};
