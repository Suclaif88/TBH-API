# Corrección: Cálculo de Precios para Perfumes con Múltiples Tamaños

## Problema Identificado

El cálculo de precios para perfumes con múltiples tamaños no estaba considerando correctamente las cantidades de cada tamaño. El código estaba sumando los `PrecioTotal` que venían del frontend sin verificar si estaban calculados correctamente.

## Ejemplo del Problema

**Datos de entrada:**
- 2 de Grande (PrecioTamano: 5000, Cantidad: 2)
- 2 de Pequeño (PrecioTamano: 2000, Cantidad: 2)

**Cálculo incorrecto anterior:**
- Sumaba `PrecioTotal` directamente sin verificar
- Resultado: Incorrecto

**Cálculo correcto:**
- Grande: 5000 × 2 = 10,000
- Pequeño: 2000 × 2 = 4,000
- **Total correcto**: 14,000

## Corrección Implementada

### 1. Cálculo Principal

```javascript
if (producto.Es_Perfume && tamanos && tamanos.length > 0) {
  console.log('Producto es perfume, calculando por tamaños');
  for (const tamano of tamanos) {
    console.log('Procesando tamaño:', tamano);
    
    // Calcular precio del tamaño: PrecioTamano × Cantidad
    const precioTamaño = Number(tamano.PrecioTamano || 0) * Number(tamano.Cantidad || 0);
    precioTotal += precioTamaño;
    console.log(`Sumando ${precioTamaño} del tamaño ${tamano.nombre} (${tamano.PrecioTamano} × ${tamano.Cantidad})`);
  }
}
```

### 2. Lógica de Fallback Mejorada

```javascript
// Si el precio calculado es 0 o NaN, recalcular usando PrecioTamano × Cantidad
if (!precioTotal || isNaN(precioTotal)) {
  console.log('Precio calculado es inválido, recalculando...');
  if (tamanos && tamanos.length > 0) {
    precioTotal = tamanos.reduce((sum, tamano) => {
      const precioTamaño = Number(tamano.PrecioTamano || 0) * Number(tamano.Cantidad || 0);
      console.log(`Recalculando: ${tamano.nombre} = ${tamano.PrecioTamano} × ${tamano.Cantidad} = ${precioTamaño}`);
      return sum + precioTamaño;
    }, 0);
    console.log('Precio recalculado desde tamaños:', precioTotal);
  }
}
```

## Cambios Clave

1. **Uso de `PrecioTamano` en lugar de `PrecioTotal`**: Ahora usamos el precio unitario del tamaño y lo multiplicamos por la cantidad
2. **Cálculo explícito**: `PrecioTamano × Cantidad` para cada tamaño
3. **Logs detallados**: Para rastrear cada cálculo individual
4. **Consistencia**: La misma lógica se aplica tanto en el cálculo principal como en el fallback

## Resultado Esperado

Para el ejemplo con datos:
```json
{
  "tamanos": [
    {
      "nombre": "Grande",
      "PrecioTamano": 5000,
      "Cantidad": 2
    },
    {
      "nombre": "Pequeño", 
      "PrecioTamano": 2000,
      "Cantidad": 2
    }
  ]
}
```

**Cálculo esperado:**
- Grande: 5000 × 2 = 10,000
- Pequeño: 2000 × 2 = 4,000
- **Total**: 14,000

## Logs Esperados

```
Producto es perfume, calculando por tamaños
Procesando tamaño: { nombre: 'Grande', PrecioTamano: 5000, Cantidad: 2 }
Sumando 10000 del tamaño Grande (5000 × 2)
Procesando tamaño: { nombre: 'Pequeño', PrecioTamano: 2000, Cantidad: 2 }
Sumando 4000 del tamaño Pequeño (2000 × 2)
Precio total calculado: 14000
```

## Archivos Modificados

- `src/controllers/ventas.controller.js`: Función `calcularPrecio`

## Próximos Pasos

1. **Probar con datos reales**: Crear una venta con múltiples tamaños
2. **Verificar cálculos**: Confirmar que los totales sean correctos
3. **Validar guardado**: Asegurar que los datos se guarden correctamente
4. **Probar recuperación**: Verificar que `obtenerVentaPorId` muestre los tamaños
