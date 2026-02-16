import { Bird } from '../interfaces/BirdInterfaces';
import { DynamicBird } from '../models/birds/DynamicBird';

interface BirdCardProps {
  bird: Bird;
  abilities: string[];
}

export default function BirdCard({ bird, abilities }: BirdCardProps) {
  // Obtener capacidades específicas si es DynamicBird
  const capabilities = bird instanceof DynamicBird ? bird.getCapabilities() : null;

  return (
    <div style={styles.card}>
      {/* Header del ave */}
      <div style={styles.header}>
        <h2 style={styles.name}>{bird.name}</h2>
        <span style={styles.species}>{bird.species}</span>
      </div>

      {/* Características principales */}
      <div style={styles.mainInfo}>
        {capabilities?.canFly && (
          <div style={styles.capability}>
            <span style={styles.icon}>✈️</span>
            <div style={styles.capabilityInfo}>
              <strong>Vuelo:</strong> {capabilities.canFly.description}
              <div style={styles.speed}>{capabilities.canFly.speed} km/h</div>
            </div>
          </div>
        )}

        {capabilities?.canSwim && (
          <div style={styles.capability}>
            <span style={styles.icon}>🏊</span>
            <div style={styles.capabilityInfo}>
              <strong>Nado:</strong> {capabilities.canSwim.description}
              <div style={styles.speed}>Profundidad: {capabilities.canSwim.depth}m</div>
            </div>
          </div>
        )}

        {capabilities?.canRun && (
          <div style={styles.capability}>
            <span style={styles.icon}>🏃</span>
            <div style={styles.capabilityInfo}>
              <strong>Carrera:</strong> {capabilities.canRun.description}
              <div style={styles.speed}>{capabilities.canRun.speed} km/h</div>
            </div>
          </div>
        )}

        {capabilities?.canWalk && (
          <div style={styles.capability}>
            <span style={styles.icon}>🚶</span>
            <div style={styles.capabilityInfo}>
              <strong>Caminata:</strong> {capabilities.canWalk.description}
              <div style={styles.speed}>{capabilities.canWalk.speed} km/h</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    minWidth: '280px',
    maxWidth: '320px',
  } as React.CSSProperties,
  header: {
    borderBottom: '2px solid #1976d2',
    paddingBottom: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,
  name: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    color: '#1976d2',
    fontWeight: 'bold',
  } as React.CSSProperties,
  species: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
  } as React.CSSProperties,
  mainInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '16px',
  },
  capability: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  } as React.CSSProperties,
  icon: {
    fontSize: '28px',
    flexShrink: 0,
  } as React.CSSProperties,
  capabilityInfo: {
    flex: 1,
    fontSize: '14px',
    lineHeight: '1.6',
  } as React.CSSProperties,
  speed: {
    marginTop: '4px',
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: '13px',
  } as React.CSSProperties,
  sound: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#fff3e0',
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: '12px',
  } as React.CSSProperties,
  soundIcon: {
    fontSize: '20px',
  } as React.CSSProperties,
};

