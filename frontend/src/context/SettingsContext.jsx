import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  store: {
    storeName: 'Suka Fashions',
    supportEmail: 'support@sukafashions.com',
    supportPhone: '+91 9488463850',
    whatsappNumber: '+91 9488463850',
    address: '42, Commercial Street, Bengaluru, Karnataka 560001',
    gst: '29ABCDE1234F1Z5',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  },
  shipping: {
    freeShippingMin: 1999,
    standardCharge: 99,
    deliveryDays: '3-7 working days',
    codEnabled: true,
  },
  inventory: {
    lowStockThreshold: 10,
    allowOrderWhenOutOfStock: false,
    trackInventory: true,
    lowStockAlerts: true,
  },
  orders: {
    autoConfirmPrepaid: true,
    codConfirmation: false,
    returnWindowDays: 7,
    cancellationWindow: '24 hours',
  },
  notifications: {
    newOrder: true,
    lowStock: true,
    outOfStock: true,
    returnRequest: true,
    newReview: false,
    paymentFailure: true,
  },
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          store: { ...defaultSettings.store, ...(parsed.store || {}) },
          shipping: { ...defaultSettings.shipping, ...(parsed.shipping || {}) },
          inventory: { ...defaultSettings.inventory, ...(parsed.inventory || {}) },
          orders: { ...defaultSettings.orders, ...(parsed.orders || {}) },
          notifications: { ...defaultSettings.notifications, ...(parsed.notifications || {}) },
        };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return defaultSettings;
  });

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('suka_store_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  };

  const updateStore = (storeData) => {
    saveSettings({ ...settings, store: { ...settings.store, ...storeData } });
  };

  const updateShipping = (shippingData) => {
    saveSettings({ ...settings, shipping: { ...settings.shipping, ...shippingData } });
  };

  const updateInventory = (invData) => {
    saveSettings({ ...settings, inventory: { ...settings.inventory, ...invData } });
  };

  const updateOrders = (ordersData) => {
    saveSettings({ ...settings, orders: { ...settings.orders, ...ordersData } });
  };

  const updateNotifications = (notifData) => {
    saveSettings({ ...settings, notifications: { ...settings.notifications, ...notifData } });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings,
        updateStore,
        updateShipping,
        updateInventory,
        updateOrders,
        updateNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: defaultSettings,
      saveSettings: () => {},
      updateStore: () => {},
      updateShipping: () => {},
      updateInventory: () => {},
      updateOrders: () => {},
      updateNotifications: () => {},
    };
  }
  return context;
}
