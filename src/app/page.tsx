import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🏪 Sistema de Gestión SOLID</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.cardsContainer}>
          <Link href="/products" style={styles.cardLink}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>🛒</div>
              <h3 style={styles.cardTitle}>Productos</h3>
              <p style={styles.cardDescription}>
                Gestión completa de inventario con catálogo de productos, 
                cálculo automático de precios, impuestos y carrito de compras.
              </p>
            </div>
          </Link>

          <Link href="/parking" style={styles.cardLink}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>🚗</div>
              <h3 style={styles.cardTitle}>Estacionamiento</h3>
              <p style={styles.cardDescription}>
                Control de entrada y salida de vehículos con cálculo de tarifas
                mediante estrategias configurables.
              </p>
            </div>
          </Link>

          <Link href="/birds" style={styles.cardLink}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>🦅</div>
              <h3 style={styles.cardTitle}>Aves</h3>
              <p style={styles.cardDescription}>
                Catálogo de aves con capacidades dinámicas que demuestra el
                principio de segregación de interfaces (ISP).
              </p>
            </div>
          </Link>
        </div>

        <section style={styles.principlesSection}>
          <h3 style={styles.principlesTitle}>Principios SOLID Implementados</h3>
          <div style={styles.principlesGrid}>
            <div style={styles.principleCard}>
              <strong>SRP</strong>
              <p>Single Responsibility</p>
            </div>
            <div style={styles.principleCard}>
              <strong>OCP</strong>
              <p>Open/Closed</p>
            </div>
            <div style={styles.principleCard}>
              <strong>LSP</strong>
              <p>Liskov Substitution</p>
            </div>
            <div style={styles.principleCard}>
              <strong>ISP</strong>
              <p>Interface Segregation</p>
            </div>
            <div style={styles.principleCard}>
              <strong>DIP</strong>
              <p>Dependency Inversion</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>Sistema desarrollado con Next.js, TypeScript y Clean Architecture</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center' as const,
  },
  subtitle: {
    marginTop: '10px',
    fontSize: '16px',
    opacity: 0.9,
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    width: '100%',
  },
  hero: {
    textAlign: 'center' as const,
    marginBottom: '50px',
  },
  heroTitle: {
    fontSize: '32px',
    color: '#333',
    marginBottom: '16px',
  },
  heroText: {
    fontSize: '18px',
    color: '#666',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '50px',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  cardIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '24px',
    color: '#1976d2',
    marginBottom: '12px',
  },
  cardDescription: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '20px',
    flex: 1,
  },
  cardFeatures: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  feature: {
    fontSize: '14px',
    color: '#4caf50',
    fontWeight: 500,
  },
  principlesSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
  },
  principlesTitle: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  principlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
  },
  principleCard: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '2px solid #1976d2',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center' as const,
    padding: '20px',
    marginTop: 'auto',
  },
};
