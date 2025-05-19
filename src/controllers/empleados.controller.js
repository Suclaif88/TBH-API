const { Empleados } = require('../models');

exports.listarEmpleados = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado: solo administradores' });
    }

    const empleados = await Empleados.findAll();
    res.json({ status: 'success', data: empleados });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.obtenerEmpleadoPorId = async (req, res) => {
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

exports.crearEmpleado = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Acceso denegado: solo administradores' });
    }

    const nuevoEmpleado = await Empleados.create(req.body);
    res.json({ status: 'success', data: nuevoEmpleado });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};


exports.actualizarEmpleado = async (req, res) => {
  try {
    const { documento } = req.params;
    const empleado = await Empleados.findByPk(documento);

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
    const empleado = await Empleados.findByPk(documento);

    if (!empleado) {
      return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }

    await Empleados.destroy({ where: { Documento_Empleados: documento } });
    res.json({ status: 'success', message: 'Empleado eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
