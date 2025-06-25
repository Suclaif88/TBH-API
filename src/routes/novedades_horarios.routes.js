const { Router } = require('express');
const {
    crearNovedadHorario,
    obtenerNovedadesPorEmpleado,
    listarNovedadesHorarios,
    obtenerNovedadPorId,
    actualizarNovedadHorario,
    eliminarNovedadHorario,
    obtenerNovedadesPorFecha,
    obtenerNovedadesPorRangoFechas
} = require('../controllers/novedades_horarios.controller.js');

const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Novedades_Horarios'));
router.get("/test", (req, res) => {
  res.send("Ruta de novedades funcionando");
});
router.post('/', crearNovedadHorario);
router.get('/', listarNovedadesHorarios);
router.get('/:id', obtenerNovedadPorId);
router.put('/:id', actualizarNovedadHorario);
router.delete('/:id', eliminarNovedadHorario);
router.get('/empleado/:idEmpleado', obtenerNovedadesPorEmpleado);
router.get('/fecha/:fecha', obtenerNovedadesPorFecha);
router.get('/rango-fechas/:fechaInicio/:fechaFin', obtenerNovedadesPorRangoFechas);

module.exports = router;