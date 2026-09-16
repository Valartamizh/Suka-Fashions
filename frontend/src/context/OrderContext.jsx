import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { adminOrders as defaultAdminOrders } from '../admin/data/adminOrders';

const OrderContext = createContext();

// Helper to auto-generate next Order ID
export function generateNextOrderId(ordersList = []) {
  let maxNum = 1028;
  ordersList.forEach(o => {
    if (o && o.id) {
      const match = String(o.id).match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });
  return `SUK${maxNum + 1}`;
}

export function OrderProvider({ children }) {
  const { isLoggedIn } = useAuth();

  // Storefront customer orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading saved orders', e);
      return [];
    }
  });

  // Admin orders (persisted in localStorage with fallback to defaultAdminOrders)
  const [adminOrders, setAdminOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_admin_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(o => o.id));
          const missingDefaults = defaultAdminOrders.filter(o => !existingIds.has(o.id));
          if (missingDefaults.length > 0) {
            return [...parsed, ...missingDefaults];
          }
          return parsed;
        }
      }
      return defaultAdminOrders;
    } catch (e) {
      console.error('Error loading admin orders from localStorage', e);
      return defaultAdminOrders;
    }
  });

  // Save admin orders to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('suka_admin_orders', JSON.stringify(adminOrders));
    } catch (e) {
      console.error('Error saving admin orders to localStorage', e);
    }
  }, [adminOrders]);

  // Save storefront orders to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('suka_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  }, [orders]);

  const addOrder = (newOrder) => {
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    
    // Also sync to admin orders for consistent cross-system tracking
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newAdminOrder = {
        id: newOrder.id,
        customer: {
          id: `CUS000${Math.floor(100 + Math.random() * 900)}`,
          name: newOrder.address?.name || 'Storefront Customer',
          phone: newOrder.address?.phone || '',
          email: newOrder.email || '',
        },
        address: {
          line1: newOrder.address?.street || newOrder.address?.line1 || '',
          city: newOrder.address?.city || '',
          state: newOrder.address?.state || '',
          pincode: newOrder.address?.pincode || '',
        },
        items: (newOrder.items || []).map(it => ({
          productId: it.id || it.productId || 'custom-item',
          name: it.name,
          variant: `${it.selectedColor || ''} ${it.selectedSize || ''}`.trim() || 'Standard',
          qty: it.quantity || 1,
          price: it.price || 0,
          image: it.image || (it.images && it.images[0]) || '',
        })),
        subtotal: Number(newOrder.subtotal || newOrder.total || 0),
        discount: Number(newOrder.discount || 0),
        shipping: Number(newOrder.shipping || 0),
        tax: Number(newOrder.tax || 0),
        total: Number(newOrder.total || 0),
        paymentMethod: newOrder.paymentMethod || 'Online Checkout',
        paymentStatus: 'paid',
        status: (newOrder.status || 'processing').toLowerCase(),
        orderSource: 'Online Storefront',
        notes: 'Order placed via online store',
        date: todayStr,
        timeline: [
          { status: 'processing', time: `${todayStr} ${timeStr}`, note: 'Order placed & confirmed via Storefront' }
        ]
      };
      setAdminOrders(prev => {
        const filtered = prev.filter(o => o.id !== newOrder.id);
        return [newAdminOrder, ...filtered];
      });
    } catch (err) {
      console.warn('Could not sync order to admin orders:', err);
    }
  };

  const clearOrders = () => {
    setOrders([]);
    localStorage.removeItem('suka_orders');
  };

  // ─── Admin Order Operations ────────────────────────────────────────────────
  const addAdminOrder = (orderData) => {
    const newId = orderData.id || generateNextOrderId(adminOrders);
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: newId,
      customer: {
        id: orderData.customer?.id || `CUS000${Math.floor(100 + Math.random() * 900)}`,
        name: orderData.customer?.name || 'Walk-in / WhatsApp Customer',
        phone: orderData.customer?.phone || '',
        email: orderData.customer?.email || '',
      },
      address: {
        line1: orderData.address?.line1 || '',
        city: orderData.address?.city || '',
        state: orderData.address?.state || '',
        pincode: orderData.address?.pincode || '',
      },
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal || 0),
      discount: Number(orderData.discount || 0),
      shipping: Number(orderData.shipping || 0),
      tax: Number(orderData.tax || 0),
      total: Number(orderData.total || 0),
      paymentMethod: orderData.paymentMethod || 'WhatsApp UPI',
      paymentStatus: (orderData.paymentStatus || 'pending').toLowerCase(),
      status: (orderData.status || 'processing').toLowerCase(),
      orderSource: orderData.orderSource || 'WhatsApp',
      notes: orderData.notes || '',
      date: orderData.date || todayStr,
      timeline: orderData.timeline || [
        { status: (orderData.status || 'processing').toLowerCase(), time: `${todayStr} ${timeStr}`, note: orderData.notes ? `Order created (${orderData.orderSource || 'WhatsApp'}): ${orderData.notes}` : `Order created via ${orderData.orderSource || 'WhatsApp'}` },
      ],
    };

    setAdminOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateAdminOrder = (id, updatedFields) => {
    setAdminOrders(prev =>
      prev.map(ord => {
        if (ord.id === id) {
          const updated = {
            ...ord,
            ...updatedFields,
            customer: {
              ...ord.customer,
              ...(updatedFields.customer || {}),
            },
            address: {
              ...ord.address,
              ...(updatedFields.address || {}),
            },
            items: updatedFields.items || ord.items,
          };

          // If status changed, append to timeline
          if (updatedFields.status && updatedFields.status.toLowerCase() !== ord.status.toLowerCase()) {
            const todayStr = new Date().toISOString().split('T')[0];
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            updated.timeline = [
              ...(ord.timeline || []),
              {
                status: updatedFields.status.toLowerCase(),
                time: `${todayStr} ${timeStr}`,
                note: updatedFields.timelineNote || `Status updated to ${updatedFields.status}`,
              },
            ];
          }

          return updated;
        }
        return ord;
      })
    );
  };

  const deleteAdminOrder = (id) => {
    setAdminOrders(prev => prev.filter(o => o.id !== id));
  };

  const getAdminOrder = (id) => {
    return adminOrders.find(o => o.id === id);
  };

  const activeOrders = isLoggedIn ? orders : orders;

  return (
    <OrderContext.Provider value={{
      orders: activeOrders,
      allOrders: [...orders, ...adminOrders],
      addOrder,
      clearOrders,
      adminOrders,
      addAdminOrder,
      updateAdminOrder,
      deleteAdminOrder,
      getAdminOrder,
      generateNextOrderId: () => generateNextOrderId(adminOrders),
    }}>
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

