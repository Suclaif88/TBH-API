const { Empleados, Empleado_Servicio, Servicios } = require('../models');

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

exports.listarEmpleadoPorDocumento = async (req, res) => {
    try {
        const { documento } = req.params;
        console.log(`Backend: Buscando Empleado por Documento: ${documento}`);
        const empleado = await Empleados.findOne({
            where: { Documento: documento }
        });

        if (!empleado) {
            console.log(`Empleado con Documento ${documento} no encontrado.`);
            return res.status(404).json({ status: 'error', message: 'Empleado no encontrado' });
        }
        console.log(`Backend: Empleado encontrado por Documento: ${documento}`);
        res.json({ status: 'success', data: empleado });
    } catch (err) {
        console.error('Backend: Error en listarEmpleadoPorDocumento:', err);
        res.status(500).json({ status: 'error', message: err.message || 'Error al buscar Empleado por documento.' });
    }
};

/**
 * Endpoint para obtener solo ID y nombre de empleados activos
 * Requiere token de autenticación pero no verificación de roles
 */
exports.obtenerEmpleadosActivosPublico = async (req, res) => {
  try {
    const empleadosActivos = await Empleados.findAll({
      where: { Estado: true },
      attributes: ['Id_Empleados', 'Nombre'],
      order: [['Nombre', 'ASC']]
    });
    
    res.json({ 
      status: 'success', 
      data: empleadosActivos,
      total: empleadosActivos.length
    });
  } catch (error) {
    console.error('Error al obtener empleados activos (público):', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al obtener empleados activos' 
    });
  }
};

/**
 * Endpoint para obtener los servicios de un empleado específico
 * Requiere token de autenticación pero no verificación de roles
 */
exports.obtenerServiciosEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'ID de empleado es requerido'
      });
    }

    // Verificar que el empleado existe y está activo
    const empleado = await Empleados.findByPk(id, {
      attributes: ['Id_Empleados', 'Nombre', 'Estado']
    });

    if (!empleado) {
      return res.status(404).json({
        status: 'error',
        message: 'Empleado no encontrado'
      });
    }

    if (!empleado.Estado) {
      return res.status(400).json({
        status: 'error',
        message: 'El empleado no está activo'
      });
    }

    // Obtener los servicios del empleado
    const serviciosEmpleado = await Empleado_Servicio.findAll({
      where: { Id_Empleados: id },
      include: [
        {
          model: Servicios,
          as: 'Id_Servicios_Servicio',
          attributes: ['Id_Servicios', 'Nombre', 'Descripcion', 'Precio', 'Duracion', 'Estado']
        }
      ],
      attributes: ['Id_Empleado_Servicio']
    });

    // Filtrar solo servicios activos y formatear la respuesta
    const serviciosActivos = serviciosEmpleado
      .filter(relacion => relacion.Id_Servicios_Servicio && relacion.Id_Servicios_Servicio.Estado)
      .map(relacion => ({
        Id_Servicio: relacion.Id_Servicios_Servicio.Id_Servicios,
        Nombre: relacion.Id_Servicios_Servicio.Nombre,
        Descripcion: relacion.Id_Servicios_Servicio.Descripcion,
        Precio: relacion.Id_Servicios_Servicio.Precio,
        Duracion: relacion.Id_Servicios_Servicio.Duracion
      }));

    res.json({
      status: 'success',
      data: {
        empleado: {
          Id_Empleados: empleado.Id_Empleados,
          Nombre: empleado.Nombre
        },
        servicios: serviciosActivos,
        total: serviciosActivos.length
      }
    });

  } catch (error) {
    console.error('Error al obtener servicios del empleado:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener servicios del empleado'
    });
  }
};
