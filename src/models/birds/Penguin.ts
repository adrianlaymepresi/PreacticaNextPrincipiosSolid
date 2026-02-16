import { Bird, ISwimmable, IRunnable } from '../../interfaces/BirdInterfaces';

// ============================================
// PRINCIPIO: Interface Segregation Principle (ISP)
// El pingüino solo implementa ISwimmable e IRunnable
// NO implementa IFlyable porque no puede volar
// ============================================

export class Penguin extends Bird implements ISwimmable, IRunnable {
  constructor(name: string) {
    super(name, 'Pingüino');
  }

  swim(): string {
    return `${this.name} nada rápidamente bajo el agua`;
  }

  getSwimmingDepth(): number {
    return 50; // metros
  }

  run(): string {
    return `${this.name} camina torpemente sobre el hielo`;
  }

  getRunningSpeed(): number {
    return 2; // km/h
  }

  makeSound(): string {
    return `${this.name} hace un graznido`;
  }
}
