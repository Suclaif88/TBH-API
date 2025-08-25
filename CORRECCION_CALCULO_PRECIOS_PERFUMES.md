# Corrección: Cálculo de Precios para Perfumes y Guardado de Datos

## Problemas Identificados

1. **Producto no detectado como perfume**: El producto con ID 14 no se estaba detectando como `Es_Perfume = true`
2. **Datos no guardados**: `Tallas_Data` y `Tamanos_Data` se guardaban como `undefined`
3. **Cálculo de precio incorrecto**: Para perfumes con tamaños, el precio no se calculaba correctamente
4. **Total no coincidente**: El total calculado no coincidía con los precios de los tamaños

## Correcciones Implementadas

### 1. Logs de Depuración Mejorados

Se agregaron logs detallados para identificar el problema:

```javascript
console.log('Producto encontrado:', {
  Id_Productos: producto.Id_Productos,
  Nombre: producto.Nombre,
  Es_Perfume: producto.Es_Perfume,
  Es_Ropa: producto.Es_Ropa,
  Precio: producto.Precio
});

console.log('Propiedades del producto:', {
  Es_Perfume: producto.Es_Perfume,
  Es_Ropa: producto.Es_Ropa,
  Precio: producto.Precio
});
```

### 2. Corrección del Guardado de Datos

Se corrigió la lógica de guardado para evitar `undefined`:

```javascript
// Verificar que los arrays no sean undefined antes de hacer JSON.stringify
const tallasData = tallasParaGuardar && tallasParaGuardar.length > 0 ? JSON.stringify(tallasParaGuardar) : null;
const tamanosData = tamanosParaGuardar && tamanosParaGuardar.length > 0 ? JSON.stringify(tamanosParaGuardar) : null;

console.log('Tallas_Data a guardar:', tallasData);
console.log('Tamanos_Data a guardar:', tamanosData);
```

### 3. Lógica de Cálculo de Precios

La lógica para perfumes con tamaños:

```javascript
if (producto.Es_Perfume && tamanos && tamanos.length > 0) {
  // Para perfumes: usar el precio que viene del frontend
  console.log('Producto es perfume, calculando por tamaños');
  for (const tamano of tamanos) {
    console.log('Procesando tamaño:', tamano);
    // Usar el precio que viene del frontend
    if (tamano.PrecioTotal) {
      precioTotal += Number(tamano.PrecioTotal);
    } else {
      // Fallback: buscar en base de datos
      const tamanoInfo = await Tamano.findOne({
        where: { Nombre: tamano.nombre },
        transaction
      });
      
      if (tamanoInfo) {
        precioTotal += tamanoInfo.Precio_Venta * tamano.Cantidad;
      }
    }
  }
}
```

## Resultado Esperado

Después de estas correcciones:

1. **Detección correcta**: El producto se detectará como perfume si `Es_Perfume = true`
2. **Cálculo correcto**: Para el producto con tamaños `[Pequeño: 1000, Grande: 35000]`, el total debería ser `36000`
3. **Guardado exitoso**: `Tamanos_Data` se guardará como JSON válido
4. **Recuperación correcta**: `obtenerVentaPorId` mostrará los tamaños correctamente

## Próximos Pasos

1. **Probar creación de venta**: Crear una nueva venta con el producto 14
2. **Verificar logs**: Confirmar que se detecte como perfume y calcule correctamente
3. **Validar guardado**: Verificar que `Tamanos_Data` no sea `NULL` en la base de datos
4. **Probar recuperación**: Usar `obtenerVentaPorId` para confirmar que los tamaños se muestren

## Datos de Prueba

Para el producto 14 con tamaños:
- Pequeño: Cantidad 2, PrecioTotal 1000
- Grande: Cantidad 2, PrecioTotal 35000
- **Total esperado**: 36000

## Archivos Modificados

- `src/controllers/ventas.controller.js`: Método `crearVenta` y `calcularPrecio`
