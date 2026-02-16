import { Product } from '../models/Product';

// ============================================
// PRINCIPIO: Dependency Inversion Principle (DIP)
// Definimos una interfaz abstracta para el repositorio
// Las clases de alto nivel dependerán de esta abstracción, no de implementaciones concretas
// ============================================

export interface IProductRepository {
  getAll(): Product[];
  getById(id: string): Product | undefined;
  add(product: Product): void;
  remove(id: string): void;
}
