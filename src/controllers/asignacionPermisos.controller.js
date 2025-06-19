const { Rol_Permiso,Permisos  } = require('../models');

exports.crearRolPermiso = async (req, res) => {
  try {
    const { Rol_Id, Permisos } = req.body;

    if (!Array.isArray(Permisos)) {
      return res.status(400).json({ status: 'error', message: 'El campo Permisos debe ser un array' });
    }

    if (Permisos.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Debe asignar al menos un permiso' });
    }

    const asignaciones = [];

    for (const Permiso_Id of Permisos) {
      const existente = await Rol_Permiso.findOne({
        where: { Rol_Id, Permiso_Id }
      });

      if (existente) {
        if (!existente.Estado) {
          existente.Estado = true;
          await existente.save();
        }
        asignaciones.push(existente);
      } else {
        const nuevo = await Rol_Permiso.create({ Rol_Id, Permiso_Id, Estado: true });
        asignaciones.push(nuevo);
      }
    }

    await Rol_Permiso.update(
      { Estado: false },
      {
        where: {
          Rol_Id,
          Permiso_Id: { [require('sequelize').Op.notIn]: Permisos }
        }
      }
    );

    res.json({ status: 'success', data: asignaciones });
  } catch (err) {
    console.error("Error en crearRolPermiso:", err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRolPermisos = async (req, res) => {
  try {
    const lista = await Rol_Permiso.findAll();
    res.json({ status: 'success', data: lista });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarRolPermisoId = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Rol_Permiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    res.json({ status: 'success', data: item });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarPermisosPorRol = async (req, res) => {
  try {
    const { rolId } = req.params;

    const asignaciones = await Rol_Permiso.findAll({
      where: { Rol_Id: rolId },
      attributes: ["Permiso_Id", "Estado"]
    });

    const ids = asignaciones.map(p => p.Permiso_Id);

    const permisos = await Permisos.findAll({
      where: { Id: ids },
      attributes: ["Id", "Nombre"]
    });

    const resultado = permisos.map(p => {
      const asignacion = asignaciones.find(a => a.Permiso_Id === p.Id);
      return {
        Permiso_Id: p.Id,
        Nombre: p.Nombre,
        Estado: asignacion ? asignacion.Estado : false
      };
    });

    res.json({ status: "success", data: resultado });
  } catch (err) {
    console.error("Error al listar permisos por Rol_Id:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};



exports.actualizarRolPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Rol_Permiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    const { rol_id, permiso_id } = req.body;

    await Rol_Permiso.update({ rol_id, permiso_id }, { where: { id } });

    res.json({ status: 'success', message: 'Rol Permiso actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarRolPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Rol_Permiso.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    await Rol_Permiso.destroy({ where: { id } });

    res.json({ status: 'success', message: 'Rol Permiso eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.cambiarEstadoRolPermiso = async (req, res) => {
  try {
    const id = req.params.id;

    const rolPermiso = await Rol_Permiso.findByPk(id);
    if (!rolPermiso) {
      return res.status(404).json({ status: 'error', message: 'Rol Permiso no encontrado' });
    }

    rolPermiso.Estado = !rolPermiso.Estado;
    await rolPermiso.save();

    res.json({
      status: 'success',
      mensaje: `Rol Permiso ${rolPermiso.Estado ? 'activado' : 'desactivado'} correctamente`,
      data: rolPermiso
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
