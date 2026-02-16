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
    border: '3px solid #e8f5e9',
    borderRadius: '16px',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 20px rgba(109, 76, 65, 0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    minWidth: '280px',
    maxWidth: '320px',
  } as React.CSSProperties,
  header: {
    borderBottom: '3px solid #4a7c3c',
    paddingBottom: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,
  name: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    color: '#2d5016',
    fontWeight: 'bold',
  } as React.CSSProperties,
  species: {
    display: 'inline-block',
    padding: '4px 12px',
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    color: '#2d5016',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid #6b9a54',
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
    padding: '12px',
    background: 'linear-gradient(135deg, #faf8f3 0%, #f5f1e8 100%)',
    borderRadius: '12px',
    border: '2px solid #e8f5e9',
  } as React.CSSProperties,
  icon: {
    fontSize: '28px',
    flexShrink: 0,
  } as React.CSSProperties,
  capabilityInfo: {
    flex: 1,
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#6d4c41',
  } as React.CSSProperties,
  speed: {
    marginTop: '4px',
    color: '#4a7c3c',
    fontWeight: 'bold',
    fontSize: '13px',
  } as React.CSSProperties,
  sound: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px',
    background: 'linear-gradient(135deg, #faf8f3 0%, #f5f1e8 100%)',
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: '12px',
    border: '2px solid #a1887f',
  } as React.CSSProperties,
  soundIcon: {
    fontSize: '20px',
  } as React.CSSProperties,
};

