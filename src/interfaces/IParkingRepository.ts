import { ParkingRecord } from '../models/ParkingRecord';

// ============================================
// PRINCIPIO: Dependency Inversion Principle (DIP)
// Interfaz abstracta para el repositorio de estacionamiento
// ============================================

export interface IParkingRepository {
  getAll(): ParkingRecord[];
  getById(id: string): ParkingRecord | undefined;
  add(record: ParkingRecord): void;
  update(record: ParkingRecord): void;
  getActiveRecords(): ParkingRecord[];
}
