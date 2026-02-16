import { ParkingRecord } from '../models/ParkingRecord';

// ============================================
// PRINCIPIO: Open/Closed Principle (OCP)
// Esta interfaz permite agregar nuevas estrategias de tarifa sin modificar código existente
// ============================================

export interface IParkingRateStrategy {
  calculateRate(record: ParkingRecord): number;
  getDescription(): string;
}
