// ============================================
// PRINCIPIO: Interface Segregation Principle (ISP)
// En lugar de tener una interfaz grande "Bird" con todos los métodos,
// segregamos las capacidades en interfaces pequeñas y específicas.
// Las aves solo implementan las interfaces que necesitan.
// ============================================

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

// Interfaz para aves que pueden caminar
export interface IWalkable {
  walk(): string;
  getWalkingSpeed(): number;
}

// Clase base simple para todas las aves
export abstract class Bird {
  constructor(public name: string, public species: string) {}

  makeSound(): string {
    return `${this.name} hace un sonido`;
  }
}
