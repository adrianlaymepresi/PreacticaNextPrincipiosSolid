import { Product } from './Product';

export class FoodProduct extends Product {
  private static readonly TAX_RATE = 0.05;

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
    let finalPrice = this.calculateBaseWithProfit();

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
