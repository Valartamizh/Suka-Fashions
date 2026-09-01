import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'suka_filter_catalog_v1';

const DEFAULT_FILTERS = {
  sortOptions: [
    { id: 'recommended', label: 'Recommended', active: true },
    { id: 'newest', label: 'Newest Arrivals', active: true },
    { id: 'price-low', label: 'Price: Low to High', active: true },
    { id: 'price-high', label: 'Price: High to Low', active: true },
  ],
  priceRanges: [
    { id: 'under-2000', label: 'Under ₹2000', min: 0, max: 2000, active: true },
    { id: '2000-5000', label: '₹2000 - ₹5000', min: 2000, max: 5000, active: true },
    { id: 'above-5000', label: 'Above ₹5000', min: 5000, max: 999999, active: true },
  ],
  highlights: [
    { id: 'new', label: 'New Arrivals ✨', active: true },
    { id: 'bestseller', label: 'Best Sellers 🔥', active: true },
    { id: 'trending', label: 'Trending Now ⚡', active: true },
  ],
  sizes: [
    { id: 'free-size', name: 'Free Size', active: true },
    { id: 'xs', name: 'XS', active: true },
    { id: 's', name: 'S', active: true },
    { id: 'm', name: 'M', active: true },
    { id: 'l', name: 'L', active: true },
    { id: 'xl', name: 'XL', active: true },
    { id: 'xxl', name: 'XXL', active: true },
    { id: 'custom', name: 'Custom', active: true },
  ],
  colors: [
    { id: 'teal', name: 'Teal', hex: '#006B70', active: true },
    { id: 'gold', name: 'Gold / Zari', hex: '#D4AF37', active: true },
    { id: 'pink', name: 'Blush Pink', hex: '#F8C8DC', active: true },
    { id: 'navy', name: 'Navy Blue', hex: '#0F1E2E', active: true },
    { id: 'black', name: 'Midnight Black', hex: '#000000', active: true },
    { id: 'maroon', name: 'Maroon', hex: '#800000', active: true },
    { id: 'yellow', name: 'Mustard Yellow', hex: '#FFDB58', active: true },
    { id: 'white', name: 'Pure White / Ivory', hex: '#FFFFFF', active: true },
    { id: 'green', name: 'Emerald Green', hex: '#50C878', active: true },
    { id: 'red', name: 'Crimson Red', hex: '#DC143C', active: true },
    { id: 'purple', name: 'Royal Purple', hex: '#6B21A8', active: true },
  ],
  fabrics: [
    { id: 'silk', name: 'Silk', active: true },
    { id: 'organza', name: 'Organza', active: true },
    { id: 'georgette', name: 'Georgette', active: true },
    { id: 'cotton', name: 'Cotton', active: true },
    { id: 'banarasi', name: 'Banarasi', active: true },
    { id: 'rayon', name: 'Rayon', active: true },
    { id: 'velvet', name: 'Velvet', active: true },
    { id: 'chiffon', name: 'Chiffon', active: true },
    { id: 'raw-silk', name: 'Raw Silk', active: true },
    { id: 'net', name: 'Net', active: true },
  ],
  occasions: [
    { id: 'wedding', name: 'Wedding', active: true },
    { id: 'festive', name: 'Festive', active: true },
    { id: 'party', name: 'Party', active: true },
    { id: 'casual', name: 'Casual', active: true },
    { id: 'office', name: 'Office', active: true },
    { id: 'haldi-mehendi', name: 'Haldi / Mehendi', active: true },
    { id: 'cocktail', name: 'Cocktail', active: true },
  ],
  crafts: [
    { id: 'floral', name: 'Floral', active: true },
    { id: 'embroidered', name: 'Embroidered', active: true },
    { id: 'zari-work', name: 'Zari Work', active: true },
    { id: 'chikankari', name: 'Chikankari', active: true },
    { id: 'printed', name: 'Printed', active: true },
    { id: 'handloom', name: 'Handloom', active: true },
    { id: 'solid', name: 'Solid', active: true },
    { id: 'sequin', name: 'Sequin', active: true },
    { id: 'mirror-work', name: 'Mirror Work', active: true },
  ],
};

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load filter catalog from storage:', e);
    }
    return DEFAULT_FILTERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      console.error('Failed to save filter catalog:', e);
    }
  }, [filters]);

  // Section item management helpers
  const addItem = (section, item) => {
    const id = item.id || (item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : Date.now().toString());
    const newItem = { ...item, id, active: item.active ?? true };
    setFilters(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem],
    }));
  };

  const updateItem = (section, id, updatedData) => {
    setFilters(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(item => (item.id === id ? { ...item, ...updatedData } : item)),
    }));
  };

  const deleteItem = (section, id) => {
    setFilters(prev => ({
      ...prev,
      [section]: (prev[section] || []).filter(item => item.id !== id),
    }));
  };

  const toggleItemActive = (section, id) => {
    setFilters(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(item => (item.id === id ? { ...item, active: !item.active } : item)),
    }));
  };

  const moveItem = (section, id, direction) => {
    setFilters(prev => {
      const list = [...(prev[section] || [])];
      const index = list.findIndex(item => item.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const [removed] = list.splice(index, 1);
      list.splice(targetIndex, 0, removed);
      return {
        ...prev,
        [section]: list,
      };
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        addItem,
        updateItem,
        deleteItem,
        toggleItemActive,
        moveItem,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterCatalog() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterCatalog must be used within a FilterProvider');
  }
  return context;
}
