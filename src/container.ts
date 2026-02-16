import { JsonProductRepositorySync } from './repositories/JsonProductRepository';
import { JsonParkingRepository } from './repositories/JsonParkingRepository';
import { ProductService } from './services/ProductService';
import { ParkingService } from './services/ParkingService';
import { StandardRateStrategy } from './strategies/ParkingRateStrategies';

// ============================================
// PRINCIPIO: Dependency Inversion Principle (DIP)
// Aquí inyectamos las dependencias de forma centralizada
// Las dependencias ahora usan repositorios JSON que persisten datos en archivos
// siguiendo Clean Architecture colocando la capa de infraestructura (repositorios)
// separada de la lógica de negocio (servicios)
// ============================================

// Crear repositorios JSON (capa de infraestructura)
// Estos reemplazan los InMemory repositories manteniendo las mismas interfaces (DIP)
const productRepository = new JsonProductRepositorySync();
const parkingRepository = new JsonParkingRepository();

// Crear servicios con inyección de dependencias (capa de aplicación)
const productService = new ProductService(productRepository);
const parkingService = new ParkingService(parkingRepository, new StandardRateStrategy());

// Ya no inicializamos datos precargados
// Los datos ahora se gestionan a través de archivos JSON persistentes
// y se pueden agregar mediante la interfaz de usuario

export { productService, parkingService };
