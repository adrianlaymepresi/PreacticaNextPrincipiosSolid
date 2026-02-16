import { ParkingRecord } from '../models/ParkingRecord';
import { IParkingRateStrategy } from '../interfaces/IParkingRateStrategy';

export class StandardRateStrategy implements IParkingRateStrategy {
  private ratePerHour: number = 10;

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
    return 'Tarifa estándar: $2000/hora';
  }
}

export class WeekendRateStrategy implements IParkingRateStrategy {
  private ratePerHour: number = 8;

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
    return 0;
  }

  getDescription(): string {
    return 'Tarifa VIP: Gratis';
  }
}
