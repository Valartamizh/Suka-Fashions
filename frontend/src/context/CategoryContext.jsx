import React, { createContext, useContext, useState, useEffect } from 'react';

// Import local assets for built-in category fallbacks
import sareeGolden from '../assets/saree_golden.jpg';
import sareeBeigeMaroonFull2 from '../assets/saree_beige_maroon_full2.jpg';
import anarkaliBlackMulticolor from '../assets/anarkali_black_multicolor.jpg';
import lehengaRed from '../assets/lehenga_red.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';
import dressNavy from '../assets/dress_navy.jpg';
import coordSet from '../assets/coord_set.jpg';
import dupattaSilk from '../assets/dupatta_silk.jpg';
import festiveSuit from '../assets/festive_suit.jpg';

const defaultImageMap = {
  sarees: sareeGolden,
  lehengas: lehengaRed,
  kurtis: anarkaliBlackMulticolor,
  dresses: dressNavy,
  coords: coordSet,
  dupattas: dupattaSilk,
  festive: festiveSuit,
};

const initialDefaultCategories = [
  {
    id: 'sarees',
    name: 'Sarees',
    image: sareeGolden,
    displayOrder: 1,
    active: true,
    showOnHomepage: true,
    subcategories: ['Organza', 'Silk', 'Cotton', 'Georgette', 'Wedding', 'Festive'],
    link: '/category/sarees',
  },
  {
    id: 'lehengas',
    name: 'Lehengas',
    image: lehengaRed,
    displayOrder: 2,
    active: true,
    showOnHomepage: true,
    subcategories: ['Bridal', 'Party', 'Festive', 'Designer'],
    link: '/category/lehengas',
  },
  {
    id: 'kurtis',
    name: 'Kurtis & Suits',
    image: anarkaliBlackMulticolor,
    displayOrder: 3,
    active: true,
    showOnHomepage: true,
    subcategories: ['Anarkali', 'Straight', 'A-Line', 'Kurta Set', 'Palazzo'],
    link: '/category/kurtis',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    image: dressNavy,
    displayOrder: 4,
    active: true,
    showOnHomepage: true,
    subcategories: ['Midi', 'Maxi', 'Mini', 'Wrap', 'Bodycon'],
    link: '/category/dresses',
  },
  {
    id: 'coords',
    name: 'Co-ords',
    image: coordSet,
    displayOrder: 5,
    active: true,
    showOnHomepage: true,
    subcategories: ['Printed', 'Solid', 'Embroidered'],
    link: '/category/coords',
  },
  {
    id: 'dupattas',
    name: 'Dupattas',
    image: dupattaSilk,
    displayOrder: 6,
    active: true,
    showOnHomepage: true,
    subcategories: ['Silk', 'Chiffon', 'Cotton', 'Banarasi'],
    link: '/category/dupattas',
  },
  {
    id: 'festive',
    name: 'Festive Wear',
    image: festiveSuit,
    displayOrder: 7,
    active: true,
    showOnHomepage: true,
    subcategories: ['Suits', 'Sharara', 'Gharara'],
    link: '/category/occasion',
  },
];

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('suka_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedDefaults = initialDefaultCategories.map(defaultCat => {
            const matched = parsed.find(p => p.id === defaultCat.id);
            if (!matched) return defaultCat;
            return {
              ...defaultCat,
              ...matched,
              image: defaultImageMap[defaultCat.id] || matched.image || defaultCat.image,
            };
          });
          const customCats = parsed.filter(p => !initialDefaultCategories.some(d => d.id === p.id));
          return [...mergedDefaults, ...customCats];
        }
      } catch (err) {
        console.error('Error parsing suka_categories:', err);
      }
    }
    return initialDefaultCategories;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('suka_categories', JSON.stringify(categories));
    } catch (err) {
      console.error('Error saving suka_categories:', err);
    }
  }, [categories]);

  // Derived: Homepage categories (active & showOnHomepage, sorted by displayOrder)
  const homepageCategories = [...categories]
    .filter(c => c.active !== false && c.showOnHomepage === true)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const toggleHomepage = (id) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, showOnHomepage: !c.showOnHomepage } : c))
    );
  };

  const toggleVisibility = (id) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const addCategory = (newCat) => {
    setCategories(prev => {
      const created = {
        id: newCat.id || newCat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        name: newCat.name,
        image: newCat.image || sareeGolden,
        displayOrder: 1,
        active: newCat.active !== undefined ? newCat.active : true,
        showOnHomepage: newCat.showOnHomepage !== undefined ? newCat.showOnHomepage : true,
        subcategories: Array.isArray(newCat.subcategories) ? newCat.subcategories : (newCat.subcategories || '').split(',').map(s => s.trim()).filter(Boolean),
        link: newCat.link || `/category/${newCat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`,
      };
      // Stack methodology (LIFO): newly created category is placed at the top (index 0)
      const updated = [created, ...prev];
      return updated.map((c, idx) => ({ ...c, displayOrder: idx + 1 }));
    });
  };

  const editCategory = (id, updatedData) => {
    setCategories(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const subs = Array.isArray(updatedData.subcategories)
          ? updatedData.subcategories
          : typeof updatedData.subcategories === 'string'
          ? updatedData.subcategories.split(',').map(s => s.trim()).filter(Boolean)
          : c.subcategories;

        return {
          ...c,
          ...updatedData,
          subcategories: subs,
        };
      })
    );
  };

  const deleteCategory = (id) => {
    setCategories(prev => {
      const filtered = prev.filter(c => c.id !== id);
      return filtered.map((c, idx) => ({ ...c, displayOrder: idx + 1 }));
    });
  };

  const moveCategory = (id, direction) => {
    setCategories(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index < 0) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const [movedItem] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, movedItem);

      return updated.map((item, i) => ({ ...item, displayOrder: i + 1 }));
    });
  };

  const addSubcategory = (catId, subName) => {
    if (!subName || !subName.trim()) return;
    setCategories(prev =>
      prev.map(c => {
        if (c.id !== catId) return c;
        if (c.subcategories.includes(subName.trim())) return c;
        // Stack methodology: newly added subcategory is placed at the top
        return { ...c, subcategories: [subName.trim(), ...c.subcategories] };
      })
    );
  };

  const removeSubcategory = (catId, subName) => {
    setCategories(prev =>
      prev.map(c => {
        if (c.id !== catId) return c;
        return { ...c, subcategories: c.subcategories.filter(s => s !== subName) };
      })
    );
  };

  const resetCategories = () => {
    setCategories(initialDefaultCategories);
    localStorage.removeItem('suka_categories');
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        homepageCategories,
        toggleHomepage,
        toggleVisibility,
        addCategory,
        editCategory,
        deleteCategory,
        moveCategory,
        addSubcategory,
        removeSubcategory,
        resetCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
