'use client';

import Link from 'next/link';

export default function PrinciplesPage() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>📚 Principios SOLID - Documentación</h1>
        <nav style={styles.nav}>
          <Link href="/" style={styles.link}>Productos</Link>
          <Link href="/parking" style={styles.link}>Estacionamiento</Link>
          <Link href="/birds" style={styles.link}>Aves (ISP)</Link>
          <Link href="/principles" style={styles.link}>Principios SOLID</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <div style={styles.principleCard}>
            <h2 style={styles.principleTitle}>🔹 Single Responsibility Principle (SRP)</h2>
            <p style={styles.definition}>
              Una clase debe tener una sola razón para cambiar, es decir, una sola responsabilidad.
            </p>
            <div style={styles.implementation}>
              <h3>Implementación en el proyecto:</h3>
              <ul>
                <li><strong>ProductService:</strong> Solo maneja la lógica de productos</li>
                <li><strong>ParkingService:</strong> Solo maneja la lógica de estacionamiento</li>
                <li><strong>PriceCalculator:</strong> Solo calcula precios y descuentos</li>
                <li><strong>ParkingRecord:</strong> Solo representa un registro de estacionamiento</li>
              </ul>
              <p style={styles.benefit}>
                ✅ <strong>Beneficio:</strong> Cada clase es fácil de entender, probar y mantener.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.principleCard}>
            <h2 style={styles.principleTitle}>🔹 Open/Closed Principle (OCP)</h2>
            <p style={styles.definition}>
              Las entidades de software deben estar abiertas para extensión pero cerradas para modificación.
            </p>
            <div style={styles.implementation}>
              <h3>Implementación en el proyecto:</h3>
              <ul>
                <li>
                  <strong>Product (clase abstracta):</strong> Puedes crear nuevos tipos de productos
                  (FoodProduct, ElectronicProduct, ClothingProduct) sin modificar la clase base
                </li>
                <li>
                  <strong>IParkingRateStrategy:</strong> Puedes agregar nuevas estrategias de tarifa
                  (StandardRateStrategy, WeekendRateStrategy, VIPRateStrategy) sin modificar código existente
                </li>
              </ul>
              <p style={styles.codeExample}>
                Ejemplo: Para agregar un nuevo tipo de producto, solo necesitas crear una nueva clase
                que extienda Product, sin modificar el código existente.
              </p>
              <p style={styles.benefit}>
                ✅ <strong>Beneficio:</strong> Fácil agregar nuevas funcionalidades sin riesgo de romper lo existente.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.principleCard}>
            <h2 style={styles.principleTitle}>🔹 Liskov Substitution Principle (LSP)</h2>
            <p style={styles.definition}>
              Los objetos de una clase derivada deben poder reemplazar objetos de la clase base
              sin alterar el funcionamiento correcto del programa.
            </p>
            <div style={styles.implementation}>
              <h3>Implementación en el proyecto:</h3>
              <ul>
                <li>
                  <strong>FoodProduct, ElectronicProduct, ClothingProduct:</strong> Todos pueden
                  sustituir a Product sin problemas
                </li>
                <li>
                  Todos implementan calculatePrice() de manera consistente con el contrato de Product
                </li>
                <li>
                  El ProductService puede trabajar con cualquier tipo de Product sin saber su tipo concreto
                </li>
              </ul>
              <p style={styles.benefit}>
                ✅ <strong>Beneficio:</strong> Polimorfismo funcional y predecible.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.principleCard}>
            <h2 style={styles.principleTitle}>🔹 Interface Segregation Principle (ISP)</h2>
            <p style={styles.definition}>
              Los clientes no deben ser obligados a depender de interfaces que no usan.
            </p>
            <div style={styles.implementation}>
              <h3>Implementación en el proyecto:</h3>
              <ul>
                <li>
                  <strong>IFlyable, ISwimmable, IRunnable:</strong> Interfaces segregadas para aves
                </li>
                <li>
                  <strong>Eagle:</strong> Implementa solo IFlyable e IRunnable (no nada)
                </li>
                <li>
                  <strong>Penguin:</strong> Implementa solo ISwimmable e IRunnable (no vuela)
                </li>
                <li>
                  <strong>Ostrich:</strong> Implementa solo IRunnable (no vuela ni nada)
                </li>
                <li>
                  <strong>Duck:</strong> Implementa las tres interfaces (versátil)
                </li>
              </ul>
              <p style={styles.codeExample}>
                En lugar de tener una interfaz grande "Bird" con métodos fly(), swim(), run(),
                cada ave implementa solo las interfaces que necesita.
              </p>
              <p style={styles.benefit}>
                ✅ <strong>Beneficio:</strong> Interfaces más cohesivas y clases más simples.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.principleCard}>
            <h2 style={styles.principleTitle}>🔹 Dependency Inversion Principle (DIP)</h2>
            <p style={styles.definition}>
              Las clases de alto nivel no deben depender de clases de bajo nivel.
              Ambas deben depender de abstracciones.
            </p>
            <div style={styles.implementation}>
              <h3>Implementación en el proyecto:</h3>
              <ul>
                <li>
                  <strong>ProductService:</strong> Depende de IProductRepository (abstracción),
                  no de InMemoryProductRepository (implementación concreta)
                </li>
                <li>
                  <strong>ParkingService:</strong> Depende de IParkingRepository y IParkingRateStrategy
                  (abstracciones)
                </li>
                <li>
                  Las dependencias se inyectan en el constructor (Dependency Injection)
                </li>
                <li>
                  Ver archivo container.ts donde se configuran las dependencias
                </li>
              </ul>
              <p style={styles.codeExample}>
                Ejemplo: Puedes reemplazar InMemoryProductRepository con DatabaseProductRepository
                sin modificar ProductService, solo cambiando la inyección de dependencias.
              </p>
              <p style={styles.benefit}>
                ✅ <strong>Beneficio:</strong> Fácil testing, mantenimiento y cambio de implementaciones.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.summaryCard}>
            <h2>🎯 Resumen de la Arquitectura</h2>
            <p>Este proyecto demuestra todos los principios SOLID de forma práctica:</p>
            <ul style={styles.summaryList}>
              <li>
                <strong>Modelos:</strong> Product (abstracta), FoodProduct, ElectronicProduct,
                ClothingProduct, ParkingRecord
              </li>
              <li>
                <strong>Interfaces:</strong> IProductRepository, IParkingRepository,
                IParkingRateStrategy, IFlyable, ISwimmable, IRunnable
              </li>
              <li>
                <strong>Servicios:</strong> ProductService, ParkingService, PriceCalculator
                (con inyección de dependencias)
              </li>
              <li>
                <strong>Estrategias:</strong> StandardRateStrategy, WeekendRateStrategy,
                VIPRateStrategy
              </li>
              <li>
                <strong>Aves:</strong> Eagle, Duck, Penguin, Ostrich (demostración de ISP)
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '20px',
    textAlign: 'center' as const,
  },
  nav: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '4px',
  },
  main: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '20px',
  },
  principleCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  principleTitle: {
    color: '#1976d2',
    marginBottom: '16px',
  },
  definition: {
    fontSize: '18px',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f0f7ff',
    borderLeft: '4px solid #1976d2',
    borderRadius: '4px',
  },
  implementation: {
    marginTop: '20px',
  },
  codeExample: {
    backgroundColor: '#f9f9f9',
    padding: '12px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    margin: '12px 0',
  },
  benefit: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginTop: '12px',
  },
  summaryCard: {
    backgroundColor: '#e8f5e9',
    padding: '30px',
    borderRadius: '8px',
    border: '2px solid #4caf50',
  },
  summaryList: {
    lineHeight: '1.8',
  },
};
