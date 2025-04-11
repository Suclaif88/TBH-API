const db = require('../models');
const Empleados = db.Empleados;

exports.getAll = async (req, res) => {
  try {
    const empleados = await Empleados.findAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados', details: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const empleado = await Empleados.findByPk(req.params.documento);
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el empleado', details: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoEmpleado = await Empleados.create(req.body);
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear empleado', details: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Empleados.update(req.body, {
      where: { Documento_Empleados: req.params.documento }
    });
    if (updated === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado o sin cambios' });
    }
    res.json({ message: 'Empleado actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar empleado', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Empleados.destroy({
      where: { Documento_Empleados: req.params.documento }
    });
    if (deleted === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar empleado', details: error.message });
  }
};
