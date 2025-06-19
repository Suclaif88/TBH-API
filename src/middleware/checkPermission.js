const { Permisos, Rol_Permiso } = require("../models");

const autorizar = (modulo) => {
  return async (req, res, next) => {
    try {
      const rolId = req.user?.rol_id;

      if (!rolId) {
        return res.status(403).json({ message: "Rol no definido" });
      }

      const permiso = await Permisos.findOne({
        where: { Nombre: modulo, Estado: true },
      });

      if (!permiso) {
        return res.status(404).json({ message: `Permiso "${modulo}" no encontrado o inactivo` });
      }

      const asignacion = await Rol_Permiso.findOne({
        where: {
          Rol_Id: rolId,
          Permiso_Id: permiso.Id,
          Estado: true,
        },
      });

      if (!asignacion) {
        return res.status(403).json({ message: `No tiene permiso para acceder al módulo: ${modulo}` });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Error de autorización", error: error.message });
    }
  };
};

module.exports = autorizar;

