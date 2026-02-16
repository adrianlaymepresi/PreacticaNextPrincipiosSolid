import { Product } from './Product';

// ============================================
// PRINCIPIO: Liskov Substitution Principle (LSP)
// FoodProduct puede sustituir a Product sin problemas
// Los alimentos tienen IVA reducido del 5%
// ============================================

export class FoodProduct extends Product {
  private static readonly TAX_RATE = 0.05; // 5% IVA para alimentos

  constructor(
    id: string,
    name: string,
    acquisitionPrice: number,
    private expirationDate?: Date
  ) {
    super(id, name, acquisitionPrice, 'Alimentos');
  }

  getTaxRate(): number {
    return FoodProduct.TAX_RATE;
  }

  calculatePrice(): number {
    // Precio base con 20% de ganancia
    let finalPrice = this.calculateBaseWithProfit();

    // Aplicar IVA del 5%
    finalPrice = finalPrice * (1 + FoodProduct.TAX_RATE);

    // Si el producto está próximo a vencer (menos de 3 días), aplicar descuento del 30%
    if (this.expirationDate) {
      const daysToExpire = Math.ceil(
        (this.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysToExpire <= 3 && daysToExpire > 0) {
        finalPrice = finalPrice * 0.7; // 30% de descuento
      }
    }

    return Math.round(finalPrice);
  }

  getExpirationInfo(): string {
    return this.expirationDate 
      ? `Vence: ${this.expirationDate.toLocaleDateString()}`
      : 'Sin fecha de vencimiento';
  }
}
