import { Bird, IFlyable, IRunnable } from '../../interfaces/BirdInterfaces';

// ============================================
// PRINCIPIO: Interface Segregation Principle (ISP)
// El águila solo implementa las interfaces que necesita: IFlyable e IRunnable
// NO implementa ISwimmable porque no nada
// ============================================

export class Eagle extends Bird implements IFlyable, IRunnable {
  constructor(name: string) {
    super(name, 'Águila');
  }

  fly(): string {
    return `${this.name} vuela majestuosamente por el cielo`;
  }

  getFlyingSpeed(): number {
    return 120; // km/h
  }

  run(): string {
    return `${this.name} camina por el suelo`;
  }

  getRunningSpeed(): number {
    return 5; // km/h
  }

  makeSound(): string {
    return `${this.name} emite un grito agudo`;
  }
}
