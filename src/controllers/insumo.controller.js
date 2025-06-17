const { Categoria_Insumos, Insumos } = require('../models');

exports.listarInsumos = async (req, res) => {
  try {
    const insumos = await Insumos.findAll({
      include: [
        {
          model: Categoria_Insumos,
          as: 'Id_Categoria_Insumos_Categoria_Insumo', 
          attributes: ['Nombre'],
        },
      ],
    });

    res.json({ status: 'success', data: insumos });
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
    const insumosBase = await Insumos.findAll({
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

    res.json({ status: 'success', data: insumosBase });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};



exports.crearInsumo = async (req, res) => {
  try {
    const nuevoInsumo = await Insumos.create(req.body);
    res.json({ status: 'success', data: nuevoInsumo });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
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