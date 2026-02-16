# 🎯 GUÍA RÁPIDA: Dónde Encontrar Cada Principio SOLID

## 📍 Mapa de Ubicación de Principios

### 1️⃣ Single Responsibility Principle (SRP)
**"Cada clase tiene una única responsabilidad"**

#### Archivos que demuestran SRP:

**✅ src/models/ParkingRecord.ts**
```
Responsabilidad: Representar un registro de estacionamiento
- Maneja solo los datos y cálculos básicos de un registro
- No se encarga de persistencia ni lógica de negocio compleja
```

**✅ src/services/ProductService.ts**
```
Responsabilidad: Gestionar la lógica de negocio de productos
- Solo maneja operaciones con productos
- No calcula precios complejos (eso es PriceCalculator)
- No maneja persistencia directamente (usa repositorio)
```

**✅ src/services/ParkingService.ts**
```
Responsabilidad: Gestionar la lógica de negocio de estacionamiento
- Solo maneja operaciones de estacionamiento
- Delega el cálculo de tarifas a las estrategias
- Delega la persistencia al repositorio
```

**✅ src/services/PriceCalculator.ts**
```
Responsabilidad: Calcular precios con descuentos y impuestos
- Solo se encarga de cálculos de precios
- No gestiona productos ni inventario
```

---

### 2️⃣ Open/Closed Principle (OCP)
**"Abierto para extensión, cerrado para modificación"**

#### Archivos que demuestran OCP:

**✅ src/models/Product.ts (Clase Abstracta)**
```
- Define el contrato base
- Permite extender con nuevos tipos de productos SIN modificar esta clase
- Método abstracto calculatePrice() debe ser implementado por subclases
```

**✅ src/models/FoodProduct.ts**
**✅ src/models/ElectronicProduct.ts**
**✅ src/models/ClothingProduct.ts**
```
- Extensiones de Product
- Cada uno implementa su propia lógica de calculatePrice()
- Puedes agregar nuevos tipos (ej: BookProduct) sin modificar los existentes
```

**✅ src/interfaces/IParkingRateStrategy.ts**
```
- Interface para estrategias de tarifa
- Permite agregar nuevas estrategias sin modificar código existente
```

**✅ src/strategies/ParkingRateStrategies.ts**
```
- StandardRateStrategy: Tarifa estándar
- WeekendRateStrategy: Tarifa de fin de semana
- VIPRateStrategy: Tarifa gratuita para VIP
- ¡Puedes agregar más estrategias sin modificar las existentes!
```

---

### 3️⃣ Liskov Substitution Principle (LSP)
**"Las subclases deben poder sustituir a sus clases base"**

#### Archivos que demuestran LSP:

**✅ src/models/Product.ts + sus subclases**
```
- FoodProduct puede sustituir a Product ✓
- ElectronicProduct puede sustituir a Product ✓
- ClothingProduct puede sustituir a Product ✓
- Todas implementan calculatePrice() de forma consistente
```

**Ver en acción en src/services/ProductService.ts:**
```typescript
calculateTotalPrice(productIds: string[]): number {
  let total = 0;
  for (const id of productIds) {
    const product = this.productRepository.getById(id); // Puede ser cualquier tipo
    if (product) {
      total += product.calculatePrice(); // LSP: funciona con cualquier Product
    }
  }
  return total;
}
```

---

### 4️⃣ Interface Segregation Principle (ISP)
**"No obligar a implementar interfaces que no se usan"**

#### Archivos que demuestran ISP:

**✅ src/interfaces/BirdInterfaces.ts**
```
En lugar de:
interface Bird {
  fly();   // ❌ No todas las aves vuelan
  swim();  // ❌ No todas las aves nadan
  run();   // ❌ No todas las aves corren
}

Segregamos en:
interface IFlyable { fly(); }
interface ISwimmable { swim(); }
interface IRunnable { run(); }
```

**✅ src/models/birds/Eagle.ts**
```
class Eagle implements IFlyable, IRunnable
- Implementa solo lo que necesita
- NO implementa ISwimmable (las águilas no nadan)
```

**✅ src/models/birds/Penguin.ts**
```
class Penguin implements ISwimmable, IRunnable
- Implementa solo lo que necesita
- NO implementa IFlyable (los pingüinos no vuelan)
```

**✅ src/models/birds/Ostrich.ts**
```
class Ostrich implements IRunnable
- Implementa solo lo que necesita
- NO implementa IFlyable ni ISwimmable
```

**✅ src/models/birds/Duck.ts**
```
class Duck implements IFlyable, ISwimmable, IRunnable
- El pato es versátil: implementa todas las interfaces
```

---

### 5️⃣ Dependency Inversion Principle (DIP)
**"Depender de abstracciones, no de implementaciones concretas"**

#### Archivos que demuestran DIP:

**✅ src/interfaces/IProductRepository.ts**
**✅ src/interfaces/IParkingRepository.ts**
```
Abstracciones (interfaces) que definen el contrato
- Las clases de alto nivel dependen de estas interfaces
- NO dependen de implementaciones concretas
```

**✅ src/repositories/InMemoryProductRepository.ts**
**✅ src/repositories/InMemoryParkingRepository.ts**
```
Implementaciones concretas de las interfaces
- Pueden ser reemplazadas (ej: por DatabaseRepository)
- Sin afectar las clases que las usan
```

**✅ src/services/ProductService.ts**
```typescript
export class ProductService {
  // ✅ Depende de IProductRepository (abstracción)
  // ❌ NO depende de InMemoryProductRepository (implementación)
  constructor(private productRepository: IProductRepository) {}
}
```

**✅ src/services/ParkingService.ts**
```typescript
export class ParkingService {
  // ✅ Depende de abstracciones
  constructor(
    private parkingRepository: IParkingRepository,
    private rateStrategy: IParkingRateStrategy
  ) {}
}
```

**✅ src/container.ts**
```
Inyección de dependencias centralizada
- Aquí se configuran las dependencias concretas
- Cambiar una implementación solo requiere modificar este archivo
```

---

## 🎓 Ejemplo de Código por Principio

### SRP - Ejemplo Práctico
```typescript
// ❌ MALO: Una clase hace demasiado
class Product {
  calculatePrice() { }
  saveToDatabase() { }  // ¡Otra responsabilidad!
  sendEmail() { }       // ¡Otra más!
}

// ✅ BUENO: Cada clase una responsabilidad
class Product {
  calculatePrice() { }
}
class ProductRepository {
  saveToDatabase() { }
}
class EmailService {
  sendEmail() { }
}
```

### OCP - Ejemplo Práctico
```typescript
// ✅ BUENO: Extensible sin modificar
abstract class Product {
  abstract calculatePrice(): number;
}

// Para agregar nuevo tipo, solo extiendes
class NewProduct extends Product {
  calculatePrice(): number {
    return this.basePrice * 0.8;
  }
}
```

### LSP - Ejemplo Práctico
```typescript
// ✅ Cualquier Product puede ser usado aquí
function processProduct(product: Product) {
  const price = product.calculatePrice();
  // Funciona con FoodProduct, ElectronicProduct, etc.
}
```

### ISP - Ejemplo Práctico
```typescript
// ❌ MALO
interface Bird {
  fly();
  swim();  // No todas las aves nadan
}

// ✅ BUENO
interface IFlyable { fly(); }
interface ISwimmable { swim(); }

class Penguin implements ISwimmable {
  swim() { } // Solo implementa lo que necesita
}
```

### DIP - Ejemplo Práctico
```typescript
// ❌ MALO: Depende de implementación concreta
class Service {
  constructor(private repo: InMemoryRepository) { }
}

// ✅ BUENO: Depende de abstracción
class Service {
  constructor(private repo: IRepository) { }
}
```

---

## 🔍 Cómo Navegar el Código

1. **Para ver SRP:** Mira cómo cada servicio tiene una responsabilidad clara
2. **Para ver OCP:** Mira Product.ts y sus extensiones
3. **Para ver LSP:** Mira ProductService.ts y cómo usa cualquier Product
4. **Para ver ISP:** Mira la carpeta birds/ y BirdInterfaces.ts
5. **Para ver DIP:** Mira container.ts y los constructores de servicios

---

## 📚 Orden Recomendado de Estudio

1. **Primero:** Lee README.md para contexto general
2. **Segundo:** Estudia src/models/Product.ts (OCP + LSP)
3. **Tercero:** Estudia src/interfaces/BirdInterfaces.ts (ISP)
4. **Cuarto:** Estudia src/services/ (SRP + DIP)
5. **Quinto:** Estudia src/container.ts (DIP en acción)
6. **Finalmente:** Explora la aplicación en el navegador

---

## 💡 Preguntas para Reflexionar

1. ¿Qué pasaría si quisieras agregar un nuevo tipo de producto?
   → **Respuesta:** Solo creas una nueva clase que extienda Product (OCP)

2. ¿Cómo cambiarías de InMemoryRepository a DatabaseRepository?
   → **Respuesta:** Solo modificas container.ts (DIP)

3. ¿Por qué el Pingüino no implementa IFlyable?
   → **Respuesta:** Porque no vuela, evitamos métodos innecesarios (ISP)

4. ¿Por qué ProductService no calcula descuentos complejos?
   → **Respuesta:** Esa es la responsabilidad de PriceCalculator (SRP)

5. ¿Puedes reemplazar FoodProduct por Product en el código?
   → **Respuesta:** Sí, gracias a LSP, cualquier Product funciona igual
