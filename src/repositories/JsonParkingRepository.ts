import { ParkingRecord } from '../models/ParkingRecord';
import { IParkingRepository } from '../interfaces/IParkingRepository';

// ============================================
// PRINCIPIO: Dependency Inversion Principle (DIP)
// Implementación concreta del repositorio que usa archivos JSON como persistencia
// Puede reemplazar a InMemoryParkingRepository sin afectar el código que depende de la interfaz
// PRINCIPIO: Single Responsibility Principle (SRP)
// Su única responsabilidad es manejar la persistencia de registros de estacionamiento mediante la API
// ============================================

interface SerializedParkingRecord {
  id: string;
  vehiclePlate: string;
  entryTime: string;
  exitTime: string | null;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  feeCharged: number | null;
}

export class JsonParkingRepository implements IParkingRepository {
  private cache: ParkingRecord[] = [];
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
      const response = await fetch('/api/parking', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: SerializedParkingRecord[] = await response.json();
      this.cache = data.map(this.deserializeRecord);
    } catch (error) {
      console.error('Error loading parking records from API:', error);
      this.cache = [];
    }
  }

  private deserializeRecord(data: SerializedParkingRecord): ParkingRecord {
    return new ParkingRecord(
      data.id,
      data.vehiclePlate,
      new Date(data.entryTime),
      data.exitTime ? new Date(data.exitTime) : null,
      data.vehicleType,
      data.feeCharged
    );
  }

  private serializeRecord(record: ParkingRecord): SerializedParkingRecord {
    return {
      id: record.id,
      vehiclePlate: record.vehiclePlate,
      entryTime: record.entryTime.toISOString(),
      exitTime: record.exitTime ? record.exitTime.toISOString() : null,
      vehicleType: record.vehicleType,
      feeCharged: record.feeCharged,
    };
  }

  getAll(): ParkingRecord[] {
    return [...this.cache];
  }

  getById(id: string): ParkingRecord | undefined {
    return this.cache.find((r) => r.id === id);
  }

  add(record: ParkingRecord): void {
    const serialized = this.serializeRecord(record);
    
    // Llamada asíncrona sin esperar (fire and forget)
    fetch('/api/parking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serialized),
    }).catch((error) => console.error('Error adding parking record:', error));

    // Actualizar caché local inmediatamente para respuesta rápida en UI
    this.cache.push(record);
  }

  update(record: ParkingRecord): void {
    const serialized = this.serializeRecord(record);
    
    // Llamada asíncrona sin esperar (fire and forget)
    fetch('/api/parking', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serialized),
    }).catch((error) => console.error('Error updating parking record:', error));

    // Actualizar caché local inmediatamente para respuesta rápida en UI
    const index = this.cache.findIndex((r) => r.id === record.id);
    if (index !== -1) {
      this.cache[index] = record;
    }
  }

  getActiveRecords(): ParkingRecord[] {
    return this.cache.filter((r) => r.isActive());
  }
}
