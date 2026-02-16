import { ParkingRecord } from '../models/ParkingRecord';

export interface IParkingRateStrategy {
  calculateRate(record: ParkingRecord): number;
  getDescription(): string;
}
