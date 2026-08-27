import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading saved orders', e);
      return [];
    }
  });

  // Clear orders in memory & storage when logged out
  useEffect(() => {
    if (!isLoggedIn) {
      setOrders([]);
    }
  }, [isLoggedIn]);

  // Save orders to localStorage when logged in
  useEffect(() => {
    if (isLoggedIn) {
      try {
        localStorage.setItem('suka_orders', JSON.stringify(orders));
      } catch (e) {
        console.error('Error saving orders to localStorage', e);
      }
    }
  }, [orders, isLoggedIn]);

  const addOrder = (newOrder) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem('suka_orders');
  };

  const activeOrders = isLoggedIn ? orders : [];

  return (
    <OrderContext.Provider value={{ orders: activeOrders, addOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
