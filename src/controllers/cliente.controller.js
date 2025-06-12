const { Clientes } = require('../models');

exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = await Clientes.create(req.body);
    res.json({ status: 'success', data: nuevoCliente });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Clientes.findAll();
    res.json({ status: 'success', data: clientes });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarClientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await Clientes.findOne({
      where: { Id_Cliente: id }
    });

    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    res.json({ status: 'success', data: cliente });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarClientePorDocumento = async (req, res) => {
  try {
    const { documento } = req.params;

    const cliente = await Clientes.findOne({
      where: { documento }
    });

    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    res.json({ status: 'success', data: cliente });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarCliente = async (req, res) => {
  const bcrypt = require('bcryptjs');
  try {
    const { id } = req.params;
    const cliente = await Clientes.findOne({ where: { Id_Cliente: id } });

    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    const datosActualizados = { ...req.body };

    if (datosActualizados.Password && datosActualizados.Password.trim() !== "") {
      datosActualizados.Password = await bcrypt.hash(datosActualizados.Password, 10);
    } else {
      delete datosActualizados.Password;
    }

    await Clientes.update(datosActualizados, { where: { Id_Cliente: id } });

    res.json({ status: 'success', message: 'Cliente actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Clientes.findOne({ where: { Id_Cliente: id } });
    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }
    await Clientes.destroy({ where: { Id_Cliente: id } });
    res.json({ status: 'success', message: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.buscarClientePorEmail = async (req, res) => {
  try {
    const { email } = req.params;  

    const cliente = await Clientes.findOne({ where: { email } });

    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    res.json({ status: 'success', data: cliente });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.cambiarEstadoCliente = async (req, res) => {
  try {
    const id = req.params.id;

    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    cliente.Estado = !cliente.Estado;
    await cliente.save();

    res.json({
      status: 'success',
      mensaje: `cliente ${cliente.Estado ? 'activado' : 'desactivado'} correctamente`,
      cliente
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
