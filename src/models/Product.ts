export abstract class Product {
  constructor(
    public id: string,
    public name: string,
    protected acquisitionPrice: number,
    public category: string
  ) {}

  abstract calculatePrice(): number;

  abstract getTaxRate(): number;

  getInfo(): string {
    return `${this.name} - Categoría: ${this.category}`;
  }

  getAcquisitionPrice(): number {
    return this.acquisitionPrice;
  }

  protected calculateBaseWithProfit(): number {
    return this.acquisitionPrice * 1.20;
  }
}
