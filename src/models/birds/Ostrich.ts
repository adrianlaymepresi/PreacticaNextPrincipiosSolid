import { Bird, IRunnable } from '../../interfaces/BirdInterfaces';

// ============================================
// PRINCIPIO: Interface Segregation Principle (ISP)
// El avestruz solo implementa IRunnable
// NO implementa IFlyable ni ISwimmable
// ============================================

export class Ostrich extends Bird implements IRunnable {
  constructor(name: string) {
    super(name, 'Avestruz');
  }

  run(): string {
    return `${this.name} corre muy rápido por la sabana`;
  }

  getRunningSpeed(): number {
    return 70; // km/h - ¡El ave más rápida en tierra!
  }

  makeSound(): string {
    return `${this.name} emite un bramido`;
  }
}
