const { Novedades_Horarios } = require ('../models');

exports.crearNovedades = async (req, res) => {
    try {
        const nuevoNovedades = await Novedades_Horarios.create(req.body);
        res.json({ status: 'success', data: nuevoNovedades });
    } catch (err) {
        res.status (500).json({ status: 'error', massage: err.message });
    }
};

exports.listarNovedades = async (req, res) => {
    try {
        const Novedades = await Novedades.findAll();
        res.json({status: 'success', data: Novedades_Horarios });
    }catch (err) {
        res.status(500).json({status: 'error', message: err.message });
    }    
};

exports.obtenerNovedadesPorId = async (req,res)=> {
    try {
        const {id}= req.params;
        const Novedades = await Novedades.findByPk(id);

        if (!Novedades){
            return res.status(404).json({ status: 'error', message: 'Novedad no encontrado'});
        }

        res.json({ status: 'success', data: insumo });
    } catch (err) {
        res.status (500).json({ status: 'error', message: err.message });
    }
}


exports.eliminarNovedades = async (req, res) => {
  try {
    const { id } = req.params;
    const Novedades = await Novedades.findOne({ where: { Id_Empleados } });

    if (!Novedades) {
      return res.status(404).json({ status: 'error', message: 'Novedad no encontrado' });
    }

    await Novedades.destroy({ where: { Id_Empleados } });
    res.json({ status: 'success', message: 'Novedad eliminado' });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
