const { Insumos, Categoria_Insumos, Detalle_Compra_Insumos } = require("../models");

exports.listarInsumos = async (req, res) => {
  try {
    const insumos = await Insumos.findAll({
      include: [
        {
          model: Categoria_Insumos,
          as: 'Id_Categoria_Insumos_Categoria_Insumo',
          attributes: ['Nombre'],
        },
        {
          model: Detalle_Compra_Insumos,
          as: 'Detalle_Compra_Insumos',
          attributes: ['Id_Detalle_Insumos'],
        },
      ],
    });

    const procesados = insumos.map(insumo => {
      const i = insumo.toJSON();
      i.TieneCompras = i.Detalle_Compra_Insumos.length > 0;
      delete i.Detalle_Compra_Insumos;
      return i;
    });

    res.json({ status: 'success', data: procesados });
  } catch (err) {
    console.error("Error al listar insumos:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.obtenerInsumoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumos.findByPk(id);

    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }

    res.json({ status: 'success', data: insumo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.obtenerInsumosActivos = async (req, res) => {
  try {
    const insumosActivos = await Insumos.findAll({
      where: {
        Estado: true
      },
      include: {
        model: Categoria_Insumos,
        as: 'Id_Categoria_Insumos_Categoria_Insumo',
        attributes: ['Nombre'],
      },
    });

    const respuesta = insumosActivos.map((insumo) => ({
      Id_Insumos: insumo.Id_Insumos,
      Nombre: insumo.Nombre,
      Stock: insumo.Stock,
      Estado: insumo.Estado,
      Id_Categoria_Insumos: insumo.Id_Categoria_Insumos,
      Categoria: insumo.Id_Categoria_Insumos_Categoria_Insumo?.Nombre || "Sin Categoría",
    }));

    res.json({ status: 'success', data: respuesta });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerInsumosBase = async (req, res) => {
  try {
    const insumosBase = await Insumos.findAll({
      where: {
        Estado: true
      },
      include: [
        {
          model: Categoria_Insumos,
          as: "Id_Categoria_Insumos_Categoria_Insumo",
          where: {
            Nombre: "Base"
          }
        }
      ]
    });

    res.json({ status: 'success', data: insumosBase });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerInsumosFrascos = async (req, res) => {
  try {
    const insumosFrasco = await Insumos.findAll({
      where: {
        Estado: true
      },
      include: [
        {
          model: Categoria_Insumos,
          as: "Id_Categoria_Insumos_Categoria_Insumo",
          where: {
            Nombre: "Frasco"
          }
        }
      ]
    });

    res.json({ status: 'success', data: insumosFrasco });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerInsumosFragancia = async (req, res) => {
  try {
    const insumosFragancia = await Insumos.findAll({
      where: {
        Estado: true
      },
      include: [
        {
          model: Categoria_Insumos,
          as: "Id_Categoria_Insumos_Categoria_Insumo",
          where: {
            Nombre: "Fragancia"
          }
        }
      ]
    });

    res.json({ status: 'success', data: insumosFragancia });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.crearInsumo = async (req, res) => {
  try {
    const { Nombre } = req.body;

    const existente = await Insumos.findOne({ where: { Nombre } });
    if (existente) {
      return res.status(400).json({ status: "error", message: "El insumo ya existe con ese nombre" });
    }

    const nuevo = await Insumos.create(req.body);
    res.json({ status: "success", data: nuevo });
  } catch (err) {
    console.error("Error al crear insumo:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};


exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;

    const insumo = await Insumos.findByPk(id);
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }

    insumo.Estado = !insumo.Estado;
    await insumo.save();

    res.json({ status: 'success', data: insumo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

//--------------------------------------------------------------------------



exports.actualizarInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumos.findOne({ where: { Id_Insumos: id } });
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }
    await Insumos.update(req.body, { where: { Id_Insumos: id } });
    res.json({ status: 'success', message: 'Insumo actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.eliminarInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await Insumos.findOne({ where: { Id_Insumos: id } });
    if (!insumo) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }
    await Insumos.destroy({ where: { Id_Insumos: id } });
    res.json({ status: 'success', message: 'Insumo eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};