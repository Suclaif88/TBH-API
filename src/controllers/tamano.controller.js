const { Tamano } = require('../models');


// Obtener todos los Tamaños 
exports.obtenerTamanos = async (req, res) => {
try {
    const tamanos = await Tamano.findAll();
    res.json({ status: 'success', data: tamanos });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};


// Obtener un Tamaño por ID
exports.obtenerTamanoPorId = async (req, res) => {
try {
    const tamano = await Tamano.findByPk(req.params.id);
    if (tamano) {
        res.json({ status: 'success', data: tamano });
    } else {
        res.status(404).json({ status:'error', message: 'Tamaño no Encontrado' });
    }
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};


// Crear nueva Tamaño
exports.crearTamano = async (req, res) => {
try {
    const nuevoTamano = await Tamano.create(req.body);
    res.json({ status: 'success', data: nuevoTamano });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
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
        res.json({ status: 'success', data: tamanoActualizado });
    } else {
    res.status(404).json({ status:'error', message: 'Tamaño no encontrado' });
    }
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};

// Eliminar un Tamaño
exports.eliminarTamano = async (req, res) => {
try {
    const id = req.params.id;

    const tamano = await Tamano.findByPk(id);
    if (!tamano) {
    return res.status(404).json({ status:'error', message: 'Tamaño no Encontrado' });
    }

    await tamano.destroy();
    res.json({ status:'success', mensaje: 'Tamaño Eliminado Permanentemente' });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};

// Cambiar el estado de un Tamaño (activar o desactivar)
exports.cambiarEstadoTamano = async (req, res) => {
try {
    const id = req.params.id;

    const tamano = await Tamano.findByPk(id);
    if (!tamano) {
    return res.status(404).json({ status:'error', message: 'Tamaño no Encontrado' });
    }

    tamano.Estado = !tamano.Estado;
    await tamano.save();

    res.json({
        status: 'success',
        mensaje: `Tamaño ${tamano.Estado ? 'activado' : 'desactivado'} correctamente`, tamano
    });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};


exports.obtenerTamanosActivos = async (req, res) => {
try {
    const tamanosActivos = await Tamano.findAll({
    where: {
        Estado: true
    }
    });
    res.json({ status: 'success', data: tamanosActivos });
} catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
}
};
