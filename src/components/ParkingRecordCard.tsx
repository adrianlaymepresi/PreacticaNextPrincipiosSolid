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
    border: '3px solid #e8f5e9',
    borderRadius: '16px',
    padding: '16px',
    margin: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 20px rgba(109, 76, 65, 0.15)',
    transition: 'transform 0.2s',
  },
  active: {
    color: '#4a7c3c',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  duration: {
    color: '#8d6e63',
  },
  feeCharged: {
    color: '#2d5016',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '8px',
  },
  button: {
    background: 'linear-gradient(135deg, #6d4c41 0%, #5d4037 100%)',
    color: '#faf8f3',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '8px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
};
