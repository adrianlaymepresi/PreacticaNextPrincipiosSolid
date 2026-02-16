import { Product } from './Product';

export class ClothingProduct extends Product {
  private static readonly TAX_RATE = 0.10;

  constructor(
    id: string,
    name: string,
    acquisitionPrice: number,
    private size: string = 'M',
    private material: string = 'Algodón'
  ) {
    super(id, name, acquisitionPrice, 'Ropa');
  }

  getTaxRate(): number {
    return ClothingProduct.TAX_RATE;
  }

  calculatePrice(): number {
    let finalPrice = this.calculateBaseWithProfit();

    finalPrice = finalPrice * (1 + ClothingProduct.TAX_RATE);
    finalPrice = finalPrice * (1 + ClothingProduct.TAX_RATE);

    return Math.round(finalPrice);
  }

  getSizeInfo(): string {
    return `Talla: ${this.size} - Material: ${this.material}`;
  }
}
