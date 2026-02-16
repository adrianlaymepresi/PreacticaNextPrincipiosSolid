import { Product } from '../models/Product';

export class PriceCalculator {
  calculateWithDiscount(product: Product, discountPercentage: number): number {
    const price = product.calculatePrice();
    const discount = (price * discountPercentage) / 100;
    return Math.max(price - discount, 0);
  }

  calculateBulkDiscount(products: Product[], bulkDiscountPercentage: number): number {
    const totalPrice = products.reduce((sum, product) => sum + product.calculatePrice(), 0);
    const discount = (totalPrice * bulkDiscountPercentage) / 100;
    return Math.max(totalPrice - discount, 0);
  }

  calculateTax(price: number, taxPercentage: number): number {
    return price * (1 + taxPercentage / 100);
  }
}
