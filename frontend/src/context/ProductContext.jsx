// ProductContext.jsx — Unified React Context providing real-time product state to Admin and Customer Storefront
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService, normalizeProduct, getPrimaryImageForColor, calculateProductStock, getProductStartingPrice } from '../services/productService';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products in ProductProvider:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    const handleUpdate = () => {
      loadProducts();
    };

    window.addEventListener('suka_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('suka_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadProducts]);

  // Customer-visible products (treat ACTIVE, active, or missing status as active)
  const activeProducts = products.filter(p => !p.status || p.status?.toUpperCase() === 'ACTIVE');

  // Add new product (Admin)
  const addProduct = async (productData) => {
    const created = await productService.createProduct(productData);
    await loadProducts();
    return created;
  };

  // Update product (Admin)
  const editProduct = async (id, productData) => {
    const updated = await productService.updateProduct(id, productData);
    await loadProducts();
    return updated;
  };

  // Update variant stock (Admin Inventory / Quick Stock)
  const updateStock = async (productId, colorId, size, newStock) => {
    const updated = await productService.updateVariantStock(productId, colorId, size, newStock);
    await loadProducts();
    return updated;
  };

  // Set product status (ACTIVE | DRAFT | ARCHIVED)
  const setProductStatus = async (id, status) => {
    const updated = await productService.setProductStatus(id, status);
    await loadProducts();
    return updated;
  };

  // Archive product (soft delete)
  const archiveProduct = async (id) => {
    const updated = await productService.setProductStatus(id, 'ARCHIVED');
    await loadProducts();
    return updated;
  };

  // Delete product permanently
  const deleteProduct = async (id) => {
    const res = await productService.deleteProduct(id);
    await loadProducts();
    return res;
  };

  // Find product by id or slug
  const getProductById = useCallback((idOrSlug) => {
    if (!idOrSlug) return null;
    const clean = idOrSlug.toString().toLowerCase();
    return products.find(p => p.id?.toLowerCase() === clean || p.slug?.toLowerCase() === clean) || null;
  }, [products]);

  // Derive unique categories from active products
  const categories = Array.from(new Set(activeProducts.map(p => p.category).filter(Boolean)));

  const value = {
    products,
    activeProducts,
    categories,
    loading,
    addProduct,
    editProduct,
    updateStock,
    setProductStatus,
    archiveProduct,
    deleteProduct,
    getProductById,
    refreshProducts: loadProducts,
    getPrimaryImageForColor,
    calculateProductStock,
    getProductStartingPrice,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
