import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading saved cart', e);
      return [];
    }
  });

  // Persist cart items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('suka_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
    const colorId = product.colorId || '';
    const colorName = product.colorName || selectedColor || 'Standard';
    const size = product.size || selectedSize || product.selectedSize || product.sizes?.[0] || 'Free Size';
    const colorImage = product.selectedColorImage || product.image || '';
    const itemPrice = product.sellingPrice || product.price || 0;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && (item.colorName || item.selectedColor || '') === colorName
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        const newItem = {
          ...product,
          id: product.id,
          productId: product.productId || product.id,
          name: product.name,
          cartId: `${product.id}-${colorName}-${size}-${Date.now()}`,
          quantity,
          selectedSize: size,
          size,
          selectedColor: colorName,
          colorName,
          colorId,
          price: itemPrice,
          sellingPrice: itemPrice,
          image: colorImage,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (cartId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
