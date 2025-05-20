const { Proveedores, Compras } = require('../models');


// Obtener todos los Proveedores
exports.obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedores.findAll();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener Proveedores' });
  }
};


// Obtener un Proveedor por ID
exports.obtenerProveedorPorId = async (req, res) => {
  try {
    const proveedor = await Proveedores.findByPk(req.params.id);
    if (proveedor) {
      res.json(proveedor);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el Proveedor' });
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
    res.json(proveedoresActivos);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener Proveedores Activos' });
}
};

// Crear nuevo Proveedor
exports.crearProveedor = async (req, res) => {
  try {
    const nuevoProveedor = await Proveedores.create(req.body);
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error al crear categoría', detalles: error });
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
      res.json(proveedorActualizado);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar Proveedor', detalles: error });
  }
};

// Eliminar un Proveedor
exports.eliminarProveedor = async (req, res) => {
  const id = req.params.id;

  const compras = await Compras.findOne({ where: { Id_Proveedores: id } });

  if (compras) {
    return res.status(400).json({ error: "No se puede eliminar: el proveedor tiene compras registradas." });
  }

  await Proveedor.destroy({ where: { id } });
  return res.json({ mensaje: "Proveedor eliminado correctamente." });
};


// Cambiar el estado de un Proveedor (activar o desactivar)
exports.cambiarEstadoProveedor = async (req, res) => {
  try {
    const id = req.params.id;

    const proveedor = await Proveedores.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    proveedor.Estado = !proveedor.Estado;
    await proveedor.save();

    res.json({
      mensaje: `Proveedor ${proveedor.Estado ? 'activado' : 'desactivado'} correctamente`,
      proveedor
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar el estado del Proveedor' });
  }
};


