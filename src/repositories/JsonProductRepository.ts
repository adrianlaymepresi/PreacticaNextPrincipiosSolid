import { Product } from '../models/Product';
import { FoodProduct } from '../models/FoodProduct';
import { ElectronicProduct } from '../models/ElectronicProduct';
import { ClothingProduct } from '../models/ClothingProduct';
import { IProductRepository } from '../interfaces/IProductRepository';

// ============================================
// PRINCIPIO: Dependency Inversion Principle (DIP)
// Implementación concreta del repositorio que usa archivos JSON como persistencia
// Puede reemplazar a InMemoryProductRepository sin afectar el código que depende de la interfaz
// PRINCIPIO: Single Responsibility Principle (SRP)
// Su única responsabilidad es manejar la persistencia de productos mediante la API
// ============================================

interface SerializedProduct {
  type: 'food' | 'electronic' | 'clothing';
  id: string;
  name: string;
  acquisitionPrice: number;
  category: string;
  expirationDate?: string;
  warrantyMonths?: number;
  brand?: string;
  size?: string;
  material?: string;
}

// Versión con métodos síncronos para compatibilidad con la interfaz existente
// Usa un caché local y sincroniza con la API de forma asíncrona
export class JsonProductRepositorySync implements IProductRepository {
  private cache: Product[] = [];
  private loadPromise: Promise<void> | null = null;

  constructor() {
    // Inicializar carga solo si estamos en el navegador (client-side)
    if (typeof window !== 'undefined') {
      this.loadPromise = this.loadFromAPI();
    }
  }

  private async loadFromAPI(): Promise<void> {
    // Solo cargar si estamos en el navegador
    if (typeof window === 'undefined') {
      this.cache = [];
      return;
    }
    
    try {
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: SerializedProduct[] = await response.json();
      this.cache = data.map(this.deserializeProduct);
    } catch (error) {
      console.error('Error loading products from API:', error);
      this.cache = [];
    }
  }

  private deserializeProduct(data: SerializedProduct): Product {
    switch (data.type) {
      case 'food':
        return new FoodProduct(
          data.id,
          data.name,
          data.acquisitionPrice,
          data.expirationDate ? new Date(data.expirationDate) : undefined
        );
      case 'electronic':
        return new ElectronicProduct(
          data.id,
          data.name,
          data.acquisitionPrice,
          data.warrantyMonths || 12,
          data.brand || 'Genérico'
        );
      case 'clothing':
        return new ClothingProduct(
          data.id,
          data.name,
          data.acquisitionPrice,
          data.size || 'M',
          data.material || 'Algodón'
        );
      default:
        throw new Error('Unknown product type');
    }
  }

  private serializeProduct(product: Product): SerializedProduct {
    const base = {
      id: product.id,
      name: product.name,
      acquisitionPrice: product.getAcquisitionPrice(),
      category: product.category,
    };

    if (product instanceof FoodProduct) {
      return {
        ...base,
        type: 'food',
        expirationDate: (product as any).expirationDate?.toISOString(),
      };
    } else if (product instanceof ElectronicProduct) {
      return {
        ...base,
        type: 'electronic',
        warrantyMonths: (product as any).warrantyMonths,
        brand: (product as any).brand,
      };
    } else if (product instanceof ClothingProduct) {
      return {
        ...base,
        type: 'clothing',
        size: (product as any).size,
        material: (product as any).material,
      };
    }

    throw new Error('Unknown product type');
  }

  getAll(): Product[] {
    return [...this.cache];
  }

  getById(id: string): Product | undefined {
    return this.cache.find((p) => p.id === id);
  }

  add(product: Product): void {
    const serialized = this.serializeProduct(product);
    
    // Llamada asíncrona sin esperar (fire and forget)
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serialized),
    }).catch((error) => console.error('Error adding product:', error));

    // Actualizar caché local inmediatamente para respuesta rápida en UI
    this.cache.push(product);
  }

  remove(id: string): void {
    // Llamada asíncrona sin esperar (fire and forget)
    fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).catch((error) => console.error('Error removing product:', error));

    // Actualizar caché local inmediatamente para respuesta rápida en UI
    this.cache = this.cache.filter((p) => p.id !== id);
  }
}
