const { Empleados } = require('../models');

exports.listarEmpleados = async (req, res) => {
  try {
    const empleados = await Empleados.findAll();
    res.json({ status: 'success', data: empleados });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleados.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }
    res.json({ status: 'success', data: empleado });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.obtenerEmpleadosActivos = async (req, res) => {
  try {
    const empleadosActivos = await Empleados.findAll({
      where: { Estado: true }
    });
    res.json({ status: 'success', data: empleadosActivos });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener empleados activos' });
  }
};

exports.crearEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = await Empleados.create(req.body);
    res.json({ status: 'success', data: nuevoEmpleado });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Empleados.update(req.body, {
      where: { Id_Empleados: id }
    });

    if (updated) {
      const empleadoActualizado = await Empleados.findByPk(id);
      res.json({ status: 'success', data: empleadoActualizado });
    } else {
      res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  try {
    const id = req.params.id;
    const empleado = await Empleados.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }

    await Empleados.destroy({ where: { Id_Empleados: id } });
    res.json({ status: 'success', message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.cambiarEstadoEmpleado = async (req, res) => {
  try {
    const id = req.params.id;
    const empleado = await Empleados.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
    }

    empleado.Estado = !empleado.Estado;
    await empleado.save();

    res.json({
      status: 'success',
      mensaje: `Empleado ${empleado.Estado ? 'activado' : 'desactivado'} correctamente`,
      empleado
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
