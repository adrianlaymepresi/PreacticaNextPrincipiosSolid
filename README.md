# 🏪 Supermercado SOLID - Demostración de Principios SOLID

Aplicación web desarrollada con **Next.js** y **TypeScript** que demuestra la implementación práctica de los **5 Principios SOLID** en el desarrollo de software.

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema de supermercado con estacionamiento que incluye:
- ✅ Catálogo de productos con diferentes categorías
- ✅ Sistema de carrito de compras
- ✅ Control de estacionamiento con diferentes tarifas
- ✅ Sistema de aves con interfaces segregadas (demostración adicional de ISP)

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **React 18** - Biblioteca de UI

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Abrir en el navegador:
```
http://localhost:3000
```

## 🎯 Principios SOLID Implementados

### 1. 🔹 Single Responsibility Principle (SRP)

**Definición:** Una clase debe tener una sola razón para cambiar.

**Implementación en el proyecto:**

- **`Product.ts`** - Solo define la estructura base de un producto
- **`ParkingRecord.ts`** - Solo representa un registro de estacionamiento
- **`ProductService.ts`** - Solo maneja la lógica de negocio de productos
- **`ParkingService.ts`** - Solo maneja la lógica de negocio de estacionamiento
- **`PriceCalculator.ts`** - Solo calcula precios y descuentos

**Ubicación en el código:**
```
src/models/ParkingRecord.ts
src/services/ProductService.ts
src/services/ParkingService.ts
src/services/PriceCalculator.ts
```

### 2. 🔹 Open/Closed Principle (OCP)

**Definición:** Las entidades de software deben estar abiertas para extensión pero cerradas para modificación.

**Implementación en el proyecto:**

1. **Productos extensibles:**
   - Clase abstracta `Product` que puede ser extendida sin modificarse
   - Clases derivadas: `FoodProduct`, `ElectronicProduct`, `ClothingProduct`
   - Agregar nuevos tipos de productos sin modificar código existente

2. **Estrategias de tarifa:**
   - Interface `IParkingRateStrategy`
   - Implementaciones: `StandardRateStrategy`, `WeekendRateStrategy`, `VIPRateStrategy`
   - Agregar nuevas tarifas sin modificar el `ParkingService`

**Ubicación en el código:**
```
src/models/Product.ts (clase abstracta)
src/models/FoodProduct.ts
src/models/ElectronicProduct.ts
src/models/ClothingProduct.ts
src/interfaces/IParkingRateStrategy.ts
src/strategies/ParkingRateStrategies.ts
```

### 3. 🔹 Liskov Substitution Principle (LSP)

**Definición:** Los objetos de una clase derivada deben poder reemplazar objetos de la clase base sin alterar el funcionamiento del programa.

**Implementación en el proyecto:**

- `FoodProduct`, `ElectronicProduct` y `ClothingProduct` pueden sustituir a `Product`
- Todos implementan `calculatePrice()` de manera consistente
- El `ProductService` trabaja con cualquier tipo de `Product` sin conocer su tipo concreto

**Ejemplo de código:**
```typescript
// Funciona con cualquier tipo de Product
calculateTotalPrice(productIds: string[]): number {
  let total = 0;
  for (const id of productIds) {
    const product = this.productRepository.getById(id);
    if (product) {
      total += product.calculatePrice(); // LSP en acción
    }
  }
  return total;
}
```

**Ubicación en el código:**
```
src/models/Product.ts
src/models/FoodProduct.ts
src/models/ElectronicProduct.ts
src/models/ClothingProduct.ts
```

### 4. 🔹 Interface Segregation Principle (ISP)

**Definición:** Los clientes no deben ser obligados a depender de interfaces que no usan.

**Implementación en el proyecto:**

En lugar de tener una interfaz grande `Bird` con todos los métodos (fly, swim, run), las capacidades están segregadas en interfaces específicas:

- **`IFlyable`** - Para aves que vuelan
- **`ISwimmable`** - Para aves que nadan
- **`IRunnable`** - Para aves que corren

**Implementaciones:**
- **Eagle** (Águila): Implementa `IFlyable` e `IRunnable` (no nada)
- **Duck** (Pato): Implementa `IFlyable`, `ISwimmable` e `IRunnable` (hace todo)
- **Penguin** (Pingüino): Implementa `ISwimmable` e `IRunnable` (no vuela)
- **Ostrich** (Avestruz): Implementa solo `IRunnable` (no vuela ni nada)

**Ubicación en el código:**
```
src/interfaces/BirdInterfaces.ts
src/models/birds/Eagle.ts
src/models/birds/Duck.ts
src/models/birds/Penguin.ts
src/models/birds/Ostrich.ts
```

### 5. 🔹 Dependency Inversion Principle (DIP)

**Definición:** Las clases de alto nivel no deben depender de clases de bajo nivel. Ambas deben depender de abstracciones.

**Implementación en el proyecto:**

1. **Interfaces (abstracciones):**
   - `IProductRepository` - Abstracción para el repositorio de productos
   - `IParkingRepository` - Abstracción para el repositorio de estacionamiento
   - `IParkingRateStrategy` - Abstracción para estrategias de tarifa

2. **Inyección de dependencias:**
   - `ProductService` depende de `IProductRepository` (no de implementación concreta)
   - `ParkingService` depende de `IParkingRepository` y `IParkingRateStrategy`
   - Las dependencias se inyectan en el constructor

3. **Contenedor de dependencias:**
   - `container.ts` centraliza la configuración de dependencias

**Ejemplo de código:**
```typescript
export class ProductService {
  // Depende de la abstracción IProductRepository
  constructor(private productRepository: IProductRepository) {}
  
  getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }
}
```

**Ubicación en el código:**
```
src/interfaces/IProductRepository.ts
src/interfaces/IParkingRepository.ts
src/repositories/InMemoryProductRepository.ts
src/repositories/InMemoryParkingRepository.ts
src/services/ProductService.ts
src/services/ParkingService.ts
src/container.ts
```

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Páginas de Next.js
│   ├── page.tsx                  # Página principal (productos)
│   ├── parking/page.tsx          # Página de estacionamiento
│   ├── birds/page.tsx            # Página de aves (ISP)
│   ├── principles/page.tsx       # Documentación de principios
│   ├── layout.tsx                # Layout principal
│   └── globals.css               # Estilos globales
├── components/                   # Componentes React
│   ├── ProductCard.tsx
│   ├── ParkingRecordCard.tsx
│   └── BirdCard.tsx
├── models/                       # Modelos de dominio
│   ├── Product.ts                # Clase abstracta (OCP, LSP)
│   ├── FoodProduct.ts            # Producto de alimentos
│   ├── ElectronicProduct.ts      # Producto electrónico
│   ├── ClothingProduct.ts        # Producto de ropa
│   ├── ParkingRecord.ts          # Registro de estacionamiento (SRP)
│   └── birds/                    # Modelos de aves (ISP)
│       ├── Eagle.ts
│       ├── Duck.ts
│       ├── Penguin.ts
│       └── Ostrich.ts
├── interfaces/                   # Interfaces y abstracciones (DIP, ISP)
│   ├── IProductRepository.ts
│   ├── IParkingRepository.ts
│   ├── IParkingRateStrategy.ts
│   └── BirdInterfaces.ts
├── services/                     # Servicios (SRP, DIP)
│   ├── ProductService.ts
│   ├── ParkingService.ts
│   └── PriceCalculator.ts
├── repositories/                 # Implementaciones de repositorios (DIP)
│   ├── InMemoryProductRepository.ts
│   └── InMemoryParkingRepository.ts
├── strategies/                   # Estrategias (OCP)
│   └── ParkingRateStrategies.ts
└── container.ts                  # Inyección de dependencias (DIP)
```

## 🎨 Características de la Aplicación

### Página de Productos
- Visualización de catálogo de productos
- Cálculo dinámico de precios
- Sistema de carrito de compras
- Diferentes tipos de productos con precios especiales

### Página de Estacionamiento
- Registro de entrada de vehículos
- Registro de salida con cálculo de tarifa
- Cambio dinámico de estrategia de tarifa
- Visualización de vehículos activos e historial

### Página de Aves
- Demostración visual del Interface Segregation Principle
- Diferentes aves con capacidades específicas
- Análisis de implementación de interfaces

### Página de Principios
- Documentación completa de cada principio SOLID
- Ejemplos de implementación en el código
- Explicación de beneficios y ubicación en el proyecto

## 🚀 Cómo Extender el Proyecto

### Agregar un nuevo tipo de producto (OCP)
```typescript
import { Product } from './Product';

export class BookProduct extends Product {
  constructor(id: string, name: string, basePrice: number, private isbn: string) {
    super(id, name, basePrice, 'Libros');
  }

  calculatePrice(): number {
    // Lógica específica para libros
    return this.basePrice * 0.9; // 10% de descuento
  }
}
```

### Agregar una nueva estrategia de tarifa (OCP)
```typescript
export class NightRateStrategy implements IParkingRateStrategy {
  calculateRate(record: ParkingRecord): number {
    const hours = record.getDurationInHours();
    return hours * 1000; // Tarifa nocturna reducida
  }

  getDescription(): string {
    return 'Tarifa nocturna: $1000/hora';
  }
}
```

## 📚 Recursos y Referencias

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 👨‍💻 Autor

Proyecto desarrollado para la materia de Proyecto de Sistemas 2 - Universidad del Valle

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.
