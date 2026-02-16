import { Product } from '../models/Product';
import { IProductRepository } from '../interfaces/IProductRepository';

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }

  getProductById(id: string): Product | undefined {
    return this.productRepository.getById(id);
  }

  addProduct(product: Product): void {
    this.productRepository.add(product);
  }

  calculateTotalPrice(productIds: string[]): number {
    let total = 0;
    for (const id of productIds) {
      const product = this.productRepository.getById(id);
      if (product) {
        total += product.calculatePrice();
      }
    }
    return total;
  }

  getProductsByCategory(category: string): Product[] {
    return this.productRepository.getAll().filter((p) => p.category === category);
  }
}
