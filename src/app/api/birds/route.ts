import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DynamicBird, BirdCapabilities } from '@/models/birds/DynamicBird';

// ============================================
// PRINCIPIO: Single Responsibility Principle (SRP)
// Esta API tiene una sola responsabilidad: manejar la persistencia de aves personalizadas en JSON
// ============================================

const DATA_FILE = path.join(process.cwd(), 'data', 'birds.json');

// Interfaz para datos serializados
interface SerializedBird {
  name: string;
  species: string;
  capabilities: BirdCapabilities;
}

// Función para serializar aves
function serializeBird(bird: DynamicBird): SerializedBird {
  return {
    name: bird.name,
    species: bird.species,
    capabilities: bird.getCapabilities(),
  };
}

// Función para deserializar aves
function deserializeBird(data: SerializedBird): DynamicBird {
  return new DynamicBird(data.name, data.species, data.capabilities);
}

// GET - Obtener todas las aves personalizadas
export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    const data: SerializedBird[] = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    // Si el archivo no existe o está vacío, devolver array vacío
    return NextResponse.json([]);
  }
}

// POST - Agregar una nueva ave personalizada
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBird: SerializedBird = body;

    // Leer aves existentes
    let birds: SerializedBird[] = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
      birds = JSON.parse(fileContent);
    } catch (error) {
      birds = [];
    }

    // Agregar nueva ave
    birds.push(newBird);

    // Guardar en archivo
    await fs.writeFile(DATA_FILE, JSON.stringify(birds, null, 2), 'utf-8');

    return NextResponse.json({ success: true, bird: newBird });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al agregar ave' }, { status: 500 });
  }
}

// DELETE - Eliminar todas las aves (para limpiar)
export async function DELETE() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al limpiar aves' }, { status: 500 });
  }
}
