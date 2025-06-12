const { Devoluciones } = require('../models');

exports.crearDevolucion = async (req, res) => {
  try {
    const nuevaDevolucion = await Devoluciones.create(req.body);
    res.json({ status: 'success', data: nuevaDevolucion });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarDevoluciones = async (req, res) => {
  try {
    const devoluciones = await Devoluciones.findAll();
    res.json({ status: 'success', data: devoluciones });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.obtenerDevolucionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const devolucion = await Devoluciones.findOne({ where: { Id_Devoluciones: id } });

    if (!devolucion) {
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }

    res.json({ status: 'success', data: devolucion });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Devoluciones.update(req.body, { where: { Id_Devoluciones: id } });

    if (updated === 0) {
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada o sin cambios' });
    }

    res.json({ status: 'success', message: 'Devolución actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Devoluciones.destroy({ where: { Id_Devoluciones: id } });

    if (deleted === 0) {
      return res.status(404).json({ status: 'error', message: 'Devolución no encontrada' });
    }

    res.json({ status: 'success', message: 'Devolución eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.cambiarEstadoDevolucion = async(req,res)=>{
  try{
    const id = req.params.id;
    const devolucion = await Devoluciones.findByPk(id);
    if(!devolucion){
      return res.status(400).json({status: 'error', message: 'Devolucion no encontrada'})
    }
    devolucion.Estado = !devolucion.Estado;
    await devolucion.save();

    res.json({
      status:'success',
      mensaje :`Devolucion ${devolucion.Estado ? 'activada' : 'desactivada'} correctamente`,

    });
  }catch(error){
    res.status(500).json({status: 'error', message: error.message});
  }
}