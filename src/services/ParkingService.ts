import { ParkingRecord } from '../models/ParkingRecord';
import { IParkingRepository } from '../interfaces/IParkingRepository';
import { IParkingRateStrategy } from '../interfaces/IParkingRateStrategy';

export class ParkingService {
  constructor(
    private parkingRepository: IParkingRepository,
    private rateStrategy: IParkingRateStrategy
  ) {}

  registerEntry(
    vehiclePlate: string,
    vehicleType: 'car' | 'motorcycle' | 'truck'
  ): ParkingRecord {
    const record = new ParkingRecord(
      Math.random().toString(36).substr(2, 9),
      vehiclePlate,
      new Date(),
      null,
      vehicleType
    );
    this.parkingRepository.add(record);
    return record;
  }

  registerExit(recordId: string): { record: ParkingRecord; fee: number } | null {
    const record = this.parkingRepository.getById(recordId);
    if (!record || !record.isActive()) {
      return null;
    }

    record.exitTime = new Date();
    const fee = this.rateStrategy.calculateRate(record);
    record.feeCharged = fee; // Guardar la tarifa cobrada
    this.parkingRepository.update(record);

    return { record, fee };
  }

  getActiveRecords(): ParkingRecord[] {
    return this.parkingRepository.getActiveRecords();
  }

  getAllRecords(): ParkingRecord[] {
    return this.parkingRepository.getAll();
  }

  setRateStrategy(strategy: IParkingRateStrategy): void {
    this.rateStrategy = strategy;
  }
}
