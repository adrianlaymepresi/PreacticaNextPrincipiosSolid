# Migración a Persistencia JSON - Clean Architecture & SOLID

## ✅ Cambios Implementados

### 1. **Estructura de Archivos JSON** (Capa de Datos)
Se crearon archivos JSON en la carpeta `data/` para almacenar datos persistentes:
- `data/products.json` - Base de datos de productos
- `data/parking.json` - Base de datos de registros de estacionamiento
- `data/birds.json` - Base de datos de aves personalizadas

### 2. **API Routes** (Capa de Infraestructura - Servidor)
Se crearon endpoints RESTful en `src/app/api/` siguiendo Next.js App Router:

#### `src/app/api/products/route.ts`
- **GET** - Obtener todos los productos
- **POST** - Agregar nuevo producto
- **DELETE** - Eliminar producto por ID
- Serializa/deserializa productos según su tipo (Food, Electronic, Clothing)

#### `src/app/api/parking/route.ts`
- **GET** - Obtener todos los registros
- **POST** - Agregar nuevo registro
- **PUT** - Actualizar registro existente
- Maneja conversión de fechas a/desde ISO strings

#### `src/app/api/birds/route.ts`
- **GET** - Obtener aves personalizadas
- **POST** - Agregar nueva ave
- **DELETE** - Limpiar todas las aves
- Guarda capacidades dinámicas de las aves

### 3. **Nuevos Repositorios JSON** (Capa de Infraestructura - Cliente)

#### `src/repositories/JsonProductRepository.ts`
- Implementa `IProductRepository` (✅ **DIP - Dependency Inversion**)
- Usa caché local + sincronización con API
- Métodos síncronos con "fire and forget" pattern
- Solo se inicializa en el navegador (client-side)

#### `src/repositories/JsonParkingRepository.ts`
- Implementa `IParkingRepository` (✅ **DIP - Dependency Inversion**)
- Misma estrategia de caché + API
- Maneja fechas correctamente para serialización

### 4. **Container Actualizado** (Inyección de Dependencias)
`src/container.ts`
- ✅ Reemplazó `InMemoryProductRepository` → `JsonProductRepositorySync`
- ✅ Reemplazó `InMemoryParkingRepository` → `JsonParkingRepository`
- ✅ Eliminó función `initializeData()` (datos precargados)
- ✅ Mantiene inyección de dependencias (DIP)

### 5. **Actualización de Componentes**
`src/app/birds/page.tsx`
- Ahora carga aves desde `/api/birds` en `useEffect`
- Guarda nuevas aves en JSON al crearlas
- Mantiene separación entre aves predeterminadas (hard-coded) y personalizadas (persistidas)

---

## 🏛️ Arquitectura Clean Architecture

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTACIÓN                      │
│  src/app/               (Pages - Next.js)           │
│  src/components/        (UI Components)             │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                  APLICACIÓN                         │
│  src/services/          (Business Logic)            │
│  - ProductService                                   │
│  - ParkingService                                   │
│  - PriceCalculator                                  │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                    DOMINIO                          │
│  src/models/            (Entities)                  │
│  src/interfaces/        (Contracts)                 │
│  - Product, ParkingRecord, Bird                     │
│  - IProductRepository, IParkingRepository           │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                INFRAESTRUCTURA                      │
│  src/repositories/      (Data Access)               │
│  - JsonProductRepository                            │
│  - JsonParkingRepository                            │
│                                                     │
│  src/app/api/           (API Routes - Server)       │
│  - products/route.ts                                │
│  - parking/route.ts                                 │
│  - birds/route.ts                                   │
│                                                     │
│  data/                  (Persistence)               │
│  - products.json                                    │
│  - parking.json                                     │
│  - birds.json                                       │
└─────────────────────────────────────────────────────┘
```

**Flujo de Dependencias:** Las capas superiores dependen de abstracciones (interfaces) definidas en el dominio, no de implementaciones concretas. ✅

---

## 🎯 Principios SOLID Aplicados

### ✅ **S - Single Responsibility Principle**
- Cada API route tiene una sola responsabilidad (manejar persistencia de un tipo de entidad)
- Cada repositorio maneja un solo tipo de dato
- Servicios mantienen lógica de negocio separada de persistencia

### ✅ **O - Open/Closed Principle**
- Se agregaron nuevos repositorios (JsonXRepository) sin modificar los existentes (InMemoryXRepository)
- Las estrategias de parking siguen siendo extensibles
- Se pueden agregar nuevos tipos de productos sin cambiar la lógica base

### ✅ **L - Liskov Substitution Principle**
- `JsonProductRepository` puede reemplazar a `InMemoryProductRepository` sin romper nada
- `JsonParkingRepository` puede reemplazar a `InMemoryParkingRepository` sin romper nada
- Todos implementan las mismas interfaces

### ✅ **I - Interface Segregation Principle**
- Las aves siguen usando interfaces pequeñas (`IFlyable`, `ISwimmable`, `IRunnable`)
- Los repositorios implementan solo los métodos necesarios de sus interfaces

### ✅ **D - Dependency Inversion Principle**
- Los servicios dependen de `IProductRepository` e `IParkingRepository` (abstracciones)
- No dependen de implementaciones concretas
- El container inyecta las dependencias correctas

---

## 🔄 Cómo Funciona la Persistencia

1. **Inicio de la aplicación:**
   - Los repositorios JSON se crean en el container
   - Al instanciarse, cargan datos desde `/api/{endpoint}` (solo client-side)
   - Los datos se guardan en caché local

2. **Agregar datos:**
   - El servicio llama a `repository.add(item)`
   - El repositorio actualiza caché local (respuesta inmediata)
   - Hace POST a `/api/{endpoint}` asíncronamente
   - La API guarda en el archivo JSON

3. **Leer datos:**
   - El servicio llama a `repository.getAll()`
   - El repositorio devuelve datos del caché local
   - No hace llamadas a la API en cada lectura (rendimiento)

4. **Actualizar/Eliminar:**
   - Similar al agregar
   - Actualización local inmediata + sync con API

---

## 📝 Notas Importantes

### Ventajas del Nuevo Sistema
✅ **Persistencia real** - Los datos sobreviven al reinicio de la aplicación
✅ **SOLID compliant** - Todos los principios se mantienen
✅ **Clean Architecture** - Separación clara de capas
✅ **Sin datos precargados** - La UI permite crear todos los datos necesarios
✅ **Extensible** - Fácil cambiar a base de datos real en el futuro

### Consideraciones
- Los archivos JSON están en `data/` fuera de `src/` (correcta separación)
- Las API routes usan Node.js `fs` (solo server-side)
- Los repositorios usan `fetch` (funciona client-side)
- Los repositorios verifican `typeof window !== 'undefined'` para evitar errores en build time

---

## 🚀 Próximos Pasos (Opcionales)

1. **Agregar validación** en las API routes (zod, yup)
2. **Manejo de errores mejorado** con códigos de estado HTTP apropiados
3. **Paginación** para grandes cantidades de datos
4. **Búsqueda y filtros** en las APIs
5. **Autenticación** si se requiere seguridad
6. **Migrar a base de datos real** (PostgreSQL, MongoDB) sin cambiar servicios

---

## ✨ Resultado Final

El proyecto ahora:
- ✅ Usa JSON como base de datos persistente
- ✅ Mantiene todos los principios SOLID
- ✅ Sigue Clean Architecture
- ✅ Funciona sin datos precargados
- ✅ No rompe ninguna funcionalidad existente
- ✅ Compila correctamente sin errores
