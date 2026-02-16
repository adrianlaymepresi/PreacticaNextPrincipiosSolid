# Sistema Dinámico de Aves - Interface Segregation Principle (ISP)

## Descripción General

El sistema de aves ha sido actualizado para permitir la creación dinámica de aves con capacidades configurables, manteniendo perfectamente el **Interface Segregation Principle (ISP)**.

## Arquitectura

### 1. Interfaces Segregadas

Las capacidades de las aves están divididas en interfaces específicas:

```typescript
// Interfaz para aves que pueden volar
export interface IFlyable {
  fly(): string;
  getFlyingSpeed(): number;
}

// Interfaz para aves que pueden nadar
export interface ISwimmable {
  swim(): string;
  getSwimmingDepth(): number;
}

// Interfaz para aves que pueden correr
export interface IRunnable {
  run(): string;
  getRunningSpeed(): number;
}
```

### 2. Clase DynamicBird

La clase `DynamicBird` permite crear aves con capacidades configurables:

```typescript
export class DynamicBird extends Bird {
  constructor(name: string, species: string, capabilities: BirdCapabilities) {
    // ...
  }
}
```

#### Características principales:

- **Implementación Parcial**: Usa `Partial<IFlyable & ISwimmable & IRunnable>` para indicar que puede implementar cualquier combinación de interfaces
- **Capacidades Configurables**: Solo implementa los métodos de las interfaces para las capacidades que el ave posee
- **Validación en Runtime**: Lanza errores si se intenta usar una capacidad que el ave no tiene
- **Métodos de Verificación**: Provee `canFlyCheck()`, `canSwimCheck()`, `canRunCheck()` para validar capacidades

### 3. Interface BirdCapabilities

```typescript
export interface BirdCapabilities {
  canFly?: {
    description: string;
    speed: number;
  };
  canSwim?: {
    description: string;
    depth: number;
  };
  canRun?: {
    description: string;
    speed: number;
  };
}
```

## Cómo Funciona el Sistema

### Creación de Aves Dinámicas

1. **Formulario de Entrada**: El usuario ingresa:
   - Nombre del ave
   - Especie
   - Capacidades (checkboxes)
   - Detalles de cada capacidad seleccionada

2. **Construcción de Capacidades**: 
   ```typescript
   const capabilities: BirdCapabilities = {};
   
   if (formData.canFly) {
     capabilities.canFly = {
       description: formData.flyDescription,
       speed: formData.flySpeed,
     };
   }
   // Similar para swim y run
   ```

3. **Creación del Ave**:
   ```typescript
   const newBird = new DynamicBird(name, species, capabilities);
   ```

### Demostración del ISP

El sistema demuestra el ISP porque:

1. **No Implementación Forzada**: Un ave no tiene que implementar interfaces que no necesita
   - Un pingüino NO implementa IFlyable
   - Un avestruz solo implementa IRunnable

2. **Segregación Clara**: Cada interfaz tiene una responsabilidad específica y única

3. **Flexibilidad**: Puedes crear cualquier combinación de capacidades:
   - Ave que solo vuela
   - Ave que solo nada
   - Ave que hace las tres cosas
   - Ave que vuela y nada pero no corre

## Ejemplos de Uso

### Crear un Loro que Puede Volar y Correr

```typescript
const parrot = new DynamicBird('Loro Amazónico', 'Loro', {
  canFly: {
    description: 'El Loro Amazónico vuela entre los árboles',
    speed: 60,
  },
  canRun: {
    description: 'El Loro Amazónico camina por las ramas',
    speed: 3,
  },
});
```

### Crear un Colibrí que Solo Vuela

```typescript
const hummingbird = new DynamicBird('Colibrí', 'Colibrí', {
  canFly: {
    description: 'El Colibrí vuela suspendido en el aire',
    speed: 90,
  },
});
```

### Crear un Cormorán que Vuela y Nada

```typescript
const cormorant = new DynamicBird('Cormorán', 'Cormorán', {
  canFly: {
    description: 'El Cormorán vuela sobre el agua',
    speed: 70,
  },
  canSwim: {
    description: 'El Cormorán nada y bucea para pescar',
    depth: 10,
  },
});
```

## Ventajas del Sistema

### 1. Cumplimiento Total del ISP
- Ninguna clase se ve obligada a implementar métodos que no usa
- Las interfaces son pequeñas y específicas
- Cada ave implementa solo lo que necesita

### 2. Flexibilidad
- Crear aves con cualquier combinación de capacidades
- Agregar nuevas capacidades fácilmente
- No requiere crear una nueva clase para cada tipo de ave

### 3. Type Safety
- TypeScript valida que los métodos existan
- Verificación de capacidades en runtime
- Errores claros cuando se intenta usar capacidades no disponibles

### 4. Mantenibilidad
- Código centralizado en `DynamicBird`
- Fácil de extender con nuevas interfaces
- Separación clara de responsabilidades

## Aves Predeterminadas vs Personalizadas

### Aves Predeterminadas
El sistema incluye 4 aves predeterminadas como ejemplos:
- **Águila**: IFlyable, IRunnable
- **Pato**: IFlyable, ISwimmable, IRunnable
- **Pingüino**: ISwimmable, IRunnable
- **Avestruz**: IRunnable

Estas aves usan clases específicas y sirven como referencia.

### Aves Personalizadas
Las aves creadas por el usuario:
- Se almacenan en el estado con `useState`
- Usan la clase `DynamicBird`
- Se combinan con las predeterminadas en la visualización
- Demuestran el poder del ISP con configuraciones personalizadas

## Validaciones

El sistema incluye validaciones para asegurar consistencia:

1. **Validación de Formulario**:
   - Nombre y especie son requeridos
   - Al menos una capacidad debe ser seleccionada

2. **Validación en Runtime**:
   - Los métodos verifican que la capacidad existe antes de ejecutarse
   - Se lanzan errores descriptivos si se intenta usar una capacidad no disponible

3. **Verificación de Capacidades**:
   - Métodos `canFlyCheck()`, `canSwimCheck()`, `canRunCheck()`
   - Permiten verificar capacidades antes de intentar usarlas

## Conclusión

Este sistema demuestra cómo el ISP puede implementarse de manera dinámica y flexible sin sacrificar:
- Type safety
- Claridad del código
- Mantenibilidad
- Principios SOLID

Es un excelente ejemplo de cómo los principios SOLID no son restricciones rígidas, sino guías que permiten crear sistemas flexibles y robustos.
