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

  // Clear cart state if logged out
  useEffect(() => {
    if (!isLoggedIn) {
      setCartItems([]);
      try {
        localStorage.removeItem('suka_cart');
      } catch (e) {
        console.error('Error clearing cart', e);
      }
    }
  }, [isLoggedIn]);

  // Persist cart items to localStorage when logged in
  useEffect(() => {
    if (isLoggedIn) {
      try {
        localStorage.setItem('suka_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Error saving cart to localStorage', e);
      }
    }
  }, [cartItems, isLoggedIn]);

  const addToCart = (product, quantity = 1, selectedSize = 'Free Size', selectedColor = '') => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize
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
          cartId: `${product.id}-${Date.now()}`,
          quantity,
          selectedSize: selectedSize || product.sizes?.[0] || 'Free Size',
          selectedColor: selectedColor || 'Standard',
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

  const activeCartItems = isLoggedIn ? cartItems : [];
  const cartCount = activeCartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = activeCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: activeCartItems,
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
