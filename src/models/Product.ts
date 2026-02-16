// ============================================
// PRINCIPIO: Open/Closed Principle (OCP) y Liskov Substitution Principle (LSP)
// Esta clase abstracta está ABIERTA para extensión pero CERRADA para modificación
// Las clases derivadas pueden sustituir a la clase base sin romper la funcionalidad
// ============================================

export abstract class Product {
  constructor(
    public id: string,
    public name: string,
    protected acquisitionPrice: number, // Precio de adquisición/compra
    public category: string
  ) {}

  // Método abstracto que DEBE ser implementado por las clases derivadas
  // Cada tipo de producto calcula su precio de venta con impuestos específicos
  abstract calculatePrice(): number;

  // Método abstracto para obtener el impuesto de la categoría
  abstract getTaxRate(): number;

  // Método concreto compartido por todas las clases derivadas
  getInfo(): string {
    return `${this.name} - Categoría: ${this.category}`;
  }

  getAcquisitionPrice(): number {
    return this.acquisitionPrice;
  }

  // Calcula el precio base con 20% de ganancia
  protected calculateBaseWithProfit(): number {
    return this.acquisitionPrice * 1.20; // 20% de ganancia
  }
}
