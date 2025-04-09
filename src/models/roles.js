const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Roles = sequelize.define('roles', {
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
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'roles',
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

  Roles.associate = models => {
    Roles.belongsToMany(models.Permisos, {
      through: models.RolPermiso,
      foreignKey: 'rol_id',
      otherKey: 'permiso_id'
    });
  };

  return Roles;

};
