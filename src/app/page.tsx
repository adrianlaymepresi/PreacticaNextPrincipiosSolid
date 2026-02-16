'use client';

import { useState, useEffect } from 'react';
import { productService } from '../container';
import ProductCard from '../components/ProductCard';
import { PriceCalculator } from '../services/PriceCalculator';
import { FoodProduct } from '../models/FoodProduct';
import { ElectronicProduct } from '../models/ElectronicProduct';
import { ClothingProduct } from '../models/ClothingProduct';
import { Product } from '../models/Product';
import Link from 'next/link';

// Interfaces para datos serializados
interface SerializedProduct {
  type: 'food' | 'electronic' | 'clothing';
  id: string;
  name: string;
  acquisitionPrice: number;
  category: string;
  expirationDate?: string;
  warrantyMonths?: number;
  brand?: string;
  size?: string;
  material?: string;
}

// Función para deserializar productos
function deserializeProduct(data: SerializedProduct): Product {
  switch (data.type) {
    case 'food':
      return new FoodProduct(
        data.id,
        data.name,
        data.acquisitionPrice,
        data.expirationDate ? new Date(data.expirationDate) : undefined
      );
    case 'electronic':
      return new ElectronicProduct(
        data.id,
        data.name,
        data.acquisitionPrice,
        data.warrantyMonths || 12,
        data.brand || 'Genérico'
      );
    case 'clothing':
      return new ClothingProduct(
        data.id,
        data.name,
        data.acquisitionPrice,
        data.size || 'M',
        data.material || 'Algodón'
      );
    default:
      throw new Error('Unknown product type');
  }
}

// Función para formatear números de manera consistente
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Home() {
  const [cart, setCart] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [acquisitionPrice, setAcquisitionPrice] = useState('');
  const [category, setCategory] = useState<'Alimentos' | 'Electrónicos' | 'Ropa'>('Alimentos');
  
  // Campos específicos por categoría
  const [expirationDate, setExpirationDate] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('12');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('M');
  const [material, setMaterial] = useState('');

  const priceCalculator = new PriceCalculator();

  // Cargar productos desde la API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data: SerializedProduct[] = await response.json();
      const loadedProducts = data.map(deserializeProduct);
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (productId: string) => {
    setCart([...cart, productId]);
  };

  const calculateTotal = () => {
    let total = 0;
    for (const id of cart) {
      const product = products.find(p => p.id === id);
      if (product) {
        total += product.calculatePrice();
      }
    }
    return total;
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setAcquisitionPrice(product.getAcquisitionPrice().toString());
    setCategory(product.category as any);
    
    if (product instanceof FoodProduct) {
      const expDate = (product as any).expirationDate;
      setExpirationDate(expDate ? new Date(expDate).toISOString().split('T')[0] : '');
    } else if (product instanceof ElectronicProduct) {
      setWarrantyMonths(((product as any).warrantyMonths || 12).toString());
      setBrand((product as any).brand || '');
    } else if (product instanceof ClothingProduct) {
      setSize((product as any).size || 'M');
      setMaterial((product as any).material || '');
    }
    
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        await loadProducts(); // Recargar lista
        alert('Producto eliminado exitosamente');
      } else {
        alert('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar producto');
    }
  };

  const serializeProduct = (product: Product): SerializedProduct => {
    const base = {
      id: product.id,
      name: product.name,
      acquisitionPrice: product.getAcquisitionPrice(),
      category: product.category,
    };

    if (product instanceof FoodProduct) {
      return {
        ...base,
        type: 'food',
        expirationDate: (product as any).expirationDate?.toISOString(),
      };
    } else if (product instanceof ElectronicProduct) {
      return {
        ...base,
        type: 'electronic',
        warrantyMonths: (product as any).warrantyMonths,
        brand: (product as any).brand,
      };
    } else if (product instanceof ClothingProduct) {
      return {
        ...base,
        type: 'clothing',
        size: (product as any).size,
        material: (product as any).material,
      };
    }

    throw new Error('Unknown product type');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !acquisitionPrice) {
      alert('Complete los campos obligatorios');
      return;
    }

    const price = parseFloat(acquisitionPrice);
    if (isNaN(price) || price <= 0) {
      alert('Ingrese un precio válido');
      return;
    }

    try {
      let product: Product;
      const id = editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9);

      if (category === 'Alimentos') {
        const expDate = expirationDate ? new Date(expirationDate) : undefined;
        product = new FoodProduct(id, productName, price, expDate);
      } else if (category === 'Electrónicos') {
        product = new ElectronicProduct(id, productName, price, parseInt(warrantyMonths), brand || 'Genérico');
      } else if (category === 'Ropa') {
        product = new ClothingProduct(id, productName, price, size, material || 'Algodón');
      } else {
        throw new Error('Invalid category');
      }

      const serialized = serializeProduct(product);

      if (editingProduct) {
        // Actualizar producto existente - primero eliminar, luego agregar
        await fetch(`/api/products?id=${editingProduct.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Agregar producto (nuevo o actualizado)
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serialized),
      });

      if (response.ok) {
        await loadProducts(); // Recargar lista
        
        // Limpiar formulario
        setProductName('');
        setAcquisitionPrice('');
        setExpirationDate('');
        setWarrantyMonths('12');
        setBrand('');
        setSize('M');
        setMaterial('');
        setShowForm(false);
        setEditingProduct(null);
        
        alert(editingProduct ? 'Producto actualizado exitosamente' : 'Producto agregado exitosamente');
      } else {
        alert('Error al guardar producto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar producto');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🏪 Supermercado SOLID</h1>
        <p>Demostración de Principios SOLID en Next.js</p>
        <nav style={styles.nav}>
          <Link href="/" style={styles.link}>Productos</Link>
          <Link href="/parking" style={styles.link}>Estacionamiento</Link>
          <Link href="/birds" style={styles.link}>Aves (ISP)</Link>
          <Link href="/principles" style={styles.link}>Principios SOLID</Link>
        </nav>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>Catálogo de Productos</h2>
            <button style={styles.addButton} onClick={() => {
              if (showForm && editingProduct) {
                // Si está editando, cancelar edición
                setEditingProduct(null);
                setProductName('');
                setAcquisitionPrice('');
                setExpirationDate('');
                setWarrantyMonths('12');
                setBrand('');
                setSize('M');
                setMaterial('');
              }
              setShowForm(!showForm);
            }}>
              {showForm ? '❌ Cancelar' : '➕ Nuevo Producto'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAddProduct} style={styles.form}>
              <h3>{editingProduct ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}</h3>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nombre del Producto *</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    style={styles.input}
                    placeholder="Ej: Arroz Premium"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Precio de Adquisición (COP) *</label>
                  <input
                    type="number"
                    value={acquisitionPrice}
                    onChange={(e) => setAcquisitionPrice(e.target.value)}
                    style={styles.input}
                    placeholder="Ej: 10000"
                    min="1"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Categoría *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={styles.select}
                  >
                    <option value="Alimentos">Alimentos (IVA 5%)</option>
                    <option value="Electrónicos">Electrónicos (IVA 19%)</option>
                    <option value="Ropa">Ropa (IVA 10%)</option>
                  </select>
                </div>

                {category === 'Alimentos' && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Fecha de Vencimiento (Opcional)</label>
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                )}

                {category === 'Electrónicos' && (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Marca</label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        style={styles.input}
                        placeholder="Ej: Samsung"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Garantía (meses)</label>
                      <input
                        type="number"
                        value={warrantyMonths}
                        onChange={(e) => setWarrantyMonths(e.target.value)}
                        style={styles.input}
                        min="1"
                      />
                    </div>
                  </>
                )}

                {category === 'Ropa' && (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Talla</label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        style={styles.select}
                      >
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Material</label>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        style={styles.input}
                        placeholder="Ej: Algodón"
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={styles.pricePreview}>
                <p><strong>💡 Cálculo del precio:</strong></p>
                <p>• Precio de adquisición: ${formatCurrency(parseFloat(acquisitionPrice) || 0)}</p>
                <p>• + Ganancia (20%): ${formatCurrency((parseFloat(acquisitionPrice) || 0) * 0.20)}</p>
                <p>• + Impuesto ({category === 'Alimentos' ? '5' : category === 'Electrónicos' ? '19' : '10'}%): 
                   ${formatCurrency((parseFloat(acquisitionPrice) || 0) * 1.20 * 
                   (category === 'Alimentos' ? 0.05 : category === 'Electrónicos' ? 0.19 : 0.10))}</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2e7d32' }}>
                  → Precio final de venta: ${formatCurrency((parseFloat(acquisitionPrice) || 0) * 1.20 * 
                   (1 + (category === 'Alimentos' ? 0.05 : category === 'Electrónicos' ? 0.19 : 0.10)))}
                </p>
              </div>

              <button type="submit" style={styles.submitButton}>
                {editingProduct ? '💾 Actualizar Producto' : '💾 Guardar Producto'}
              </button>
            </form>
          )}

          <div style={styles.grid}>
            {isLoading ? (
              <p>Cargando productos...</p>
            ) : products.length === 0 ? (
              <p>No hay productos. ¡Agrega uno nuevo!</p>
            ) : (
              products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))
            )}
          </div>
        </section>

        <aside style={styles.cart}>
          <h2>Carrito de Compras</h2>
          <p>Productos: {cart.length}</p>
          <p style={styles.total}>Total: ${formatCurrency(calculateTotal())}</p>
          {cart.length > 0 && (
            <>
              <button style={styles.clearButton} onClick={clearCart}>
                Vaciar Carrito
              </button>
              <div style={styles.cartItems}>
                <h3>Detalle:</h3>
                {cart.map((productId, index) => {
                  const product = products.find(p => p.id === productId);
                  return product ? (
                    <div key={index} style={styles.cartItem}>
                      <span>{product.name}</span>
                      <span>${formatCurrency(product.calculatePrice())}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </>
          )}
        </aside>
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
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  },
  cart: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    height: 'fit-content',
    position: 'sticky' as const,
    top: '20px',
  },
  total: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2e7d32',
    margin: '16px 0',
  },
  clearButton: {
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
  cartItems: {
    marginTop: '20px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #4caf50',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    marginBottom: '6px',
    fontWeight: 'bold' as const,
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  pricePreview: {
    backgroundColor: '#e8f5e9',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '16px',
    border: '1px solid #4caf50',
  },
  submitButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    width: '100%',
  },
};
