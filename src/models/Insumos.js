const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Insumos', {
    Id_Insumos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Categoria_Insumos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categoria_Insumos',
        key: 'Id_Categoria_Insumos'
      }
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Stock_Ml: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'Insumos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Insumos" },
        ]
      },
      {
        name: "Id_Categoria_Insumos",
        using: "BTREE",
        fields: [
          { name: "Id_Categoria_Insumos" },
        ]
      },
    ]
  });
};
