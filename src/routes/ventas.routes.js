const { Router } = require('express');
const {
  listarVentas,
  obtenerVentaPorId,
  crearVenta,
  marcarVentaCompletada,
  anularVenta,
  validarStock,
  validarStockVenta,
  reporteVentasDiarias,
  reporteVentasMensuales,
  obtenerTallasProducto
} = require('../controllers/ventas.controller');
const verificarToken = require('../middleware/authMiddleware');
const autorizar = require('../middleware/checkPermission');

const router = Router();

router.use(verificarToken);
router.use(autorizar('Ventas'));

// Rutas principales de ventas
router.get('/', listarVentas);
router.get('/:id', obtenerVentaPorId);
router.post('/', crearVenta);
router.put('/:id/completar', marcarVentaCompletada);
router.put('/:id/anular', anularVenta);

// Rutas de validación
router.post('/validar-stock', validarStock);
router.post('/validar-stock-venta', validarStockVenta);
router.get('/producto/:Id_Productos/tallas', obtenerTallasProducto);

// Rutas de reportes
router.get('/reportes/diario', reporteVentasDiarias);
router.get('/reportes/mensual', reporteVentasMensuales);

module.exports = router;

/**
 *        _____                    _____                    _____          
         /\    \                  /\    \                  /\    \         
        /::\    \                /::\    \                /::\    \        
       /::::\    \              /::::\    \              /::::\    \       
      /::::::\    \            /::::::\    \            /::::::\    \      
     /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \     
    /:::/__\:::\    \        /:::/__\:::\    \        /:::/  \:::\    \    
    \:::\   \:::\    \      /::::\   \:::\    \      /:::/    \:::\    \   
  ___\:::\   \:::\    \    /::::::\   \:::\    \    /:::/    / \:::\    \  
 /\   \:::\   \:::\    \  /:::/\:::\   \:::\____\  /:::/    /   \:::\ ___\ 
/::\   \:::\   \:::\____\/:::/  \:::\   \:::|    |/:::/____/     \:::|    |
\:::\   \:::\   \::/    /\::/   |::::\  /:::|____|\:::\    \     /:::|____|
 \:::\   \:::\   \/____/  \/____|:::::\/:::/    /  \:::\    \   /:::/    / 
  \:::\   \:::\    \            |:::::::::/    /    \:::\    \ /:::/    /  
   \:::\   \:::\____\           |::|\::::/    /      \:::\    /:::/    /   
    \:::\  /:::/    /           |::| \::/____/        \:::\  /:::/    /    
     \:::\/:::/    /            |::|  ~|               \:::\/:::/    /     
      \::::::/    /             |::|   |                \::::::/    /      
       \::::/    /              \::|   |                 \::::/    /       
        \::/    /                \:|   |                  \::/____/        
         \/____/                  \|___|                   ~~              
                                                                           
 */