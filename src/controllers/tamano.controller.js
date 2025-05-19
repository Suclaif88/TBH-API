const { Tamano } = require('../models');


// Obtener todos los Tamaños 
exports.obtenerTamanos = async (req, res) => {
try {
    const tamano = await Tamano.findAll();
    res.json(tamano);
} catch (error) {
    res.status(500).json({ error: 'Error al Obtener los Tamaños' });
}
};


// Obtener un Tamaño por ID
exports.obtenerTamanoPorId = async (req, res) => {
try {
    const tamano = await Tamano.findByPk(req.params.id);
    if (tamano) {
    res.json(tamano);
    } else {
    res.status(404).json({ error: 'Tamaño no Encontrado' });
    }
} catch (error) {
    res.status(500).json({ error: 'Error al Obtener el Tamaño' });
}
};


// Crear nueva Tamaño
exports.crearTamano = async (req, res) => {
try {
    const nuevoTamano = await Tamano.create(req.body);
    res.status(201).json(nuevoTamano);
} catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error al crear el Tamaño', detalles: error });
}
};

// Actualizar un Tamaño
exports.actualizarTamano = async (req, res) => {
try {
    const id = req.params.id;
    const [updated] = await Tamano.update(req.body, {
    where: { Id_Tamano: id }
    });

    if (updated) {
    const tamanoActualizado = await Tamano.findByPk(id);
    res.json(tamanoActualizado);
    } else {
    res.status(404).json({ error: 'Tamaño no encontrado' });
    }
} catch (error) {
    res.status(400).json({ error: 'Error al Actualizar el Tamaño', detalles: error });
}
};

// Eliminar un Tamaño
exports.eliminarTamano = async (req, res) => {
try {
    const id = req.params.id;

    const tamano = await Tamano.findByPk(id);
    if (!tamano) {
    return res.status(404).json({ error: 'Tamaño no Encontrado' });
    }

    await tamano.destroy();
    res.json({ mensaje: 'Tamaño Eliminado Permanentemente' });
} catch (error) {
    res.status(500).json({ error: 'Error al Eliminar el Tamaño' });
}
};

// Cambiar el estado de un Tamaño (activar o desactivar)
exports.cambiarEstadoTamano = async (req, res) => {
try {
    const id = req.params.id;

    const tamano = await Tamano.findByPk(id);
    if (!tamano) {
    return res.status(404).json({ error: 'Tamaño no Encontrado' });
    }

    tamano.Estado = !tamano.Estado;
    await tamano.save();

    res.json({
    mensaje: `Tamaño ${tamano.Estado ? 'activado' : 'desactivado'} correctamente`,
    tamano
    });
} catch (error) {
    res.status(500).json({ error: 'Error al Cambiar el Estado del Tamaño' });
}
};


exports.obtenerTamanosActivos = async (req, res) => {
try {
    const tamanosActivos = await Tamano.findAll({
    where: {
        Estado: true
    }
    });
    res.json(tamanosActivos);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener Tamaños Activos' });
}
};
