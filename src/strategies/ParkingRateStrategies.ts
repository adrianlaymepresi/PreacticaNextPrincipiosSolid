import { ParkingRecord } from '../models/ParkingRecord';
import { IParkingRateStrategy } from '../interfaces/IParkingRateStrategy';

// ============================================
// PRINCIPIO: Open/Closed Principle (OCP)
// Implementaciones concretas de estrategias de tarifa
// Podemos agregar nuevas estrategias sin modificar las existentes
// ============================================

export class StandardRateStrategy implements IParkingRateStrategy {
  private ratePerHour: number = 10; // $10 por hora

  calculateRate(record: ParkingRecord): number {
    const hours = record.getDurationInHours();
    let rate = hours * this.ratePerHour;

    // Ajuste por tipo de vehículo
    if (record.vehicleType === 'truck') {
      rate = rate * 1.5;
    } else if (record.vehicleType === 'motorcycle') {
      rate = rate * 0.5;
    }

    return rate;
  }

  getDescription(): string {
    return 'Tarifa estándar: $2000/hora';
  }
}

export class WeekendRateStrategy implements IParkingRateStrategy {
  private ratePerHour: number = 8; // $8 por hora (descuento de fin de semana)

  calculateRate(record: ParkingRecord): number {
    const hours = record.getDurationInHours();
    let rate = hours * this.ratePerHour;

    if (record.vehicleType === 'truck') {
      rate = rate * 1.5;
    } else if (record.vehicleType === 'motorcycle') {
      rate = rate * 0.5;
    }

    return rate;
  }

  getDescription(): string {
    return 'Tarifa de fin de semana: $1500/hora';
  }
}

export class VIPRateStrategy implements IParkingRateStrategy {
  calculateRate(record: ParkingRecord): number {
    // Los VIP no pagan
    return 0;
  }

  getDescription(): string {
    return 'Tarifa VIP: Gratis';
  }
}
