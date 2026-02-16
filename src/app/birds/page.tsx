'use client';

import { useState, useEffect } from 'react';
import BirdCard from '../../components/BirdCard';
import { DynamicBird, BirdCapabilities } from '../../models/birds/DynamicBird';
import { IFlyable, ISwimmable, IRunnable, IWalkable } from '../../interfaces/BirdInterfaces';
import Link from 'next/link';

// Interfaz para datos serializados
interface SerializedBird {
  name: string;
  species: string;
  capabilities: BirdCapabilities;
}

export default function BirdsPage() {
  // Estado para aves (todas se persisten en JSON)
  const [birds, setBirds] = useState<DynamicBird[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cargar aves desde la API al montar el componente
  useEffect(() => {
    loadBirds();
  }, []);

  const loadBirds = async () => {
    try {
      const response = await fetch('/api/birds', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: SerializedBird[] = await response.json();
      const loadedBirds = data.map(
        (b) => new DynamicBird(b.name, b.species, b.capabilities)
      );
      setBirds(loadedBirds);
    } catch (error) {
      console.error('Error loading custom birds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBirdToAPI = async (bird: DynamicBird) => {
    try {
      const serialized: SerializedBird = {
        name: bird.name,
        species: bird.species,
        capabilities: bird.getCapabilities(),
      };

      await fetch('/api/birds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serialized),
      });
    } catch (error) {
      console.error('Error saving bird:', error);
    }
  };
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    canFly: false,
    flyDescription: '',
    flySpeed: '',
    canSwim: false,
    swimDescription: '',
    swimDepth: '',
    canRun: false,
    runDescription: '',
    runSpeed: '',
    canWalk: false,
    walkDescription: '',
    walkSpeed: '',
  });

  const getBirdAbilities = (bird: any): string[] => {
    const abilities: string[] = [];

    if ('fly' in bird && typeof bird.fly === 'function') {
      // Verificar si es DynamicBird y si puede volar
      if (bird instanceof DynamicBird && !bird.canFlyCheck()) {
        // Skip
      } else {
        try {
          const flyable = bird as IFlyable;
          abilities.push(`✈️ ${flyable.fly()} (${flyable.getFlyingSpeed()} km/h)`);
        } catch (e) {
          // Skip if can't fly
        }
      }
    }

    if ('swim' in bird && typeof bird.swim === 'function') {
      if (bird instanceof DynamicBird && !bird.canSwimCheck()) {
        // Skip
      } else {
        try {
          const swimmable = bird as ISwimmable;
          abilities.push(`🏊 ${swimmable.swim()} (${swimmable.getSwimmingDepth()} metros)`);
        } catch (e) {
          // Skip if can't swim
        }
      }
    }

    if ('run' in bird && typeof bird.run === 'function') {
      if (bird instanceof DynamicBird && !bird.canRunCheck()) {
        // Skip
      } else {
        try {
          const runnable = bird as IRunnable;
          abilities.push(`🏃 ${runnable.run()} (${runnable.getRunningSpeed()} km/h)`);
        } catch (e) {
          // Skip if can't run
        }
      }
    }

    if ('walk' in bird && typeof bird.walk === 'function') {
      if (bird instanceof DynamicBird && !bird.canWalkCheck()) {
        // Skip
      } else {
        try {
          const walkable = bird as IWalkable;
          abilities.push(`🚶 ${walkable.walk()} (${walkable.getWalkingSpeed()} km/h)`);
        } catch (e) {
          // Skip if can't walk
        }
      }
    }

    return abilities;
  };

  const handleAddBird = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.species) {
      alert('Por favor ingrese el nombre y la especie del ave');
      return;
    }

    if (!formData.canFly && !formData.canSwim && !formData.canRun && !formData.canWalk) {
      alert('El ave debe tener al menos una capacidad');
      return;
    }

    const capabilities: BirdCapabilities = {};

    if (formData.canFly) {
      capabilities.canFly = {
        description: formData.flyDescription || `${formData.name} vuela`,
        speed: parseInt(formData.flySpeed, 10) || 50,
      };
    }

    if (formData.canSwim) {
      capabilities.canSwim = {
        description: formData.swimDescription || `${formData.name} nada`,
        depth: parseInt(formData.swimDepth, 10) || 5,
      };
    }

    if (formData.canRun) {
      capabilities.canRun = {
        description: formData.runDescription || `${formData.name} corre`,
        speed: parseInt(formData.runSpeed, 10) || 20,
      };
    }

    if (formData.canWalk) {
      capabilities.canWalk = {
        description: formData.walkDescription || `${formData.name} camina`,
        speed: parseInt(formData.walkSpeed, 10) || 5,
      };
    }

    const newBird = new DynamicBird(formData.name, formData.species, capabilities);
    
    // Guardar en JSON a través de la API
    await saveBirdToAPI(newBird);
    
    // Recargar lista desde la API para asegurar sincronización
    await loadBirds();

    // Reset form
    setFormData({
      name: '',
      species: '',
      canFly: false,
      flyDescription: '',
      flySpeed: '',
      canSwim: false,
      swimDescription: '',
      swimDepth: '',
      canRun: false,
      runDescription: '',
      runSpeed: '',
      canWalk: false,
      walkDescription: '',
      walkSpeed: '',
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🦅 Veterinaria de Aves</h1>
        <nav style={styles.nav}>
          <Link href="/" style={styles.link}>Productos</Link>
          <Link href="/parking" style={styles.link}>Estacionamiento</Link>
          <Link href="/birds" style={styles.link}>Aves (ISP)</Link>
          <Link href="/principles" style={styles.link}>Principios SOLID</Link>
        </nav>
      </header>

      <main style={styles.main}>
        {/* Sección del formulario para crear nuevas aves */}
        <section style={styles.section}>
          <h2>➕ Crear Nueva Ave</h2>
          <p style={styles.description}>
            Crea aves personalizadas y asígnales las capacidades que necesites.
            Esto demuestra el ISP: cada ave implementa solo las interfaces que necesita.
          </p>

          <form onSubmit={handleAddBird} style={styles.form}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Ave:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  placeholder="Ejemplo: Firindongo"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Especie:</label>
                <input
                  type="text"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  style={styles.input}
                  placeholder="Ejemplo: Loro"
                />
              </div>
            </div>

            <div style={styles.capabilitiesSection}>
              <h3>Capacidades del Ave:</h3>

              {/* Capacidad de volar */}
              <div style={styles.capabilityCard}>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={formData.canFly}
                    onChange={(e) => setFormData({ ...formData, canFly: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <label style={styles.checkboxLabel}>✈️ Puede Volar (IFlyable)</label>
                </div>
                {formData.canFly && (
                  <div style={styles.capabilityDetails}>
                    <input
                      type="text"
                      value={formData.flyDescription}
                      onChange={(e) => setFormData({ ...formData, flyDescription: e.target.value })}
                      placeholder="Descripción del vuelo"
                      style={styles.input}
                    />
                    <input
                      type="number"
                      value={formData.flySpeed}
                      onChange={(e) => setFormData({ ...formData, flySpeed: e.target.value })}
                      placeholder="Velocidad de vuelo (km/h)"
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              {/* Capacidad de nadar */}
              <div style={styles.capabilityCard}>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={formData.canSwim}
                    onChange={(e) => setFormData({ ...formData, canSwim: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <label style={styles.checkboxLabel}>🏊 Puede Nadar (ISwimmable)</label>
                </div>
                {formData.canSwim && (
                  <div style={styles.capabilityDetails}>
                    <input
                      type="text"
                      value={formData.swimDescription}
                      onChange={(e) => setFormData({ ...formData, swimDescription: e.target.value })}
                      placeholder="Descripción del nado"
                      style={styles.input}
                    />
                    <input
                      type="number"
                      value={formData.swimDepth}
                      onChange={(e) => setFormData({ ...formData, swimDepth: e.target.value })}
                      placeholder="Profundidad de nado (metros)"
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              {/* Capacidad de correr */}
              <div style={styles.capabilityCard}>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={formData.canRun}
                    onChange={(e) => setFormData({ ...formData, canRun: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <label style={styles.checkboxLabel}>🏃 Puede Correr (IRunnable)</label>
                </div>
                {formData.canRun && (
                  <div style={styles.capabilityDetails}>
                    <input
                      type="text"
                      value={formData.runDescription}
                      onChange={(e) => setFormData({ ...formData, runDescription: e.target.value })}
                      placeholder="Descripción de la carrera"
                      style={styles.input}
                    />
                    <input
                      type="number"
                      value={formData.runSpeed}
                      onChange={(e) => setFormData({ ...formData, runSpeed: e.target.value })}
                      placeholder="Velocidad de carrera (km/h)"
                      style={styles.input}
                    />
                  </div>
                )}
              </div>

              {/* Capacidad de caminar */}
              <div style={styles.capabilityCard}>
                <div style={styles.checkboxGroup}>
                  <input
                    type="checkbox"
                    checked={formData.canWalk}
                    onChange={(e) => setFormData({ ...formData, canWalk: e.target.checked })}
                    style={styles.checkbox}
                  />
                  <label style={styles.checkboxLabel}>🚶 Puede Caminar (IWalkable)</label>
                </div>
                {formData.canWalk && (
                  <div style={styles.capabilityDetails}>
                    <input
                      type="text"
                      value={formData.walkDescription}
                      onChange={(e) => setFormData({ ...formData, walkDescription: e.target.value })}
                      placeholder="Descripción de la caminata"
                      style={styles.input}
                    />
                    <input
                      type="number"
                      value={formData.walkSpeed}
                      onChange={(e) => setFormData({ ...formData, walkSpeed: e.target.value })}
                      placeholder="Velocidad de caminata (km/h)"
                      style={styles.input}
                    />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              ➕ Agregar Ave
            </button>
          </form>
        </section>

        {/* Galería de Aves */}
        <section style={styles.section}>
          <h2>🦅 Galería de Aves, Cantidad Disponible: {birds.length}</h2>
          <p style={styles.description}>
            Cada ave implementa solo las interfaces que necesita. No todas las aves pueden volar,
            nadar, correr o caminar. Este es un ejemplo perfecto del ISP: las interfaces están segregadas
            según las capacidades específicas.
          </p>

          {isLoading ? (
            <p style={styles.description}>⏳ Cargando aves...</p>
          ) : birds.length === 0 ? (
            <p style={styles.description}>📝 No hay aves registradas. ¡Crea tu primera ave arriba!</p>
          ) : (
            <div style={styles.grid}>
              {birds.map((bird, index) => (
                <BirdCard 
                  key={index} 
                  bird={bird} 
                  abilities={getBirdAbilities(bird)} 
                />
              ))}
            </div>
          )}
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#666',
    marginBottom: '20px',
  },
  legend: {
    backgroundColor: '#e3f2fd',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  legendUl: {
    marginLeft: '20px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  legendLi: {
    marginBottom: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  analysisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  analysisCard: {
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  reason: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: '8px',
  },
  // Estilos del formulario
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  capabilitiesSection: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  capabilityCard: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    border: '1px solid #e0e0e0',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
  },
  capabilityDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '12px',
    paddingLeft: '28px',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
};
