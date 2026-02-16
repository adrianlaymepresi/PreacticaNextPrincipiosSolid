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
    border: '3px solid #e8f5e9',
    borderRadius: '16px',
    padding: '16px',
    margin: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 20px rgba(109, 76, 65, 0.15)',
    transition: 'transform 0.2s',
  },
  priceBreakdown: {
    background: 'linear-gradient(135deg, #faf8f3 0%, #f5f1e8 100%)',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '2px solid #e8f5e9',
  },
  acquisitionPrice: {
    color: '#8d6e63',
    fontSize: '14px',
    margin: '4px 0',
  },
  profitInfo: {
    color: '#4a7c3c',
    fontSize: '13px',
    margin: '4px 0',
    fontWeight: 'bold',
  },
  taxInfo: {
    color: '#8d6e63',
    fontSize: '13px',
    margin: '4px 0',
  },
  divider: {
    border: 'none',
    borderTop: '2px solid #e8f5e9',
    margin: '8px 0',
  },
  finalPrice: {
    color: '#2d5016',
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
    background: 'linear-gradient(135deg, #4a7c3c 0%, #6b9a54 100%)',
    color: '#faf8f3',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '100px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
  editButton: {
    background: 'linear-gradient(135deg, #8d6e63 0%, #a1887f 100%)',
    color: '#faf8f3',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '100px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
  deleteButton: {
    background: 'linear-gradient(135deg, #6d4c41 0%, #5d4037 100%)',
    color: '#faf8f3',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '100px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
};
