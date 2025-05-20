const { Empleado_Servicio} = require("../models");

exports.ListarServiciosEmpleados = async(req,res)=>{
    try{
        const serviciosempleados = await Empleado_Servicio.findAll();
        res.json({status: 'success', data:serviciosempleados})
    }catch(err){
        res.status(500).json({status:'error', message:err.message})
    }
}
exports.ServiciosEmpleadosId = async(req,res)=>{
    try{
        const {id} = req.params;
        const serviciosempleados = await Empleado_Servicio.findByPk(id);

        if(!serviciosempleados){
            return res.status(404).json({status:'error', message: 'Servicio De Empleado no encontrado'})
        }
        res.json({ status: 'success', data: serviciosempleados });
    }catch(err){
        res.status(500).json({ status: 'error', message: err.message });
    }
}