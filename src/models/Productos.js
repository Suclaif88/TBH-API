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
    Descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    hooks: {
      async afterCreate(producto, options) {
        const { Id_Categoria_Producto, Id_Productos } = producto;

        const Categoria = await sequelize.models.Categoria_Productos.findByPk(Id_Categoria_Producto);

        if (Categoria && Categoria.Es_Ropa) {
          // Obtener solo las tallas que correspondan a la categoría del producto
          const tallas = await sequelize.models.Tallas.findAll({
            where: { Id_Categoria_Producto: Id_Categoria_Producto }
          });

          const relaciones = tallas.map(talla => ({
            Id_Productos: Id_Productos,
            Id_Tallas: talla.Id_Tallas,
            Stock: 0
          }));

          await sequelize.models.Producto_Tallas.bulkCreate(relaciones);
        }}},
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
