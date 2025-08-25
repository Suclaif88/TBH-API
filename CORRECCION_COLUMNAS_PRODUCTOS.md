# Corrección: Error de Columnas Inexistentes en Tabla Productos

## Problema Identificado

El código estaba intentando acceder a las columnas `Es_Perfume` y `Es_Ropa` en la tabla `Productos`, pero estas columnas no existen en la base de datos, causando el error:

```
Unknown column 'Es_Perfume' in 'field list'
```

## Causa del Problema

El código asumía que la tabla `Productos` tenía columnas para identificar el tipo de producto:
- `Es_Perfume`: Para identificar productos de perfume
- `Es_Ropa`: Para identificar productos de ropa

Sin embargo, estas columnas no existen en la estructura actual de la base de datos.

## Solución Implementada

### 1. Eliminación de Columnas Inexistentes

Se removieron las columnas inexistentes de las consultas:

```javascript
// ANTES (causaba error)
const producto = await Productos.findByPk(item.Id_Productos, { 
  transaction: t,
  attributes: ['Id_Productos', 'Nombre', 'Es_Perfume', 'Es_Ropa', 'Precio']
});

// DESPUÉS (funciona correctamente)
const producto = await Productos.findByPk(item.Id_Productos, { 
  transaction: t,
  attributes: ['Id_Productos', 'Nombre', 'Precio']
});
```

### 2. Nueva Lógica de Detección de Tipo de Producto

En lugar de usar columnas de la base de datos, ahora se determina el tipo de producto basándose en los datos recibidos:

```javascript
// Determinar tipo de producto basado en los datos recibidos
if (tamanos && tamanos.length > 0) {
  // Producto con tamaños (perfumes)
  console.log('Producto con tamaños, calculando por tamaños');
  // ... lógica para tamaños
} else if (tallas && tallas.length > 0) {
  // Producto con tallas (ropa)
  console.log('Producto con tallas, calculando por tallas');
  // ... lógica para tallas
} else {
  // Producto normal: precio base
  console.log('Producto normal, usando precio base');
  // ... lógica para productos normales
}
```

## Ventajas de la Nueva Aproximación

1. **No depende de columnas específicas**: La lógica funciona independientemente de la estructura de la base de datos
2. **Más flexible**: Se adapta automáticamente según los datos recibidos
3. **Menos propenso a errores**: No hay riesgo de columnas inexistentes
4. **Lógica clara**: El tipo de producto se determina por los datos que realmente se están procesando

## Resultado Esperado

Para el producto 14 con tamaños:
```json
{
  "tamanos": [
    {
      "nombre": "Pequeño",
      "PrecioTamano": 1000,
      "Cantidad": 2
    },
    {
      "nombre": "Grande",
      "PrecioTamano": 35000,
      "Cantidad": 2
    }
  ]
}
```

**Cálculo esperado:**
- Pequeño: 1000 × 2 = 2,000
- Grande: 35000 × 2 = 70,000
- **Total**: 72,000

## Logs Esperados

```
Producto encontrado: { Id_Productos: 14, Nombre: 'La perra de nando color negro', Precio: 72000 }
Producto con tamaños, calculando por tamaños
Procesando tamaño: { nombre: 'Pequeño', PrecioTamano: 1000, Cantidad: 2 }
Sumando 2000 del tamaño Pequeño (1000 × 2)
Procesando tamaño: { nombre: 'Grande', PrecioTamano: 35000, Cantidad: 2 }
Sumando 70000 del tamaño Grande (35000 × 2)
Precio total calculado: 72000
```

## Archivos Modificados

- `src/controllers/ventas.controller.js`: 
  - Función `crearVenta` (consulta de producto)
  - Función `calcularPrecio` (lógica de detección de tipo)

## Próximos Pasos

1. **Probar creación de venta**: Crear una nueva venta con el producto 14
2. **Verificar cálculo**: Confirmar que el total sea 72,000
3. **Validar guardado**: Asegurar que los datos se guarden correctamente
4. **Probar recuperación**: Verificar que `obtenerVentaPorId` muestre los tamaños
