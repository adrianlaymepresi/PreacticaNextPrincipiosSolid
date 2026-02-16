import { Product } from '../models/Product';

export interface IProductRepository {
  getAll(): Product[];
  getById(id: string): Product | undefined;
  add(product: Product): void;
  remove(id: string): void;
}
