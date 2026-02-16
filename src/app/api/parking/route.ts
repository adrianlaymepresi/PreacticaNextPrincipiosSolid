import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ParkingRecord } from '@/models/ParkingRecord';

// ============================================
// PRINCIPIO: Single Responsibility Principle (SRP)
// Esta API tiene una sola responsabilidad: manejar la persistencia de registros de estacionamiento en JSON
// ============================================

const DATA_FILE = path.join(process.cwd(), 'data', 'parking.json');

// Interfaz para datos serializados
interface SerializedParkingRecord {
  id: string;
  vehiclePlate: string;
  entryTime: string;
  exitTime: string | null;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  feeCharged: number | null;
}

// Función para serializar registros de estacionamiento
function serializeRecord(record: ParkingRecord): SerializedParkingRecord {
  return {
    id: record.id,
    vehiclePlate: record.vehiclePlate,
    entryTime: record.entryTime.toISOString(),
    exitTime: record.exitTime ? record.exitTime.toISOString() : null,
    vehicleType: record.vehicleType,
    feeCharged: record.feeCharged,
  };
}

// Función para deserializar registros de estacionamiento
function deserializeRecord(data: SerializedParkingRecord): ParkingRecord {
  return new ParkingRecord(
    data.id,
    data.vehiclePlate,
    new Date(data.entryTime),
    data.exitTime ? new Date(data.exitTime) : null,
    data.vehicleType,
    data.feeCharged
  );
}

// GET - Obtener todos los registros
export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    const data: SerializedParkingRecord[] = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    // Si el archivo no existe o está vacío, devolver array vacío
    return NextResponse.json([]);
  }
}

// POST - Agregar un nuevo registro
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRecord: SerializedParkingRecord = body;

    // Leer registros existentes
    let records: SerializedParkingRecord[] = [];
    try {
      const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
      records = JSON.parse(fileContent);
    } catch (error) {
      records = [];
    }

    // Agregar nuevo registro
    records.push(newRecord);

    // Guardar en archivo
    await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al agregar registro' }, { status: 500 });
  }
}

// PUT - Actualizar un registro existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updatedRecord: SerializedParkingRecord = body;

    // Leer registros existentes
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    let records: SerializedParkingRecord[] = JSON.parse(fileContent);

    // Buscar y actualizar el registro
    const index = records.findIndex((r) => r.id === updatedRecord.id);
    if (index !== -1) {
      records[index] = updatedRecord;
    } else {
      return NextResponse.json({ success: false, error: 'Registro no encontrado' }, { status: 404 });
    }

    // Guardar en archivo
    await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');

    return NextResponse.json({ success: true, record: updatedRecord });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al actualizar registro' }, { status: 500 });
  }
}
