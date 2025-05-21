const { Proveedores, Compras } = require('../models');


// Obtener todos los Proveedores
exports.obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedores.findAll();
    res.json({ status: 'success', data: proveedores });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// Obtener un Proveedor por ID
exports.obtenerProveedorPorId = async (req, res) => {
  try {
    const proveedor = await Proveedores.findByPk(req.params.id);
    if (proveedor) {
      res.json({ status: 'success', data: proveedor });
    } else {
      res.status(404).json({ status: 'error', message: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// OBtener Proveedores Activos
exports.obtenerProveedoresActivos = async (req, res) => {
try {
    const proveedoresActivos = await Proveedores.findAll({
    where: {
        Estado: true
    }
    });
    res.json({ status: 'success', data: proveedoresActivos });
} catch (error) {
    res.status(404).json({ status: 'error', message: 'Error al obtener Proveedores Activos' });
}
};

// Crear nuevo Proveedor
exports.crearProveedor = async (req, res) => {
  try {
    const nuevoProveedor = await Proveedores.create(req.body);
    res.json({ status: 'success', data: nuevoProveedor });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Actualizar un Proveedor
exports.actualizarProveedor = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Proveedores.update(req.body, {
      where: { Id_Proveedores: id }
    });

    if (updated) {
      const proveedorActualizado = await Proveedores.findByPk(id);
      res.json({ status: 'success', data: proveedorActualizado });
    } else {
      res.status(404).json({ status: 'error', message: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Eliminar un Proveedor
exports.eliminarProveedor = async (req, res) => {
  const id = req.params.id;

  const compras = await Compras.findOne({ where: { Id_Proveedores: id } });

  if (compras) {
    return res.status(400).json({ status: 'error', message: "No se puede eliminar: el proveedor tiene compras registradas." });
  }

  await Proveedores.destroy({ where: { Id_Proveedores: id } });
  res.json({ status: 'success', mensaje: "Proveedor eliminado correctamente." });
};


// Cambiar el estado de un Proveedor (activar o desactivar)
exports.cambiarEstadoProveedor = async (req, res) => {
  try {
    const id = req.params.id;

    const proveedor = await Proveedores.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ status: 'error', message: 'Proveedor no encontrado' });
    }

    proveedor.Estado = !proveedor.Estado;
    await proveedor.save();

    res.json({
      status: 'success',
      mensaje: `Proveedor ${proveedor.Estado ? 'activado' : 'desactivado'} correctamente`,
      proveedor
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


