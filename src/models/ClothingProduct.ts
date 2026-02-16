import { Product } from './Product';

// ============================================
// PRINCIPIO: Liskov Substitution Principle (LSP)
// ClothingProduct puede sustituir a Product sin problemas
// La ropa tiene IVA del 10%
// ============================================

export class ClothingProduct extends Product {
  private static readonly TAX_RATE = 0.10; // 10% IVA para ropa

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
    // Precio base con 20% de ganancia
    let finalPrice = this.calculateBaseWithProfit();

    // Aplicar IVA del 10%
    finalPrice = finalPrice * (1 + ClothingProduct.TAX_RATE);

    return Math.round(finalPrice);
  }

  getSizeInfo(): string {
    return `Talla: ${this.size} - Material: ${this.material}`;
  }
}
