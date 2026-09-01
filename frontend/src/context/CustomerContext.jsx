import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminCustomers as initialDefaultCustomers } from '../admin/data/adminCustomers';

const CustomerContext = createContext();

const STORAGE_KEY = 'suka_admin_customers';

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('Error parsing customer data from localStorage:', err);
      }
    }
    return initialDefaultCustomers;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (err) {
      console.error('Error saving customer data to localStorage:', err);
    }
  }, [customers]);

  const addCustomer = (customerData) => {
    const newId = `CUS${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`;
    const today = new Date().toISOString().split('T')[0];
    const newCustomer = {
      id: newId,
      firstName: customerData.firstName || '',
      lastName: customerData.lastName || '',
      name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() || 'New Customer',
      phone: customerData.phone || '',
      email: customerData.email || '',
      joinedAt: today,
      status: customerData.status || 'active',
      tier: customerData.tier || 'Regular',
      notes: customerData.notes || [],
      address: customerData.address || {
        street: customerData.street || '',
        city: customerData.city || '',
        state: customerData.state || '',
        pincode: customerData.pincode || '',
      },
      totalOrders: Number(customerData.totalOrders) || 0,
      totalSpent: Number(customerData.totalSpent) || 0,
      lastOrderDate: customerData.lastOrderDate || 'None',
      cartItems: [],
      wishlistItems: [],
      orderIds: [],
    };

    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id, updatedFields) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          const firstName = updatedFields.firstName !== undefined ? updatedFields.firstName : c.firstName;
          const lastName = updatedFields.lastName !== undefined ? updatedFields.lastName : c.lastName;
          const name = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : c.name;
          return {
            ...c,
            ...updatedFields,
            firstName,
            lastName,
            name,
            address: {
              ...(c.address || {}),
              ...(updatedFields.address || {}),
            },
          };
        }
        return c;
      })
    );
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const toggleCustomerStatus = (id) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'inactive' : 'active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const addCustomerNote = (id, noteText) => {
    if (!noteText || !noteText.trim()) return;
    const today = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const newNote = {
      id: `NOTE-${Date.now()}`,
      text: noteText.trim(),
      date: today,
      author: 'Admin',
    };

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          const existingNotes = Array.isArray(c.notes) ? c.notes : [];
          return { ...c, notes: [newNote, ...existingNotes] };
        }
        return c;
      })
    );
  };

  const resetCustomers = () => {
    setCustomers(initialDefaultCustomers);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleCustomerStatus,
        addCustomerNote,
        resetCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}
