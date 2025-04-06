const { Ventas } = require('../models');

exports.crearVenta = async (req, res) => {
  try {
    const { Id_Agendamientos, Documento_Cliente, Documento_Empleados, Fecha, Total, Estado } = req.body;

    if (!Id_Agendamientos || !Documento_Cliente || !Documento_Empleados || !Fecha || !Total) {
      return res.status(400).json({
        status: 'error',
        message: 'Faltan campos obligatorios'
      });
    }

    const nuevaVenta = await Ventas.create({
      Id_Agendamientos,
      Documento_Cliente,
      Documento_Empleados,
      Fecha,
      Total,
      Estado: Estado || 1,
    });

    res.status(201).json({
      status: 'success',
      message: 'Venta creada con éxito',
      data: nuevaVenta
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear la venta. Intente nuevamente.',
      error: err.message
    });
  }
};

exports.listarVentas = async (req, res) => {
  try {
    const ventas = await Ventas.findAll();

    if (ventas.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontraron ventas'
      });
    }

    res.status(200).json({
      status: 'success',
      data: ventas
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener las ventas. Intente nuevamente.',
      error: err.message
    });
  }
};

exports.actualizarVenta = async (req, res) => {
    try {
      const { id } = req.params;
      const venta = await Ventas.findByPk(id);
  
      if (!venta) {
        return res.status(404).json({
          status: 'error',
          message: 'Venta no encontrada'
        });
      }
  
      const { Documento_Cliente, Total, Estado } = req.body;
  
      if (!Documento_Cliente && Total === undefined && Estado === undefined) {
        return res.status(400).json({
          status: 'error',
          message: 'Debe proporcionar al menos uno de los campos: Documento_Cliente, Total o Estado'
        });
      }
  
      if (Documento_Cliente) venta.Documento_Cliente = Documento_Cliente;
      if (Total !== undefined) venta.Total = Total;
      if (Estado !== undefined) venta.Estado = Estado;
  
      await venta.save();
  
      res.status(200).json({
        status: 'success',
        message: 'Venta actualizada con éxito',
        data: venta
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Error al actualizar la venta. Intente nuevamente.',
        error: err.message
      });
    }
  };
  

  exports.eliminarVenta = async (req, res) => {
    try {
      const { id } = req.params;
      const venta = await Ventas.findByPk(id);
  
      if (!venta) {
        return res.status(404).json({
          status: 'error',
          message: 'Venta no encontrada'
        });
      }
  
      if (venta.Estado !== false) {
        return res.status(400).json({
          status: 'error',
          message: 'No se puede eliminar una venta con este estado'
        });
      }
  
      await venta.destroy();
  
      res.status(200).json({
        status: 'success',
        message: 'Venta eliminada con éxito'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Error al eliminar la venta. Intente nuevamente.',
        error: err.message
      });
    }
  };