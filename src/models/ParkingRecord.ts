// ============================================
// PRINCIPIO: Single Responsibility Principle (SRP)
// Esta clase tiene UNA SOLA responsabilidad: representar un registro de estacionamiento
// ============================================

export class ParkingRecord {
  constructor(
    public id: string,
    public vehiclePlate: string,
    public entryTime: Date,
    public exitTime: Date | null = null,
    public vehicleType: 'car' | 'motorcycle' | 'truck',
    public feeCharged: number | null = null // Tarifa cobrada al salir
  ) {}

  getDurationInHours(): number {
    const exit = this.exitTime || new Date();
    const duration = (exit.getTime() - this.entryTime.getTime()) / (1000 * 60 * 60);
    return Math.ceil(duration); // Redondear hacia arriba
  }

  isActive(): boolean {
    return this.exitTime === null;
  }
}
