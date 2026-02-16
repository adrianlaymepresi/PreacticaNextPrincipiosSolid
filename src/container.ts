import { JsonProductRepositorySync } from './repositories/JsonProductRepository';
import { JsonParkingRepository } from './repositories/JsonParkingRepository';
import { ProductService } from './services/ProductService';
import { ParkingService } from './services/ParkingService';
import { StandardRateStrategy } from './strategies/ParkingRateStrategies';

const productRepository = new JsonProductRepositorySync();
const parkingRepository = new JsonParkingRepository();

const productService = new ProductService(productRepository);
const parkingService = new ParkingService(parkingRepository, new StandardRateStrategy());

export { productService, parkingService };
