import { Bird } from '../interfaces/BirdInterfaces';

interface BirdCardProps {
  bird: Bird;
  abilities: string[];
}

export default function BirdCard({ bird, abilities }: BirdCardProps) {
  return (
    <div style={styles.card}>
      <h3>{bird.name}</h3>
      <p><strong>Especie:</strong> {bird.species}</p>
      <p><strong>Sonido:</strong> {bird.makeSound()}</p>
      <div style={styles.abilities}>
        <strong>Habilidades:</strong>
        <ul style={styles.abilitiesUl}>
          {abilities.map((ability, index) => (
            <li key={index} style={styles.abilitiesLi}>{ability}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '250px',
  },
  abilities: {
    marginTop: '12px',
  },
  abilitiesUl: {
    marginLeft: '20px',
    marginTop: '8px',
    marginBottom: '0',
  },
  abilitiesLi: {
    marginBottom: '4px',
  },
};
