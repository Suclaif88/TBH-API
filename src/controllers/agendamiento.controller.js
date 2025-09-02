// controllers/agendamiento.controller.js - CORREGIDO:
const { Agendamientos, Agendamiento_Servicios, Servicios, Empleados } = require('../models');
const { sequelize } = require("../config/db");

// Función para crear agendamientos con múltiples servicios
exports.crearAgendamientos = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { Id_Cliente, Id_Empleados, Fecha, serviciosAgendados } = req.body;
        
        // 1. Crear el agendamiento principal
        const nuevoAgendamiento = await Agendamientos.create({
            Id_Cliente,
            Id_Empleados,
            Fecha,
            Subtotal: 0, // Se actualizará al final
            Estado: 'Programado',
        }, { transaction: t });

        // 2. Inserción de servicios en la tabla de unión y cálculo de subtotal
        let subtotal = 0;
        for (const servicio of serviciosAgendados) {
            await Agendamiento_Servicios.create({
                Id_Agendamientos: nuevoAgendamiento.Id_Agendamientos,
                Id_Servicios: servicio.Id_Servicios,
                Precio: servicio.Precio
            }, { transaction: t });
            subtotal += servicio.Precio;
        }

        // 3. Actualizar el subtotal
        await nuevoAgendamiento.update({ Subtotal: subtotal }, { transaction: t });

        await t.commit();
        res.status(201).json({ status: 'success', data: nuevoAgendamiento });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Función para obtener agendamientos por fecha
exports.obtenerAgendamientosPorFecha = async (req, res) => {
    try {
        const { fecha } = req.params;
        const agendamientos = await Agendamientos.findAll({
            where: { Fecha: fecha },
            include: [{
                model: Empleados,
                as: 'Id_Empleados_Empleado'
            }, {
                model: Clientes, // ✅ Añadir la inclusión de Clientes
                as: 'Id_Cliente_Cliente' // Usa el alias que hayas definido
            }, {
                model: Agendamiento_Servicios,
                as: 'Agendamiento_Servicio',
                include: [{
                    model: Servicios,
                    as: 'Id_Servicios_Servicio'
                }]
            }]
        });
        res.json({ status: 'success', data: agendamientos });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.obtenerAgendamientosPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const agendamiento = await Agendamientos.findByPk(id); // ✅ Variable corregida

        if (!agendamiento) {
            return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
        }

        res.json({ status: 'success', data: agendamiento }); // ✅ 'agendamiento' no 'insumo'
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.eliminarAgendamientos = async (req, res) => {
    try {
        const { id } = req.params;
        const agendamiento = await Agendamientos.findOne({ 
            where: { Id_Agendamientos: id } // ✅ Parámetro corregido
        });

        if (!agendamiento) {
            return res.status(404).json({ status: 'error', message: 'Agendamiento no encontrado' });
        }

        await agendamiento.destroy();
        res.json({ status: 'success', message: 'Agendamiento eliminado' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};