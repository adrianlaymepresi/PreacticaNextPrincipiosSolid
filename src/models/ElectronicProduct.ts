import { Product } from './Product';

// ============================================
// PRINCIPIO: Liskov Substitution Principle (LSP)
// ElectronicProduct puede sustituir a Product sin problemas
// Los electrónicos tienen IVA estándar del 19%
// ============================================

export class ElectronicProduct extends Product {
  private static readonly TAX_RATE = 0.19; // 19% IVA para electrónicos

  constructor(
    id: string,
    name: string,
    acquisitionPrice: number,
    private warrantyMonths: number = 12,
    private brand: string = 'Genérico'
  ) {
    super(id, name, acquisitionPrice, 'Electrónicos');
  }

  getTaxRate(): number {
    return ElectronicProduct.TAX_RATE;
  }

  calculatePrice(): number {
    // Precio base con 20% de ganancia
    let finalPrice = this.calculateBaseWithProfit();

    // Aplicar IVA del 19%
    finalPrice = finalPrice * (1 + ElectronicProduct.TAX_RATE);

    // Los productos con garantía extendida tienen un recargo del 5%
    if (this.warrantyMonths > 12) {
      finalPrice = finalPrice * 1.05;
    }

    return Math.round(finalPrice);
  }

  getWarrantyInfo(): string {
    return `Garantía: ${this.warrantyMonths} meses - Marca: ${this.brand}`;
  }
}
