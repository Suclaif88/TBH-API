const { Tamano, Tamano_Insumos, Insumos, Producto_Tamano  } = require('../models');




exports.obtenerTamanos = async (req, res) => {
	try {
		const tamanos = await Tamano.findAll({
			include: [
				{
					model: Tamano_Insumos,
					as: 'Tamano_Insumos',
					attributes: ['Id_Insumos', 'Cantidad'],
					include: [
						{
							model: Insumos,
							as: 'Id_Insumos_Insumo', 
							attributes: ['Nombre'],
						},
					],
				},
			],
		});
		res.json({ status: "success", data: tamanos });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", message: error.message });
	}
};




// Obtener un Tamaño por ID
exports.obtenerTamanoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const tamano = await Tamano.findByPk(id, {
        include: [{
            model: Tamano_Insumos,
            as: 'Tamano_Insumos',               
            attributes: ['Id_Insumos', 'Cantidad']
        }]
        });

        if (!tamano) return res.status(404).json({ message: 'Tamaño no encontrado' });

        res.json({ status: 'success', data: tamano });
    } catch (error) {
        console.error('Error al obtener tamaño:', error);
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
    const { id } = req.params;
    const { Nombre, Precio_Venta, Cantidad_Maxima, Estado, insumos } = req.body;
    const t = await Tamano.sequelize.transaction();

    try {
        // 1) Verificar que el tamaño existe
        const tamano = await Tamano.findByPk(id, { transaction: t });
        if (!tamano) {
        await t.rollback();
        return res.status(404).json({ message: 'Tamaño no encontrado' });
        }

        // 2) Actualizar datos del tamaño (aunque no cambie nada, no abortamos)
        await tamano.update(
        { Nombre, Precio_Venta, Cantidad_Maxima, Estado },
        { transaction: t }
        );

        // 3) Leer relaciones actuales
        const actuales = await Tamano_Insumos.findAll({
        where: { Id_Tamano: id },
        transaction: t
        });
        const actualesMap = new Map(actuales.map(r => [r.Id_Insumos, r]));

        // 4) Procesar insumos entrantes
        for (const i of insumos) {
        const clave = i.Id_Insumos;
        const cantidad = Number(i.Cantidad);

        if (actualesMap.has(clave)) {
            // — existe: actualizar si cambió
            const rel = actualesMap.get(clave);
            if (Number(rel.Cantidad) !== cantidad) {
            await Tamano_Insumos.update(
                { Cantidad: cantidad },
                {
                where: { Id_Tamano: id, Id_Insumos: clave },
                transaction: t
                }
            );
            }
            actualesMap.delete(clave);
        } else {
            // — no existía: crear nueva relación
            await Tamano_Insumos.create(
            { Id_Tamano: id, Id_Insumos: clave, Cantidad: cantidad },
            { transaction: t }
            );
        }
        }

        // 5) Borrar las relaciones que quedaron “sobrando”
        for (const insumoId of actualesMap.keys()) {
        await Tamano_Insumos.destroy({
            where: { Id_Tamano: id, Id_Insumos: insumoId },
            transaction: t
        });
        }

        await t.commit();
        return res.json({ message: 'Tamaño y relaciones actualizadas correctamente' });
    } catch (error) {
        await t.rollback();
        console.error('Error al actualizar tamaño con insumos:', error);
        return res.status(500).json({ message: 'Error interno' });
    }
};


// Eliminar un Tamaño
exports.eliminarTamano = async (req, res) => {
    try {   
        const id = req.params.id;

        const tamano = await Tamano.findByPk(id);
        if (!tamano) {
            return res.status(404).json({ status: 'error', message: 'Tamaño no encontrado' });
        }

        // Verificar si hay productos que usan este tamaño
        const existeRelacion = await Producto_Tamano.findOne({
            where: { Id_Tamano: id }
        });

        if (existeRelacion) {
            return res.status(400).json({
                status: 'error',
                message: 'No se puede eliminar el tamaño porque está asociado a uno o más productos'
            });
        }

        // Si no tiene relaciones, eliminar
        await tamano.destroy();
        res.json({ status: 'success', mensaje: 'Tamaño eliminado permanentemente' });

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


exports.crearRelacionTamañoInsumos = async (req, res) => {
	try {
		const nuevaRelacion = await Tamano_Insumos.create(req.body);
		res.status(201).json({ status: 'success', data: nuevaRelacion });
	} catch (error) {
		console.error("Error al crear relación:", error);
		res.status(500).json({ status: 'error', message: 'Error al crear relación' });
	}
};






