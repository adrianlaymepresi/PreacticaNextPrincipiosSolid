# 💰 Sistema de Cálculo de Precios - Documentación

## 📊 Cómo Funciona el Cálculo de Precios

El sistema calcula automáticamente el **precio de venta final** basándose en tres componentes:

### 1️⃣ Precio de Adquisición
Es el precio al cual el supermercado compra el producto (costo).

### 2️⃣ Ganancia del 20%
El supermercado agrega un 20% de margen de ganancia sobre el precio de adquisición.

```
Precio con ganancia = Precio de adquisición × 1.20
```

### 3️⃣ Impuesto (IVA) según Categoría
Cada categoría tiene un porcentaje de IVA diferente:

| Categoría | IVA | Justificación |
|-----------|-----|---------------|
| 🥗 Alimentos | 5% | IVA reducido para productos básicos |
| 📱 Electrónicos | 19% | IVA estándar |
| 👕 Ropa | 10% | IVA intermedio |

---

## 🧮 Fórmula de Cálculo

### Fórmula General:
```
Precio Final = Precio de Adquisición × 1.20 × (1 + Tasa de IVA)
```

### Ejemplos Prácticos:

#### Ejemplo 1: Producto Alimenticio
```
Producto: Leche
Precio de adquisición: $2,500

Cálculo:
1. Precio con ganancia = $2,500 × 1.20 = $3,000
2. IVA (5%) = $3,000 × 0.05 = $150
3. Precio final = $3,000 + $150 = $3,150
```

#### Ejemplo 2: Producto Electrónico
```
Producto: Celular
Precio de adquisición: $600,000

Cálculo:
1. Precio con ganancia = $600,000 × 1.20 = $720,000
2. IVA (19%) = $720,000 × 0.19 = $136,800
3. Precio final = $720,000 + $136,800 = $856,800

Nota: Si tiene garantía extendida (>12 meses), se aplica 5% adicional
```

#### Ejemplo 3: Ropa
```
Producto: Camiseta
Precio de adquisición: $25,000

Cálculo:
1. Precio con ganancia = $25,000 × 1.20 = $30,000
2. IVA (10%) = $30,000 × 0.10 = $3,000
3. Precio final = $30,000 + $3,000 = $33,000
```

---

## 🎯 Demostrando Principios SOLID

### Open/Closed Principle (OCP)
Cada tipo de producto implementa su propio cálculo de precio:

```typescript
// Clase abstracta Product (CERRADA para modificación)
abstract class Product {
  abstract calculatePrice(): number;
  abstract getTaxRate(): number;
  
  protected calculateBaseWithProfit(): number {
    return this.acquisitionPrice * 1.20;
  }
}

// Clases derivadas (ABIERTAS para extensión)
class FoodProduct extends Product {
  private static readonly TAX_RATE = 0.05;
  
  calculatePrice(): number {
    let price = this.calculateBaseWithProfit();
    price = price * (1 + FoodProduct.TAX_RATE);
    
    // Lógica especial: descuento por vencimiento
    if (expiringSoon) {
      price = price * 0.7; // 30% descuento
    }
    
    return Math.round(price);
  }
}

class ElectronicProduct extends Product {
  private static readonly TAX_RATE = 0.19;
  
  calculatePrice(): number {
    let price = this.calculateBaseWithProfit();
    price = price * (1 + ElectronicProduct.TAX_RATE);
    
    // Lógica especial: recargo por garantía extendida
    if (this.warrantyMonths > 12) {
      price = price * 1.05;
    }
    
    return Math.round(price);
  }
}
```

### Liskov Substitution Principle (LSP)
Todos los productos son intercambiables:

```typescript
// Funciona con cualquier tipo de Product
function calculateTotalPrice(products: Product[]): number {
  return products.reduce((total, product) => 
    total + product.calculatePrice(), 0
  );
}

// Uso:
const products = [
  new FoodProduct('1', 'Leche', 2500),
  new ElectronicProduct('2', 'Celular', 600000),
  new ClothingProduct('3', 'Camiseta', 25000)
];

const total = calculateTotalPrice(products); // ✅ Funciona!
```

---

## 📈 Caso Especiales

### Alimentos Próximos a Vencer
Los productos alimenticios con fecha de vencimiento menor a 3 días reciben **30% de descuento** adicional:

```
Producto: Pan (vence en 2 días)
Precio de adquisición: $1,800

Cálculo normal:
1. Precio con ganancia = $1,800 × 1.20 = $2,160
2. Con IVA (5%) = $2,160 × 1.05 = $2,268

Descuento aplicado:
3. Precio final = $2,268 × 0.70 = $1,588 (30% descuento)
```

### Electrónicos con Garantía Extendida
Productos con garantía mayor a 12 meses tienen **5% de recargo** adicional:

```
Producto: Laptop con 24 meses de garantía
Precio de adquisición: $1,000,000

Cálculo:
1. Precio con ganancia = $1,000,000 × 1.20 = $1,200,000
2. Con IVA (19%) = $1,200,000 × 1.19 = $1,428,000
3. Recargo garantía (5%) = $1,428,000 × 1.05 = $1,499,400
```

---

## 🖥️ Interfaz de Usuario

### Agregar Nuevo Producto

1. **Clic en "➕ Nuevo Producto"**
2. **Llenar el formulario:**
   - Nombre del producto (obligatorio)
   - Precio de adquisición (obligatorio)
   - Categoría (obligatorio)
   - Campos específicos según categoría:
     - **Alimentos:** Fecha de vencimiento (opcional)
     - **Electrónicos:** Marca y meses de garantía
     - **Ropa:** Talla y material

3. **Vista previa del cálculo:**
   El formulario muestra en tiempo real:
   - Precio de adquisición
   - Ganancia del 20%
   - Impuesto según categoría
   - **Precio final de venta**

4. **Guardar el producto**
   El producto se agrega al catálogo y está disponible para venta inmediatamente.

---

## 📊 Desglose Visual en ProductCard

Cada producto muestra:

```
┌─────────────────────────────────┐
│  Nombre del Producto            │
│  Categoría: Electrónicos        │
│                                 │
│  💵 Adquisición: $600,000       │
│  + Ganancia (20%): $120,000     │
│  + Impuesto (19%): $136,800     │
│  ────────────────────────────   │
│  💰 Precio Final: $856,800      │
│                                 │
│  [Agregar al carrito]           │
└─────────────────────────────────┘
```

---

## 🔧 Extensibilidad

### Agregar Nueva Categoría de Producto

Para agregar una nueva categoría (ej: Libros con IVA 0%):

```typescript
// 1. Crear nueva clase
class BookProduct extends Product {
  private static readonly TAX_RATE = 0.00; // Sin IVA
  
  getTaxRate(): number {
    return BookProduct.TAX_RATE;
  }
  
  calculatePrice(): number {
    let price = this.calculateBaseWithProfit();
    price = price * (1 + BookProduct.TAX_RATE);
    return Math.round(price);
  }
}

// 2. Agregar al formulario en page.tsx
<option value="Libros">Libros (IVA 0%)</option>

// 3. Agregar lógica en handleAddProduct
else if (category === 'Libros') {
  productService.addProduct(
    new BookProduct(id, productName, price)
  );
}
```

✅ **Sin modificar código existente** (Open/Closed Principle)

---

## 💡 Beneficios del Sistema

1. ✅ **Transparencia:** Clientes ven cómo se calcula el precio
2. ✅ **Flexibilidad:** Fácil cambiar porcentajes de ganancia o impuestos
3. ✅ **Escalabilidad:** Agregar nuevas categorías sin modificar código existente
4. ✅ **Mantenibilidad:** Cada categoría maneja su propia lógica
5. ✅ **Consistencia:** Todos los productos siguen la misma estructura

---

## 🎓 Principios SOLID Aplicados

| Principio | Cómo se Aplica |
|-----------|----------------|
| **SRP** | Cada clase de producto calcula solo su precio |
| **OCP** | Agregar nuevas categorías sin modificar existentes |
| **LSP** | Todos los productos son intercambiables |
| **ISP** | (Ver sistema de aves) |
| **DIP** | ProductService usa IProductRepository (abstracción) |

---

## 📱 Capturas de Pantalla del Flujo

### 1. Vista del Catálogo
Muestra todos los productos con su desglose de precios.

### 2. Formulario de Nuevo Producto
- Campos obligatorios: Nombre, Precio de Adquisición, Categoría
- Campos específicos según categoría
- Vista previa en tiempo real del precio final

### 3. Producto Agregado
El nuevo producto aparece inmediatamente en el catálogo con toda su información de precio.

---

## 🚀 Flujo Completo

```
Usuario ingresa producto
        ↓
Selecciona categoría
        ↓
Sistema muestra campos específicos
        ↓
Usuario ingresa precio de adquisición
        ↓
Sistema calcula en tiempo real:
  • Precio + 20% ganancia
  • + IVA según categoría
  • = Precio final
        ↓
Usuario guarda producto
        ↓
Producto disponible en catálogo
        ↓
Cliente puede agregarlo al carrito
        ↓
Sistema calcula total de venta
```

---

## 📝 Notas Importantes

- Todos los precios se redondean al peso más cercano
- El cálculo es automático y consistente
- Los descuentos especiales (vencimiento, garantía) se aplican automáticamente
- El sistema es extensible para agregar más reglas de negocio

---

¡Ahora tienes un sistema completo de gestión de precios que demuestra principios SOLID en acción! 🎉
