'use client';

import { useState, useEffect } from 'react';
import { parkingService } from '../../container';
import ParkingRecordCard from '../../components/ParkingRecordCard';
import { ParkingRecord } from '../../models/ParkingRecord';
import Link from 'next/link';
import { StandardRateStrategy, WeekendRateStrategy, VIPRateStrategy } from '../../strategies/ParkingRateStrategies';

interface SerializedParkingRecord {
  id: string;
  vehiclePlate: string;
  entryTime: string;
  exitTime: string | null;
  vehicleType: 'car' | 'motorcycle' | 'truck';
  feeCharged: number | null;
}

function deserializeRecord(data: SerializedParkingRecord): ParkingRecord {
  return new ParkingRecord(
    data.id,
    data.vehiclePlate,
    new Date(data.entryTime),
    data.exitTime ? new Date(data.exitTime) : null,
    data.vehicleType,
    data.feeCharged
  );
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ParkingPage() {
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState<'car' | 'motorcycle' | 'truck'>('car');
  const [lastFee, setLastFee] = useState<number | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<'standard' | 'weekend' | 'vip'>('standard');

  // Cargar registros desde la API
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/parking', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: SerializedParkingRecord[] = await response.json();
      const loadedRecords = data.map(deserializeRecord);
      setRecords(loadedRecords);
    } catch (error) {
      console.error('Error loading parking records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeRecords = records.filter(r => r.isActive());
  const allRecords = records;

  const handleRegisterEntry = async () => {
    if (vehiclePlate.trim()) {
      const newRecord = new ParkingRecord(
        Math.random().toString(36).substr(2, 9),
        vehiclePlate,
        new Date(),
        null,
        vehicleType,
        null
      );

      const serialized: SerializedParkingRecord = {
        id: newRecord.id,
        vehiclePlate: newRecord.vehiclePlate,
        entryTime: newRecord.entryTime.toISOString(),
        exitTime: null,
        vehicleType: newRecord.vehicleType,
        feeCharged: null,
      };

      try {
        const response = await fetch('/api/parking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serialized),
        });

        if (response.ok) {
          await loadRecords();
          setVehiclePlate('');
        }
      } catch (error) {
        console.error('Error registering entry:', error);
      }
    }
  };

  const handleRegisterExit = async (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record || !record.isActive()) {
      return;
    }

    // Calcular tarifa usando la estrategia actual
    record.exitTime = new Date();
    let strategy;
    if (selectedStrategy === 'standard') {
      strategy = new StandardRateStrategy();
    } else if (selectedStrategy === 'weekend') {
      strategy = new WeekendRateStrategy();
    } else {
      strategy = new VIPRateStrategy();
    }
    const fee = strategy.calculateRate(record);
    record.feeCharged = fee;

    const serialized: SerializedParkingRecord = {
      id: record.id,
      vehiclePlate: record.vehiclePlate,
      entryTime: record.entryTime.toISOString(),
      exitTime: record.exitTime.toISOString(),
      vehicleType: record.vehicleType,
      feeCharged: fee,
    };

    try {
      const response = await fetch('/api/parking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serialized),
      });

      if (response.ok) {
        await loadRecords();
        setLastFee(fee);
      }
    } catch (error) {
      console.error('Error registering exit:', error);
    }
  };

  const handleChangeStrategy = (strategy: 'standard' | 'weekend' | 'vip') => {
    setSelectedStrategy(strategy);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🚗 Control de Estacionamiento</h1>
        <nav style={styles.nav}>
          <Link href="/" style={styles.link}>Inicio</Link>
          <Link href="/products" style={styles.link}>Productos</Link>
          <Link href="/parking" style={styles.link}>Estacionamiento</Link>
          <Link href="/birds" style={styles.link}>Aves</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2>Registrar Entrada</h2>
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Placa del vehículo"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              style={styles.input}
            />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
              style={styles.select}
            >
              <option value="car">Auto x1</option>
              <option value="motorcycle">Moto x0.5</option>
              <option value="truck">Camión x1.5</option>
            </select>
            <button onClick={handleRegisterEntry} style={styles.button}>
              Registrar Entrada
            </button>
          </div>

          <div style={styles.strategySelector}>
            <h3>Tarifa Actual: {
              selectedStrategy === 'standard' ? '🟢 Estándar ($10/h)' :
              selectedStrategy === 'weekend' ? '🟡 Fin de Semana ($8/h)' :
              '⭐ VIP (Gratis)'
            }</h3>
            <p style={styles.strategyLabel}>Cambiar tarifa:</p>
            <div style={styles.strategyButtons}>
              <button 
                onClick={() => handleChangeStrategy('standard')} 
                style={{
                  ...styles.strategyButton,
                  ...(selectedStrategy === 'standard' ? styles.strategyButtonActive : {})
                }}
              >
                {selectedStrategy === 'standard' && '✓ '}Estándar ($10/h)
              </button>
              <button 
                onClick={() => handleChangeStrategy('weekend')} 
                style={{
                  ...styles.strategyButton,
                  ...(selectedStrategy === 'weekend' ? styles.strategyButtonActive : {})
                }}
              >
                {selectedStrategy === 'weekend' && '✓ '}Fin de Semana ($8/h)
              </button>
              <button 
                onClick={() => handleChangeStrategy('vip')} 
                style={{
                  ...styles.strategyButton,
                  ...(selectedStrategy === 'vip' ? styles.strategyButtonActive : {})
                }}
              >
                {selectedStrategy === 'vip' && '✓ '}VIP (Gratis)
              </button>
            </div>
          </div>

          {lastFee !== null && (
            <div style={styles.feeAlert}>
              <h3>Última Tarifa Cobrada: ${formatCurrency(lastFee)}</h3>
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2>Vehículos Activos ({activeRecords.length})</h2>
          <div style={styles.grid}>
            {activeRecords.map((record) => (
              <ParkingRecordCard
                key={record.id}
                record={record}
                onRegisterExit={handleRegisterExit}
              />
            ))}
          </div>
          {activeRecords.length === 0 && (
            <p style={styles.emptyMessage}>No hay vehículos en el estacionamiento</p>
          )}
        </section>

        <section style={styles.section}>
          <h2>Historial Completo ({allRecords.length})</h2>
          <div style={styles.grid}>
            {allRecords.slice(0, 10).map((record) => (
              <ParkingRecordCard key={record.id} record={record} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f1e8',
  },
  header: {
    background: 'linear-gradient(135deg, #2d5016 0%, #4a7c3c 100%)',
    color: '#faf8f3',
    padding: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 4px 12px rgba(45, 80, 22, 0.3)',
  },
  nav: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  link: {
    color: '#faf8f3',
    textDecoration: 'none',
    padding: '8px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  main: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '16px',
    marginBottom: '20px',
    boxShadow: '0 6px 20px rgba(109, 76, 65, 0.15)',
    border: '2px solid #e8f5e9',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #e8f5e9',
    backgroundColor: '#ffffff',
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #e8f5e9',
    backgroundColor: '#ffffff',
    color: '#6d4c41',
  },
  button: {
    background: 'linear-gradient(135deg, #4a7c3c 0%, #6b9a54 100%)',
    color: '#faf8f3',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    boxShadow: '0 3px 10px rgba(74, 124, 60, 0.3)',
  },
  strategySelector: {
    marginTop: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, #faf8f3 0%, #f5f1e8 100%)',
    borderRadius: '12px',
    border: '2px solid #e8f5e9',
  },
  strategyLabel: {
    fontSize: '14px',
    color: '#8d6e63',
    marginBottom: '8px',
    marginTop: '12px',
    fontWeight: 'bold',
  },
  strategyButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  strategyButton: {
    backgroundColor: '#ffffff',
    color: '#6d4c41',
    border: '2px solid #e8f5e9',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
  },
  strategyButtonActive: {
    background: 'linear-gradient(135deg, #4a7c3c 0%, #6b9a54 100%)',
    color: '#faf8f3',
    border: '2px solid #2d5016',
    fontWeight: 'bold' as const,
    transform: 'scale(1.05)',
    boxShadow: '0 3px 10px rgba(74, 124, 60, 0.3)',
  },
  feeAlert: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#e8f5e9',
    borderRadius: '12px',
    color: '#2d5016',
    fontWeight: 'bold',
    border: '2px solid #4a7c3c',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  emptyMessage: {
    textAlign: 'center' as const,
    color: '#8d6e63',
    padding: '40px',
    backgroundColor: '#faf8f3',
    borderRadius: '12px',
    border: '2px dashed #e8f5e9',
    fontStyle: 'italic',
  },
};
