const { Empleados } = require('../models');

exports.crearEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = await Empleados.create(req.body);
    res.json({ status: 'success', data: nuevoEmpleado });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.listarEmpleados = async (req, res) => {
  try {
    const empleados = await Empleados.findAll();
    res.json({ status: 'success', data: empleados });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.obtenerEmpleadoPorDocumento = async (req, res) => {
  try {
    const { documento } = req.params;
    const empleado = await Empleados.findByPk(documento);
    if (!empleado) {
      return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }
    res.json({ status: 'success', data: empleado });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  try {
    const { documento } = req.params;
    const empleado = await Empleados.findOne({ where: { Documento_Empleados: documento } });
    if (!empleado) {
      return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }
    await Empleados.update(req.body, { where: { Documento_Empleados: documento } });
    res.json({ status: 'success', message: 'Empleado actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  try {
    const { documento } = req.params;
    const empleado = await Empleados.findOne({ where: { Documento_Empleados: documento } });
    if (!empleado) {
      return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }
    await Empleados.destroy({ where: { Documento_Empleados: documento } });
    res.json({ status: 'success', message: 'Empleado eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
