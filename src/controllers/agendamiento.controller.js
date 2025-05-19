const { Agendamientos } = require ('../models');

exports.crearAgendamientos = async (req, res) => {
    try {
        const nuevoAgendamientos = await Agendamientos.create(req.body);
        res.json({ status: 'success', data: nuevoAgendamientos });
    } catch (err) {
        res.status (500).json({ status: 'error', massage: err.message });
    }
};

exports.listarAgendamiento = async (req, res) => {
    try {
        const agendamientos = await agendamientos.findAll();
        res.json({status: 'success', data: agendamientos });
    }catch (err) {
        res.status(500).json({status: 'error', message: err.message });
    }    
};

exports.obtenerAgendamientosPorId = async (req,res)=> {
    try {
        const {id}= req.params;
        const agendamientos = await agendamientos.findByPk(id);

        if (!agendamientos){
            return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado'});
        }

        res.json({ status: 'success', data: insumo });
    } catch (err) {
        res.status (500).json({ status: 'error', message: err.message });
    }
}


exports.eliminarAgendamientos = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamientos = await agendamientos.findOne({ where: { Id_Agendamientos } });

    if (!agendamientos) {
      return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
    }

    await agendamientos.destroy({ where: { Id_Agendamientos } });
    res.json({ status: 'success', message: 'Agendamiento eliminado' });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
