const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tamano_Insumos', {
    Id_Tamano_Insumos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Id_Tamano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tamano',
        key: 'Id_Tamano'
      },
      onDelete: 'CASCADE'
    },
    Id_Insumos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Insumos',
        key: 'Id_Insumos'
      }
    },
    Cantidad: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Tamano_Insumos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id_Tamano_Insumos" },
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
