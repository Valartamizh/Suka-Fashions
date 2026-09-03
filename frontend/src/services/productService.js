// productService.js — Shared service layer for Suka Fashions
// Mimics future Spring Boot REST API endpoints while maintaining synchronized localStorage state

import { initialProducts } from '../data/initialProducts';

const STORAGE_KEY = 'suka_products_v2';

// Helper: Calculate total stock across all color variants and sizes
export const calculateProductStock = (product) => {
  if (!product) return 0;
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    return product.colors.reduce((total, color) => {
      if (Array.isArray(color.variants)) {
        return total + color.variants.reduce((cTotal, v) => cTotal + (Number(v.stock) || 0), 0);
      }
      return total;
    }, 0);
  }
  return Number(product.stock) || 0;
};

// Helper: Get the starting / minimum selling price across variants
export const getProductStartingPrice = (product) => {
  if (!product) return 0;
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    let minPrice = Infinity;
    product.colors.forEach(c => {
      c.variants?.forEach(v => {
        if (v.sellingPrice && v.sellingPrice < minPrice) {
          minPrice = v.sellingPrice;
        }
      });
    });
    if (minPrice !== Infinity) return minPrice;
  }
  return Number(product.price) || 0;
};

// Helper: Get primary image for a specific color (or fallback to first image / product default)
export const getPrimaryImageForColor = (product, colorIdOrIndex) => {
  if (!product) return '';
  const colors = product.colors || [];
  if (colors.length === 0) {
    return product.image || product.images?.[0] || '';
  }

  let targetColor = colors[0];
  if (typeof colorIdOrIndex === 'string') {
    targetColor = colors.find(c => c.id === colorIdOrIndex) || colors[0];
  } else if (typeof colorIdOrIndex === 'number' && colors[colorIdOrIndex]) {
    targetColor = colors[colorIdOrIndex];
  }

  if (targetColor?.images && targetColor.images.length > 0) {
    const primary = targetColor.images.find(img => img.isPrimary);
    return primary?.url || targetColor.images[0].url || targetColor.images[0];
  }

  return product.image || product.images?.[0] || '';
};

// Helper: Normalize product object to ensure all consumer pages receive consistent data
export const normalizeProduct = (p) => {
  if (!p) return null;
  const primaryImg = getPrimaryImageForColor(p);
  const totalStock = calculateProductStock(p);
  const startPrice = getProductStartingPrice(p);

  // Derive legacy fallback arrays for backwards compatibility
  const colorsList = (p.colors || []).map(c => c.hex || c.name || c);
  const allImages = (p.colors || []).flatMap(c => (c.images || []).map(img => img.url || img));
  if (allImages.length === 0 && primaryImg) allImages.push(primaryImg);

  return {
    ...p,
    price: startPrice || p.price || 0,
    mrp: p.mrp || (startPrice ? Math.round(startPrice * 1.4) : 0),
    stock: totalStock,
    image: primaryImg || p.image,
    images: allImages.length > 0 ? allImages : (p.images || [primaryImg]),
    colorsList,
    totalStock,
  };
};

class ProductService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
      } else {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].colors) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
        }
      }
    } catch (e) {
      console.warn('LocalStorage error in ProductService:', e);
    }
  }

  _getRawProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading products from storage:', e);
    }
    return [...initialProducts];
  }

  _saveRawProducts(productsList) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsList));
      // Dispatch custom event so all open tabs or components can react
      window.dispatchEvent(new CustomEvent('suka_products_updated', { detail: productsList }));
    } catch (e) {
      console.error('Error saving products to storage:', e);
    }
  }

  // GET /api/products — Get all products (with optional filters)
  async getProducts(filters = {}) {
    const list = this._getRawProducts();
    let result = list.map(normalizeProduct);

    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.category && filters.category !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.colors?.some(c => c.name?.toLowerCase().includes(q))
      );
    }
    if (filters.isNew !== undefined) {
      result = result.filter(p => Boolean(p.isNew) === Boolean(filters.isNew));
    }
    if (filters.isBestSeller !== undefined) {
      result = result.filter(p => Boolean(p.isBestSeller) === Boolean(filters.isBestSeller));
    }
    if (filters.featured !== undefined) {
      result = result.filter(p => Boolean(p.featured) === Boolean(filters.featured));
    }

    return result;
  }

  // GET /api/products/:id — Get product by ID or Slug
  async getProductById(idOrSlug) {
    const list = this._getRawProducts();
    const found = list.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return found ? normalizeProduct(found) : null;
  }

  // POST /api/admin/products — Create new product
  async createProduct(productData) {
    const list = this._getRawProducts();
    const newId = productData.id || `PRD-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = productData.slug || productData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

    const newProduct = {
      ...productData,
      id: newId,
      slug,
      status: productData.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString().split('T')[0],
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      unitsSold: productData.unitsSold || 0,
    };

    const updatedList = [newProduct, ...list];
    this._saveRawProducts(updatedList);
    return normalizeProduct(newProduct);
  }

  // PUT /api/admin/products/:id — Update existing product
  async updateProduct(id, productData) {
    const list = this._getRawProducts();
    const idx = list.findIndex(p => p.id === id || p.slug === id);
    if (idx === -1) {
      throw new Error(`Product ${id} not found`);
    }

    const updated = {
      ...list[idx],
      ...productData,
      id: list[idx].id, // preserve immutable ID
      updatedAt: new Date().toISOString().split('T')[0],
    };

    list[idx] = updated;
    this._saveRawProducts(list);
    return normalizeProduct(updated);
  }

  // PATCH /api/admin/products/:id/stock — Update size stock for a specific color variant
  async updateVariantStock(productId, colorId, size, newStock) {
    const list = this._getRawProducts();
    const prod = list.find(p => p.id === productId);
    if (!prod) throw new Error('Product not found');

    if (prod.colors) {
      const color = prod.colors.find(c => c.id === colorId);
      if (color && color.variants) {
        const variant = color.variants.find(v => v.size === size);
        if (variant) {
          variant.stock = Math.max(0, Number(newStock) || 0);
        }
      }
    }

    this._saveRawProducts(list);
    return normalizeProduct(prod);
  }

  // PATCH /api/admin/products/:id/status — Toggle or set status (ACTIVE | DRAFT | ARCHIVED)
  async setProductStatus(id, newStatus) {
    return this.updateProduct(id, { status: newStatus });
  }

  // DELETE /api/admin/products/:id — Remove product
  async deleteProduct(id) {
    const list = this._getRawProducts();
    const filtered = list.filter(p => p.id !== id);
    this._saveRawProducts(filtered);
    return true;
  }

  // Reset to initial seed catalog
  async resetToSeed() {
    this._saveRawProducts(initialProducts);
    return initialProducts.map(normalizeProduct);
  }
}

export const productService = new ProductService();
