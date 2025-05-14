const { Clientes } = require('../models');

exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = await Clientes.create(req.body);
    res.json({ status: 'success', data: nuevoCliente });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarCliente = async (req, res) => {
  try {
    const clientes = await Clientes.findAll();
    res.json({ status: 'success', data: clientes });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarClienteDocumento = async (req, res) => {
  try {
    const { documento_cliente } = req.params;
    const cliente = await Clientes.findByPk(documento_cliente);
    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }
    res.json({ status: 'success', data: cliente }); // ← corregido
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const { documento_cliente } = req.params;
    const cliente = await Clientes.findOne({ where: { Documento_Cliente: documento_cliente } });
    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }
    await Clientes.update(req.body, { where: { Documento_Cliente: documento_cliente } });
    res.json({ status: 'success', message: 'Cliente actualizado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    const { documento_cliente } = req.params;
    const cliente = await Clientes.findOne({ where: { Documento_Cliente: documento_cliente } });
    if (!cliente) {
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }
    await Clientes.destroy({ where: { Documento_Cliente: documento_cliente } });
    res.json({ status: 'success', message: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};