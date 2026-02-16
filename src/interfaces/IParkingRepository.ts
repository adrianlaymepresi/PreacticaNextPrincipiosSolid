import { ParkingRecord } from '../models/ParkingRecord';

export interface IParkingRepository {
  getAll(): ParkingRecord[];
  getById(id: string): ParkingRecord | undefined;
  add(record: ParkingRecord): void;
  update(record: ParkingRecord): void;
  getActiveRecords(): ParkingRecord[];
}
