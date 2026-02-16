'use client';

import { Product } from '../models/Product';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart, onEdit, onDelete }: ProductCardProps) {
  const acquisitionPrice = product.getAcquisitionPrice();
  const priceWithProfit = acquisitionPrice * 1.20;
  const taxRate = product.getTaxRate();
  const finalPrice = product.calculatePrice();
  const profit = priceWithProfit - acquisitionPrice;
  const tax = finalPrice - priceWithProfit;

  return (
    <div style={styles.card}>
      <h3>{product.name}</h3>
      <p>{product.getInfo()}</p>
      <div style={styles.priceBreakdown}>
        <p style={styles.acquisitionPrice}>
          💵 Adquisición: ${formatCurrency(acquisitionPrice)}
        </p>
        <p style={styles.profitInfo}>
          + Ganancia (20%): ${formatCurrency(profit)}
        </p>
        <p style={styles.taxInfo}>
          + Impuesto ({(taxRate * 100).toFixed(0)}%): ${formatCurrency(tax)}
        </p>
        <hr style={styles.divider} />
        <p style={styles.finalPrice}>
          💰 Precio Final: ${formatCurrency(finalPrice)}
        </p>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => onAddToCart(product.id)}>
          🛒 Agregar
        </button>
        {onEdit && (
          <button style={styles.editButton} onClick={() => onEdit(product)}>
            ✏️ Editar
          </button>
        )}
        {onDelete && (
          <button style={styles.deleteButton} onClick={() => onDelete(product.id)}>
            🗑️ Eliminar
          </button>
        )}
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
  },
  priceBreakdown: {
    backgroundColor: '#f9f9f9',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  acquisitionPrice: {
    color: '#666',
    fontSize: '14px',
    margin: '4px 0',
  },
  profitInfo: {
    color: '#1976d2',
    fontSize: '13px',
    margin: '4px 0',
  },
  taxInfo: {
    color: '#f57c00',
    fontSize: '13px',
    margin: '4px 0',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #ddd',
    margin: '8px 0',
  },
  finalPrice: {
    color: '#2e7d32',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    margin: '4px 0',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  button: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '100px',
  },
  editButton: {
    backgroundColor: '#f57c00',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '100px',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '100px',
  },
};
