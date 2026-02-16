'use client';

import { ParkingRecord } from '../models/ParkingRecord';

const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface ParkingRecordCardProps {
  record: ParkingRecord;
  onRegisterExit?: (recordId: string) => void;
}

export default function ParkingRecordCard({ record, onRegisterExit }: ParkingRecordCardProps) {
  return (
    <div style={styles.card}>
      <h3>Placa: {record.vehiclePlate}</h3>
      <p>Tipo: {record.vehicleType === 'car' ? 'Auto' : record.vehicleType === 'motorcycle' ? 'Moto' : 'Camión'}</p>
      <p>Entrada: {formatDateTime(record.entryTime)}</p>
      {record.exitTime ? (
        <>
          <p>Salida: {formatDateTime(record.exitTime)}</p>
          <p style={styles.duration}>Duración: {record.getDurationInHours()} hora(s)</p>
          {record.feeCharged !== null && (
            <p style={styles.feeCharged}>
              💰 Tarifa Cobrada: ${formatCurrency(record.feeCharged)}
            </p>
          )}
        </>
      ) : (
        <>
          <p style={styles.active}>ACTIVO</p>
          <p>Tiempo: {record.getDurationInHours()} hora(s)</p>
          {onRegisterExit && (
            <button style={styles.button} onClick={() => onRegisterExit(record.id)}>
              Registrar Salida
            </button>
          )}
        </>
      )}
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
  },
  active: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  duration: {
    color: '#666',
  },
  feeCharged: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '8px',
  },
  button: {
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '8px',
  },
};
