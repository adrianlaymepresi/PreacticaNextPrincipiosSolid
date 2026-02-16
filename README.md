# 🏗️ Sistema de Gestión SOLID - Guía de Estudio

Sistema que implementa los 5 principios SOLID con ejemplos prácticos de productos, estacionamiento y aves.

---

## 📚 PRINCIPIOS SOLID IMPLEMENTADOS

### 1️⃣ **SRP - Single Responsibility Principle** (Responsabilidad Única)
**Concepto**: Cada clase debe tener una única razón para cambiar, es decir, una sola responsabilidad.

**Implementación en el código**:

- **`src/models/Product.ts`**: Solo gestiona datos y comportamiento base de productos (nombre, precio, categoría).
  
- **`src/services/PriceCalculator.ts`**: Responsabilidad única de calcular descuentos y totales. NO calcula impuestos de productos específicos.
  
- **`src/services/ProductService.ts`**: Solo maneja la lógica de negocio (obtener, agregar, calcular totales). NO se encarga de persistencia.
  
- **`src/services/ParkingService.ts`**: Solo gestiona lógica de estacionamiento (registros, tarifas). NO calcula las tarifas directamente.
  
- **`src/repositories/JsonProductRepository.ts`**: Solo maneja persistencia en JSON. NO contiene lógica de negocio.
  
- **`src/repositories/JsonParkingRepository.ts`**: Solo maneja almacenamiento de registros de parking.
  
- **`src/models/ParkingRecord.ts`**: Solo representa un registro de estacionamiento con su información.

**Ejemplo práctico**: Si necesitas cambiar cómo se calculan los descuentos, solo modificas `PriceCalculator.ts`. Si cambias la persistencia de JSON a SQL, solo modificas el repositorio.

---

### 2️⃣ **OCP - Open/Closed Principle** (Abierto/Cerrado)
**Concepto**: Las clases deben estar abiertas para extensión pero cerradas para modificación.

**Implementación en el código**:

- **`src/models/Product.ts`**: Clase abstracta que permite crear nuevos tipos de productos SIN modificar el código existente.
  ```typescript
  abstract class Product {
    abstract calculatePrice(): number;
    abstract getTaxRate(): number;
  }
  ```

- **`src/models/FoodProduct.ts`**: Extiende `Product` con lógica específica (descuento por vencimiento). NO modifica la clase base.
  
- **`src/models/ElectronicProduct.ts`**: Extiende `Product` con su propio cálculo de impuestos (19%). NO modifica la clase base.
  
- **`src/models/ClothingProduct.ts`**: Extiende `Product` con impuesto del 10%. NO modifica la clase base.

- **`src/interfaces/IParkingRateStrategy.ts`**: Define contrato para estrategias de tarifas.
  
- **`src/strategies/ParkingRateStrategies.ts`**: 
  - `StandardRateStrategy`: $10/hora
  - `WeekendRateStrategy`: $8/hora  
  - `VIPRateStrategy`: Gratis
  
  Puedes agregar nuevas estrategias (ej: `HolidayRateStrategy`) SIN tocar las existentes.

**Ejemplo práctico**: Para agregar un producto nuevo (ej: `BookProduct`), solo creas una nueva clase que extienda `Product`. NO modificas ningún código existente.

---

### 3️⃣ **LSP - Liskov Substitution Principle** (Sustitución de Liskov)
**Concepto**: Los objetos de una clase derivada deben poder reemplazar objetos de la clase base sin alterar el funcionamiento del programa.

**Implementación en el código**:

- **Productos intercambiables**:
  - En `src/services/ProductService.ts` línea 20:
    ```typescript
    total += product.calculatePrice(); // Funciona con FoodProduct, ElectronicProduct o ClothingProduct
    ```
  - Cualquier tipo de producto puede usarse donde se espera un `Product`. Todos respetan el contrato de `calculatePrice()` y `getTaxRate()`.

- **Estrategias intercambiables**:
  - En `src/services/ParkingService.ts` línea 18:
    ```typescript
    return this.rateStrategy.calculateRate(record); // Funciona con ANY estrategia
    ```
  - Puedes cambiar `StandardRateStrategy` por `VIPRateStrategy` sin romper nada. Todas cumplen el contrato de `IParkingRateStrategy`.

- **Repositorios intercambiables**:
  - `ProductService` acepta cualquier implementación de `IProductRepository` (JSON, SQL, MongoDB, etc.).

**Ejemplo práctico**: En `src/container.ts` puedes cambiar:
```typescript
const parkingService = new ParkingService(parkingRepository, new StandardRateStrategy());
// Por:
const parkingService = new ParkingService(parkingRepository, new VIPRateStrategy());
```
Y todo sigue funcionando porque `VIPRateStrategy` cumple el contrato de `IParkingRateStrategy`.

---

### 4️⃣ **ISP - Interface Segregation Principle** (Segregación de Interfaces)
**Concepto**: Los clientes no deben depender de interfaces que no usan. Es mejor tener interfaces pequeñas y específicas.

**Implementación en el código**:

- **`src/interfaces/BirdInterfaces.ts`**: En lugar de una interfaz gigante `IBird` con todos los métodos, hay interfaces segregadas:
  ```typescript
  interface IFlyable { fly(), getFlyingSpeed() }      // Solo para aves que vuelan
  interface ISwimmable { swim(), getSwimmingDepth() } // Solo para aves que nadan
  interface IRunnable { run(), getRunningSpeed() }    // Solo para aves que corren
  interface IWalkable { walk(), getWalkingSpeed() }   // Solo para aves que caminan
  ```

- **`src/models/birds/DynamicBird.ts`**: 
  - Un pingüino implementa `ISwimmable` y `IWalkable` (nada y camina)
  - Un águila implementa `IFlyable` (solo vuela)
  - Un avestruz implementa `IRunnable` y `IWalkable` (corre y camina, NO vuela)
  
  Cada ave solo implementa las interfaces que realmente necesita usando `Partial<IFlyable & ISwimmable & IRunnable & IWalkable>`.

**Ejemplo práctico**: Si creas un pingüino:
```typescript
const penguin = new DynamicBird('Pingu', 'Pingüino', {
  canSwim: { description: 'Nada bajo el agua', depth: 50 },
  canWalk: { description: 'Camina en hielo', speed: 5 }
  // NO tiene canFly - y NO tiene que implementar métodos de vuelo innecesarios
});
```

**Por qué es importante**: Sin ISP, todas las aves tendrían que implementar métodos como `fly()`, incluso las que no vuelan (pingüinos, avestruces), obligándote a escribir código dummy o lanzar excepciones.

---

### 5️⃣ **DIP - Dependency Inversion Principle** (Inversión de Dependencias)
**Concepto**: Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones (interfaces).

**Implementación en el código**:

- **`src/services/ProductService.ts`**: 
  ```typescript
  constructor(private productRepository: IProductRepository) {} // Depende de la INTERFAZ
  ```
  NO depende directamente de `JsonProductRepository`. Esto permite cambiar a cualquier implementación (SQL, MongoDB, API externa) sin modificar `ProductService`.

- **`src/services/ParkingService.ts`**:
  ```typescript
  constructor(
    private parkingRepository: IParkingRepository,  // Abstracción
    private rateStrategy: IParkingRateStrategy      // Abstracción
  ) {}
  ```
  Depende de interfaces, NO de clases concretas.

- **`src/container.ts`** (Inyección de Dependencias):
  ```typescript
  const productRepository = new JsonProductRepositorySync();
  const productService = new ProductService(productRepository); // Inyecta la dependencia
  ```
  El contenedor crea las implementaciones concretas y las inyecta. `ProductService` no crea su propio repositorio.

- **Interfaces definidas**:
  - `src/interfaces/IProductRepository.ts`: Contrato para repositorios de productos
  - `src/interfaces/IParkingRepository.ts`: Contrato para repositorios de parking
  - `src/interfaces/IParkingRateStrategy.ts`: Contrato para estrategias de tarifas

**Ejemplo práctico**: 
```typescript
// ANTES (❌ Mal - violando DIP):
class ProductService {
  private repository = new JsonProductRepository(); // Acoplamiento directo
}

// DESPUÉS (✅ Bien - aplicando DIP):
class ProductService {
  constructor(private repository: IProductRepository) {} // Depende de abstracción
}
```

Ahora puedes crear `SqlProductRepository implements IProductRepository` y cambiar la implementación en `container.ts` sin tocar `ProductService`.

---

## 🗂️ Estructura de Archivos por Responsabilidad

```
src/
├── models/              # Entidades del dominio (SRP, OCP, LSP)
│   ├── Product.ts       # Clase abstracta base
│   ├── FoodProduct.ts   # Producto de alimentos (extiende Product)
│   ├── ElectronicProduct.ts
│   ├── ClothingProduct.ts
│   ├── ParkingRecord.ts
│   └── birds/
│       └── DynamicBird.ts  # ISP implementado
│
├── interfaces/          # Contratos (DIP, ISP)
│   ├── BirdInterfaces.ts    # IFlyable, ISwimmable, etc (ISP)
│   ├── IProductRepository.ts # DIP
│   ├── IParkingRepository.ts # DIP
│   └── IParkingRateStrategy.ts # DIP, OCP
│
├── services/            # Lógica de negocio (SRP, DIP)
│   ├── ProductService.ts    # Usa IProductRepository
│   ├── ParkingService.ts    # Usa IParkingRepository y IParkingRateStrategy
│   └── PriceCalculator.ts   # Solo calcula precios
│
├── repositories/        # Persistencia (SRP, DIP)
│   ├── JsonProductRepository.ts  # Implementa IProductRepository
│   └── JsonParkingRepository.ts  # Implementa IParkingRepository
│
├── strategies/          # Patrones de estrategia (OCP, LSP, DIP)
│   └── ParkingRateStrategies.ts # StandardRateStrategy, WeekendRateStrategy, VIPRateStrategy
│
└── container.ts         # Inyección de dependencias (DIP)
```

---

## 🎯 Beneficios Alcanzados

1. **Mantenibilidad**: Cada clase tiene una responsabilidad clara (SRP)
2. **Extensibilidad**: Agregar funcionalidad sin modificar código existente (OCP)
3. **Flexibilidad**: Cambiar implementaciones fácilmente (DIP)
4. **Testabilidad**: Interfaces facilitan los mocks en pruebas (DIP)
5. **Claridad**: Interfaces específicas evitan confusión (ISP)
6. **Reutilización**: Componentes intercambiables (LSP)

---

## 💡 Cómo Estudiar Este Código

1. **Comienza por las interfaces** (`src/interfaces/`): Entiende los contratos
2. **Revisa los modelos** (`src/models/`): Ve cómo se estructuran las entidades
3. **Analiza los servicios** (`src/services/`): Observa cómo usan las interfaces
4. **Estudia el container** (`src/container.ts`): Ve cómo se inyectan dependencias
5. **Compara estrategias** (`src/strategies/`): Observa cómo se extiende sin modificar

**Ejercicio**: Intenta agregar un nuevo tipo de producto o una nueva estrategia de tarifa sin modificar código existente. Si lo logras, entendiste SOLID.

---

## 🚀 Tecnologías

- Next.js 14 con App Router
- TypeScript (tipado estricto para contratos claros)
- Arquitectura limpia y principios SOLID
- Sistema de componentes React con separación de responsabilidades

---

## 📖 Autor

Sistema diseñado con fines educativos para demostrar la aplicación práctica de los principios SOLID en un proyecto real.