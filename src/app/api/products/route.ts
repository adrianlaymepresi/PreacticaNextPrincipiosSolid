import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { FoodProduct } from '@/models/FoodProduct';
import { ElectronicProduct } from '@/models/ElectronicProduct';
import { ClothingProduct } from '@/models/ClothingProduct';
import { Product } from '@/models/Product';

// ============================================
// PRINCIPIO: Single Responsibility Principle (SRP)
// Esta API tiene una sola responsabilidad: manejar la persistencia de productos en JSON
// ============================================

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Interfaz para datos serializados
interface SerializedProduct {
  type: 'food' | 'electronic' | 'clothing';
  id: string;
  name: string;
  acquisitionPrice: number;
  category: string;
  // Campos específicos
  expirationDate?: string;
  warrantyMonths?: number;
  brand?: string;
  size?: string;
  material?: string;
}

// Función para serializar productos
function serializeProduct(product: Product): SerializedProduct {
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

// Función para deserializar productos
function deserializeProduct(data: SerializedProduct): Product {
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

// GET - Obtener todos los productos
export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    const data: SerializedProduct[] = JSON.parse(fileContent);
    const products = data.map(deserializeProduct);
    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    // Si el archivo no existe o está vacío, devolver array vacío
    return NextResponse.json([]);
  }
}

// POST - Agregar un nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct: SerializedProduct = body;

    // Leer productos existentes
    let products: SerializedProduct[] = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
      products = JSON.parse(fileContent);
    } catch (error) {
      // Si el archivo no existe, iniciamos con array vacío
      products = [];
    }

    // Agregar nuevo producto
    products.push(newProduct);

    // Guardar en archivo
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al agregar producto' }, { status: 500 });
  }
}

// DELETE - Eliminar un producto
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID no proporcionado' }, { status: 400 });
    }

    // Leer productos existentes
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    let products: SerializedProduct[] = JSON.parse(fileContent);

    // Filtrar el producto eliminado
    products = products.filter((p) => p.id !== id);

    // Guardar en archivo
    await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al eliminar producto' }, { status: 500 });
  }
}
