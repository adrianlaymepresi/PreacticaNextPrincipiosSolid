import { Bird, IFlyable, ISwimmable, IRunnable } from '../../interfaces/BirdInterfaces';

// ============================================
// PRINCIPIO: Interface Segregation Principle (ISP)
// DynamicBird es una implementación flexible que permite crear aves
// con capacidades configurables, manteniendo el ISP al implementar
// solo las interfaces para las capacidades que el ave posee
// ============================================

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

export class DynamicBird extends Bird implements Partial<IFlyable & ISwimmable & IRunnable> {
  private capabilities: BirdCapabilities;

  constructor(name: string, species: string, capabilities: BirdCapabilities) {
    super(name, species);
    this.capabilities = capabilities;
  }

  // Implementa IFlyable solo si tiene la capacidad
  fly(): string {
    if (!this.capabilities.canFly) {
      throw new Error(`${this.name} no puede volar`);
    }
    return this.capabilities.canFly.description || `${this.name} vuela`;
  }

  getFlyingSpeed(): number {
    if (!this.capabilities.canFly) {
      throw new Error(`${this.name} no puede volar`);
    }
    return this.capabilities.canFly.speed;
  }

  // Implementa ISwimmable solo si tiene la capacidad
  swim(): string {
    if (!this.capabilities.canSwim) {
      throw new Error(`${this.name} no puede nadar`);
    }
    return this.capabilities.canSwim.description || `${this.name} nada`;
  }

  getSwimmingDepth(): number {
    if (!this.capabilities.canSwim) {
      throw new Error(`${this.name} no puede nadar`);
    }
    return this.capabilities.canSwim.depth;
  }

  // Implementa IRunnable solo si tiene la capacidad
  run(): string {
    if (!this.capabilities.canRun) {
      throw new Error(`${this.name} no puede correr`);
    }
    return this.capabilities.canRun.description || `${this.name} corre`;
  }

  getRunningSpeed(): number {
    if (!this.capabilities.canRun) {
      throw new Error(`${this.name} no puede correr`);
    }
    return this.capabilities.canRun.speed;
  }

  // Métodos auxiliares para verificar capacidades
  canFlyCheck(): boolean {
    return !!this.capabilities.canFly;
  }

  canSwimCheck(): boolean {
    return !!this.capabilities.canSwim;
  }

  canRunCheck(): boolean {
    return !!this.capabilities.canRun;
  }

  getCapabilities(): BirdCapabilities {
    return this.capabilities;
  }
}
