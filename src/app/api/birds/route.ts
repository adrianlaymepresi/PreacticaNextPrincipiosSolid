import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { DynamicBird, BirdCapabilities } from '@/models/birds/DynamicBird';

const DATA_FILE = path.join(process.cwd(), 'data', 'birds.json');

interface SerializedBird {
  name: string;
  species: string;
  capabilities: BirdCapabilities;
}

function serializeBird(bird: DynamicBird): SerializedBird {
  return {
    name: bird.name,
    species: bird.species,
    capabilities: bird.getCapabilities(),
  };
}

function deserializeBird(data: SerializedBird): DynamicBird {
  return new DynamicBird(data.name, data.species, data.capabilities);
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    const data: SerializedBird[] = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBird: SerializedBird = body;

    let birds: SerializedBird[] = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
      birds = JSON.parse(fileContent);
    } catch (error) {
      birds = [];
    }

    birds.push(newBird);

    await fs.writeFile(DATA_FILE, JSON.stringify(birds, null, 2), 'utf-8');

    return NextResponse.json({ success: true, bird: newBird });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al agregar ave' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al limpiar aves' }, { status: 500 });
  }
}
