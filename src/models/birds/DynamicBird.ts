import { Bird, IFlyable, ISwimmable, IRunnable, IWalkable } from '../../interfaces/BirdInterfaces';

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
  canWalk?: {
    description: string;
    speed: number;
  };
}

export class DynamicBird extends Bird implements Partial<IFlyable & ISwimmable & IRunnable & IWalkable> {
  private capabilities: BirdCapabilities;

  constructor(name: string, species: string, capabilities: BirdCapabilities) {
    super(name, species);
    this.capabilities = capabilities;
  }

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

  walk(): string {
    if (!this.capabilities.canWalk) {
      throw new Error(`${this.name} no puede caminar`);
    }
    return this.capabilities.canWalk.description || `${this.name} camina`;
  }

  getWalkingSpeed(): number {
    if (!this.capabilities.canWalk) {
      throw new Error(`${this.name} no puede caminar`);
    }
    return this.capabilities.canWalk.speed;
  }

  canFlyCheck(): boolean {
    return !!this.capabilities.canFly;
  }

  canSwimCheck(): boolean {
    return !!this.capabilities.canSwim;
  }

  canRunCheck(): boolean {
    return !!this.capabilities.canRun;
  }

  canWalkCheck(): boolean {
    return !!this.capabilities.canWalk;
  }

  getCapabilities(): BirdCapabilities {
    return this.capabilities;
  }
}
