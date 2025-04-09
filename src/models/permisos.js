const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Permisos = sequelize.define('permisos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: "nombre"
    }
  }, {
    sequelize,
    tableName: 'permisos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "nombre",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nombre" },
        ]
      },
    ]
  });

  Permisos.associate = models => {
    Permisos.belongsToMany(models.Roles, {
      through: models.RolPermiso,
      foreignKey: 'permiso_id',
      otherKey: 'rol_id'
    });
  };
  
  return Permisos;
};
