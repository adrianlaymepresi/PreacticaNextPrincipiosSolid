export interface IFlyable {
  fly(): string;
  getFlyingSpeed(): number;
}

export interface ISwimmable {
  swim(): string;
  getSwimmingDepth(): number;
}

export interface IRunnable {
  run(): string;
  getRunningSpeed(): number;
}

export interface IWalkable {
  walk(): string;
  getWalkingSpeed(): number;
}

export abstract class Bird {
  constructor(public name: string, public species: string) {}

  makeSound(): string {
    return `${this.name} hace un sonido`;
  }
}
