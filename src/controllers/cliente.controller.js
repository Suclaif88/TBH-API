const { Clientes } = require('../models');

exports.crearCliente = async (req, res) => {
  try {
    const { TipoDocumento, Documento, Nombre, Correo, Celular, Direccion, FechaNacimiento, Sexo, Estado } = req.body;

    console.log('Backend: Datos recibidos para crear cliente:', req.body);

    if (!TipoDocumento || !Documento || !Nombre || !Correo || !Celular || !Direccion || !FechaNacimiento) {
      console.error('Error (400): Faltan campos obligatorios para crear cliente.');
      return res.status(400).json({ status: 'error', message: 'Todos los campos obligatorios deben ser proporcionados.' });
    }

    const existeDocumento = await Clientes.findOne({ where: { Documento: Documento } });
    if (existeDocumento) {
      console.error('Error (409): El documento ya está registrado.');
      return res.status(409).json({ status: 'error', message: 'El documento ya está registrado.' });
    }

    const existeCorreo = await Clientes.findOne({ where: { Correo: Correo } });
    if (existeCorreo) {
      console.error('Error (409): El correo ya está registrado.');
      return res.status(409).json({ status: 'error', message: 'El correo ya está registrado.' });
    }

    const nuevoClienteData = {
      Tipo_Documento: TipoDocumento,
      Documento: Documento,
      Nombre: Nombre,
      Correo: Correo,
      Celular: Celular,
      F_Nacimiento: FechaNacimiento,
      Direccion: Direccion,
      Sexo: Sexo || null,
      Estado: Estado !== undefined ? Estado : true,
    };

    console.log('Backend: Intentando crear cliente con datos:', nuevoClienteData);

    const nuevoCliente = await Clientes.create(nuevoClienteData);
    console.log('Backend: Cliente creado exitosamente:', nuevoCliente);
    res.status(201).json({ status: 'success', data: nuevoCliente });

  } catch (err) {
    console.error('Backend: Error en crearCliente:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Ocurrió un error interno del servidor al crear cliente.' });
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Clientes.findAll();
    res.json({ status: 'success', data: clientes });
  } catch (err) {
    console.error('Backend: Error en listarClientes:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Error al listar clientes.' });
  }
};

exports.listarClientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Backend: Buscando cliente por Id_Cliente: ${id}`);
    const cliente = await Clientes.findOne({
      where: { Id_Cliente: id }
    });

    if (!cliente) {
      console.log(`Cliente con Id_Cliente ${id} no encontrado.`);
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }
    console.log(`Backend: Cliente encontrado por Id_Cliente: ${id}`);
    res.json({ status: 'success', data: cliente });
  } catch (err) {
    console.error('Backend: Error en listarClientePorId:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Error al buscar cliente por ID.' });
  }
};

exports.listarClientePorDocumento = async (req, res) => {
  try {
    const { documento } = req.params;
    console.log(`Backend: Buscando cliente por Documento: ${documento}`);
    const cliente = await Clientes.findOne({
      where: { Documento: documento }
    });

    if (!cliente) {
      console.log(`Cliente con Documento ${documento} no encontrado.`);
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }
    console.log(`Backend: Cliente encontrado por Documento: ${documento}`);
    res.json({ status: 'success', data: cliente });
  } catch (err) {
    console.error('Backend: Error en listarClientePorDocumento:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Error al buscar cliente por documento.' });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Backend: Actualizando cliente con Id_Cliente: ${id}. Datos:`, req.body);

    const cliente = await Clientes.findOne({ where: { Id_Cliente: id } });

    if (!cliente) {
      console.log(`Cliente con Id_Cliente ${id} no encontrado para actualizar.`);
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    const datosActualizados = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(datosActualizados, 'TipoDocumento')) {
        datosActualizados.Tipo_Documento = datosActualizados.TipoDocumento;
        delete datosActualizados.TipoDocumento;
    }
    if (Object.prototype.hasOwnProperty.call(datosActualizados, 'FechaNacimiento')) {
        datosActualizados.F_Nacimiento = datosActualizados.FechaNacimiento;
        delete datosActualizados.FechaNacimiento;
    }

    delete datosActualizados.Password;

    console.log('Backend: Datos que se usarán para actualizar:', datosActualizados);
    await Clientes.update(datosActualizados, { where: { Id_Cliente: id } });

    console.log(`Backend: Cliente ${id} actualizado exitosamente.`);
    res.json({ status: 'success', message: 'Cliente actualizado' });
  } catch (err) {
    console.error('Backend: Error en actualizarCliente:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Error al actualizar cliente.' });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Backend: Intentando eliminar (lógicamente) cliente con Id_Cliente: ${id}`);

    const cliente = await Clientes.findOne({ where: { Id_Cliente: id } });
    if (!cliente) {
      console.log(`Cliente con Id_Cliente ${id} no encontrado para eliminar.`);
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    cliente.Estado = false;
    await cliente.save();

    console.log(`Backend: Cliente ${id} deshabilitado (eliminado lógicamente) exitosamente.`);
    res.json({ status: 'success', message: 'Cliente deshabilitado correctamente' });

  } catch (err) {
    console.error('Backend: Error en eliminarCliente (soft delete):', err);
    res.status(500).json({ status: 'error', message: err.message || 'No se pudo deshabilitar el cliente.' });
  }
};

exports.buscarClientePorEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Backend: Buscando cliente por Correo: ${email}`);
    const cliente = await Clientes.findOne({ where: { Correo: email } });

    if (!cliente) {
      console.log(`Cliente con Correo ${email} no encontrado.`);
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }
    console.log(`Backend: Cliente encontrado por Correo: ${email}`);
    res.json({ status: 'success', data: cliente });
  } catch (err) {
    console.error('Backend: Error en buscarClientePorEmail:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Error al buscar cliente por email.' });
  }
};

exports.cambiarEstadoCliente = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Backend: Cambiando estado de cliente con Id_Cliente: ${id}`);
    const cliente = await Clientes.findByPk(id);
    if (!cliente) {
      console.log(`Cliente con Id_Cliente ${id} no encontrado para cambiar estado.`);
      return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
    }

    cliente.Estado = !cliente.Estado;
    await cliente.save();
    console.log(`Backend: Estado de cliente ${id} cambiado a ${cliente.Estado}.`);
    res.json({
      status: 'success',
      mensaje: `cliente ${cliente.Estado ? 'activado' : 'desactivado'} correctamente`,
      cliente
    });
  } catch (error) {
    console.error('Backend: Error en cambiarEstadoCliente:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error al cambiar estado del cliente.' });
  }
};
