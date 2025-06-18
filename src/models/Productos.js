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
    hooks: {
      async afterCreate(producto, options) {
        const { Id_Categoria_Producto, Id_Productos } = producto;

        const Categoria = await sequelize.models.Categoria_Productos.findByPk(Id_Categoria_Producto);

        if (!Categoria) return;

        // Si es ropa, asociar tallas
        if (Categoria.Nombre === 'Ropa') {
          const tallas = await sequelize.models.Tallas.findAll({
            where: { Id_Categoria_Producto }
          });

          const relacionesTallas = tallas.map(talla => ({
            Id_Productos,
            Id_Tallas: talla.Id_Tallas,
            Stock: 0
          }));

          await sequelize.models.Producto_Tallas.bulkCreate(relacionesTallas);
        }

        // Si es perfume
        if (Categoria.Nombre === 'Perfume') {
          const tamanos = await sequelize.models.Tamano.findAll({
            where: { Estado: true }
          });

          for (const tamano of tamanos) {
            const prodTam = await sequelize.models.Producto_Tamano.create({
              Id_Productos,
              Id_Tamano: tamano.Id_Tamano
            });

            // Obtener todos los insumos del tamaño
            const insumosDelTamano = await sequelize.models.Tamano_Insumos.findAll({
              where: { Id_Tamano: tamano.Id_Tamano }
            });

            // Separar base y no-base
            const insumosBase = [];
            const insumosOtros = [];

            for (const rel of insumosDelTamano) {
              const insumo = await sequelize.models.Insumos.findByPk(rel.Id_Insumos, {
                include: {
                  model: sequelize.models.Categoria_Insumos,
                  where: { Nombre: 'Base' }
                }
              });

              if (insumo) {
                insumosBase.push(rel);
              } else {
                insumosOtros.push(rel);
              }
            }

            // Sumar cantidades de insumos base
            const sumaBase = insumosBase.reduce((total, i) => total + parseFloat(i.Cantidad), 0);
            const cantidadConsumo = tamano.Cantidad_Maxima - sumaBase;

            // Insertar en Producto_Tamano_Insumos solo los insumos no base
            const relacionesInsumos = insumosOtros.map(i => ({
              Id_Producto_Tamano: prodTam.Id_Producto_Tamano,
              Id_Insumos: i.Id_Insumos,
              Cantidad_Consumo: cantidadConsumo
            }));

            await sequelize.models.Producto_Tamano_Insumos.bulkCreate(relacionesInsumos);
          }
        }
      }
    },


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
