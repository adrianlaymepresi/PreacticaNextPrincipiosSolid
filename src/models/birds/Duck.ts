import { Bird, ISwimmable, IFlyable, IRunnable } from '../../interfaces/BirdInterfaces';

// ============================================
// PRINCIPIO: Interface Segregation Principle (ISP)
// El pato implementa TODAS las interfaces porque puede volar, nadar y correr
// ============================================

export class Duck extends Bird implements IFlyable, ISwimmable, IRunnable {
  constructor(name: string) {
    super(name, 'Pato');
  }

  fly(): string {
    return `${this.name} vuela a baja altura`;
  }

  getFlyingSpeed(): number {
    return 80; // km/h
  }

  swim(): string {
    return `${this.name} nada graciosamente en el agua`;
  }

  getSwimmingDepth(): number {
    return 2; // metros
  }

  run(): string {
    return `${this.name} camina balanceándose`;
  }

  getRunningSpeed(): number {
    return 3; // km/h
  }

  makeSound(): string {
    return `${this.name} hace cuac cuac`;
  }
}
