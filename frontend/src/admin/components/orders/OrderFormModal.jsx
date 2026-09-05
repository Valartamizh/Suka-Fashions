import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Plus, Trash2, ShoppingBag, User, MapPin, CreditCard,
  MessageCircle, Phone, Mail, Sparkles, Check, AlertCircle,
  Minus, Search, Filter
} from 'lucide-react';
import { useProducts } from '../../../context/ProductContext';
import { useCustomers } from '../../../context/CustomerContext';
import { adminProducts } from '../../data/adminProducts';

const PAYMENT_METHODS = [
  'WhatsApp UPI',
  'UPI (GPay / PhonePe / Paytm)',
  'Cash on Delivery (COD)',
  'Bank Transfer / IMPS',
  'Credit / Debit Card',
  'Store Payment / Cash',
];

const PAYMENT_STATUSES = ['paid', 'pending', 'refunded', 'failed'];

const ORDER_STATUSES = [
  'processing',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
];

const ORDER_SOURCES = ['WhatsApp', 'Instagram DM', 'Phone Call', 'Store Walk-in', 'Storefront'];

export default function OrderFormModal({
  isOpen,
  onClose,
  onSave,
  initialOrder = null,
  nextOrderId = 'SUK1029',
}) {
  const { products: contextProducts } = useProducts();
  const { customers = [] } = useCustomers();

  // Combine context products and fallback admin products
  const allProducts = useMemo(() => {
    if (contextProducts && contextProducts.length > 0) return contextProducts;
    return adminProducts;
  }, [contextProducts]);

  // Unique categories list
  const categoriesList = useMemo(() => {
    const set = new Set();
    allProducts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [allProducts]);

  const isEdit = Boolean(initialOrder && initialOrder.id);

  // Form State
  const [orderId, setOrderId] = useState(nextOrderId);
  const [orderSource, setOrderSource] = useState('WhatsApp');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerId, setCustomerId] = useState('');

  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const [items, setItems] = useState([
    {
      productId: '',
      name: '',
      variant: 'Free Size',
      qty: 1,
      price: 0,
      image: '',
      sku: '',
      selectedCategory: '',
      searchQuery: '',
      isCustom: false,
    },
  ]);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState('WhatsApp UPI');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [orderStatus, setOrderStatus] = useState('processing');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});

  // Reset or initialize state when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialOrder) {
      setOrderId(initialOrder.id);
      setOrderSource(initialOrder.orderSource || 'WhatsApp');
      setCustomerName(initialOrder.customer?.name || '');
      setCustomerPhone(initialOrder.customer?.phone || '');
      setCustomerEmail(initialOrder.customer?.email || '');
      setCustomerId(initialOrder.customer?.id || '');

      setAddressLine1(initialOrder.address?.line1 || '');
      setCity(initialOrder.address?.city || '');
      setStateName(initialOrder.address?.state || '');
      setPincode(initialOrder.address?.pincode || '');

      if (initialOrder.items && initialOrder.items.length > 0) {
        setItems(initialOrder.items.map(item => {
          const matchedProd = allProducts.find(p => String(p.id) === String(item.productId) || String(p.sku) === String(item.productId));
          return {
            productId: item.productId || '',
            name: item.name || '',
            variant: item.variant || 'Free Size',
            qty: Number(item.qty || 1),
            price: Number(item.price || 0),
            image: item.image || '',
            sku: item.sku || '',
            selectedCategory: matchedProd?.category || '',
            searchQuery: '',
            isCustom: !item.productId || item.productId === 'custom',
          };
        }));
      } else {
        setItems([{ productId: '', name: '', variant: 'Free Size', qty: 1, price: 0, image: '', sku: '', selectedCategory: '', searchQuery: '', isCustom: false }]);
      }

      setDiscount(Number(initialOrder.discount || 0));
      setShipping(Number(initialOrder.shipping || 0));
      setTax(Number(initialOrder.tax || 0));

      setPaymentMethod(initialOrder.paymentMethod || 'WhatsApp UPI');
      setPaymentStatus(initialOrder.paymentStatus || 'paid');
      setOrderStatus(initialOrder.status || 'processing');
      setNotes(initialOrder.notes || '');
    } else {
      setOrderId(nextOrderId);
      setOrderSource('WhatsApp');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setCustomerId('');

      setAddressLine1('');
      setCity('');
      setStateName('');
      setPincode('');

      setItems([{ productId: '', name: '', variant: 'Free Size', qty: 1, price: 0, image: '', sku: '', selectedCategory: '', searchQuery: '', isCustom: false }]);

      setDiscount(0);
      setShipping(0);
      setTax(0);

      setPaymentMethod('WhatsApp UPI');
      setPaymentStatus('paid');
      setOrderStatus('processing');
      setNotes('Ordered via WhatsApp chat');
    }
    setErrors({});
  }, [isOpen, initialOrder, nextOrderId, allProducts]);

  // Quick Select Customer Handler
  const handleSelectCustomer = (e) => {
    const selectedCusId = e.target.value;
    if (!selectedCusId) return;
    const found = customers.find(c => c.id === selectedCusId);
    if (found) {
      setCustomerId(found.id);
      setCustomerName(found.name || `${found.firstName || ''} ${found.lastName || ''}`.trim());
      setCustomerPhone(found.phone || '');
      setCustomerEmail(found.email || '');
      if (found.addresses && found.addresses[0]) {
        const addr = found.addresses[0];
        setAddressLine1(addr.street || addr.line1 || '');
        setCity(addr.city || '');
        setStateName(addr.state || '');
        setPincode(addr.pincode || '');
      }
    }
  };

  // Product Selection handler
  const handleProductSelect = (index, prodId) => {
    const newItems = [...items];
    if (prodId === 'custom') {
      newItems[index] = {
        ...newItems[index],
        productId: 'custom',
        name: '',
        variant: 'Free Size',
        qty: newItems[index].qty || 1,
        price: 0,
        image: '',
        sku: 'CUSTOM',
        isCustom: true,
      };
      setItems(newItems);
      return;
    }

    const prod = allProducts.find(p => String(p.id) === String(prodId) || String(p.sku) === String(prodId));
    if (prod) {
      const price = prod.price || prod.pricing?.basePrice || 0;
      const primaryImg = typeof prod.image === 'string' ? prod.image : (prod.images?.[0]?.url || prod.images?.[0] || '');
      
      // Auto-extract first variant
      let firstVariant = 'Free Size';
      if (prod.variants && prod.variants.length > 0) {
        const v = prod.variants[0];
        firstVariant = `${v.color ? v.color + ' / ' : ''}${v.size || 'Free Size'}`.trim();
      } else if (prod.sizes && prod.sizes.length > 0) {
        firstVariant = `${prod.colors?.[0] ? prod.colors[0] + ' / ' : ''}${prod.sizes[0]}`.trim();
      }

      newItems[index] = {
        ...newItems[index],
        productId: prod.id || prod.sku || '',
        name: prod.name || 'Product',
        variant: firstVariant,
        qty: newItems[index].qty || 1,
        price: price,
        image: primaryImg,
        sku: prod.sku || prod.id || '',
        selectedCategory: prod.category || newItems[index].selectedCategory || '',
        isCustom: false,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        productId: '',
        name: '',
        price: 0,
        image: '',
        sku: '',
        isCustom: false,
      };
    }
    setItems(newItems);
  };

  const handleCategoryFilterChange = (index, category) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      selectedCategory: category,
      productId: '', // reset selected product for this category
      name: '',
      price: 0,
      image: '',
      sku: '',
    };
    setItems(newItems);
  };

  const handleSearchFilterChange = (index, query) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      searchQuery: query,
    };
    setItems(newItems);
  };

  const handleItemFieldChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'qty' || field === 'price' ? Math.max(0, Number(value)) : value,
    };
    setItems(newItems);
  };

  const handleQtyChange = (index, delta) => {
    const newItems = [...items];
    const currentQty = Number(newItems[index].qty || 1);
    const updated = Math.max(1, currentQty + delta);
    newItems[index] = { ...newItems[index], qty: updated };
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', name: '', variant: 'Free Size', qty: 1, price: 0, image: '', sku: '', selectedCategory: '', searchQuery: '', isCustom: false }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      setItems([{ productId: '', name: '', variant: 'Free Size', qty: 1, price: 0, image: '', sku: '', selectedCategory: '', searchQuery: '', isCustom: false }]);
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Pricing calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, itm) => acc + (Number(itm.qty || 0) * Number(itm.price || 0)), 0);
  }, [items]);

  const total = useMemo(() => {
    const calc = subtotal - Number(discount || 0) + Number(shipping || 0) + Number(tax || 0);
    return Math.max(0, calc);
  }, [subtotal, discount, shipping, tax]);

  // Validation & Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!customerName.trim()) errs.customerName = 'Customer name is required';
    if (!customerPhone.trim()) errs.customerPhone = 'Customer phone number is required';

    const validItems = items.filter(i => (i.name || '').trim() && Number(i.price) >= 0 && Number(i.qty) > 0);
    if (validItems.length === 0) {
      errs.items = 'Please select or enter at least one product with name, price, and quantity.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const orderPayload = {
      id: orderId || nextOrderId,
      orderSource,
      customer: {
        id: customerId || `CUS000${Math.floor(100 + Math.random() * 900)}`,
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '')}@whatsapp.customer`,
      },
      address: {
        line1: addressLine1.trim() || 'Direct WhatsApp Order',
        city: city.trim() || 'Customer City',
        state: stateName.trim() || 'State',
        pincode: pincode.trim() || '000000',
      },
      items: validItems,
      subtotal,
      discount: Number(discount || 0),
      shipping: Number(shipping || 0),
      tax: Number(tax || 0),
      total,
      paymentMethod,
      paymentStatus,
      status: orderStatus,
      notes: notes.trim(),
      date: initialOrder?.date || new Date().toISOString().split('T')[0],
    };

    onSave(orderPayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <MessageCircle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-sans font-bold text-slate-800 text-base sm:text-lg">
                  {isEdit ? `Edit Order #${orderId}` : 'Create WhatsApp / Manual Order'}
                </h2>
                <span className="bg-brand-teal/10 text-brand-teal font-mono text-xs px-2.5 py-0.5 rounded-md font-bold border border-brand-teal/20">
                  #{orderId}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {orderSource} Order
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit ? 'Update items, customer shipping address, payment or fulfillment status.' : 'Select products by category & ID/name, or enter custom items for WhatsApp orders.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Config Ribbon */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Source:</span>
              <select
                value={orderSource}
                onChange={e => setOrderSource(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-brand-teal shadow-xs"
              >
                {ORDER_SOURCES.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Order ID:</span>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="SUK1029"
                className="w-28 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-brand-teal focus:outline-none focus:border-brand-teal shadow-xs"
              />
            </div>

            {customers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Existing Customer:</span>
                <select
                  onChange={handleSelectCustomer}
                  defaultValue=""
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-brand-teal max-w-[200px] shadow-xs"
                >
                  <option value="">Quick Select...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim()}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Customer & Address 2-Column Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Customer Details */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User size={14} className="text-brand-teal" />
                <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Customer Details</h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full text-xs bg-slate-50/50 border ${errors.customerName ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white`}
                />
                {errors.customerName && <p className="text-[10px] text-red-500 mt-1">{errors.customerName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full text-xs bg-slate-50/50 border ${errors.customerPhone ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} rounded-lg pl-7 pr-2 py-2 text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white`}
                    />
                    <Phone size={12} className="absolute left-2.5 top-3 text-slate-400" />
                  </div>
                  {errors.customerPhone && <p className="text-[10px] text-red-500 mt-1">{errors.customerPhone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="customer@gmail.com"
                      className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-lg pl-7 pr-2 py-2 text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white"
                    />
                    <Mail size={12} className="absolute left-2.5 top-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin size={14} className="text-brand-teal" />
                <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Shipping Address</h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Street / Flat / Address
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={e => setAddressLine1(e.target.value)}
                  placeholder="e.g. 42, Rose Garden Apartments, Indiranagar"
                  className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Bangalore"
                    className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={e => setStateName(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items Section - Category Filtering & Product Search Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Table Header / Action Bar */}
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={15} className="text-brand-teal" />
                <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                  Order Items
                </h3>
                <span className="text-[11px] font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full">
                  {items.length} item{items.length > 1 ? 's' : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Plus size={13} /> Add Another Item
              </button>
            </div>

            {errors.items && (
              <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle size={14} /> {errors.items}
              </div>
            )}

            {/* Structured Table Rows */}
            <div className="divide-y divide-slate-100">
              {/* Column Labels */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-2.5 bg-slate-100/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <div className="col-span-6">Product Selection (Category & Search)</div>
                <div className="col-span-2">Size / Variant</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-1 text-right">Unit Price</div>
                <div className="col-span-1 text-center">Remove</div>
              </div>

              {/* Items List */}
              {items.map((item, idx) => {
                const selectedProd = allProducts.find(p => String(p.id) === String(item.productId) || String(p.sku) === String(item.productId));
                
                // Filter products for this item row by Category and Search Query
                const filteredProductsForRow = allProducts.filter(p => {
                  if (item.selectedCategory && p.category !== item.selectedCategory) {
                    return false;
                  }
                  if (item.searchQuery && item.searchQuery.trim()) {
                    const q = item.searchQuery.toLowerCase().trim();
                    const matchId = (p.sku || p.id || '').toLowerCase().includes(q);
                    const matchName = (p.name || '').toLowerCase().includes(q);
                    return matchId || matchName;
                  }
                  return true;
                });

                // Extract variants if catalog product
                const variantOptions = [];
                if (selectedProd && selectedProd.variants && selectedProd.variants.length > 0) {
                  selectedProd.variants.forEach(v => {
                    const label = `${v.color ? v.color + ' / ' : ''}${v.size || 'Free Size'}`.trim();
                    if (!variantOptions.includes(label)) variantOptions.push(label);
                  });
                } else if (selectedProd && selectedProd.sizes && selectedProd.sizes.length > 0) {
                  selectedProd.sizes.forEach(sz => {
                    const label = `${selectedProd.colors?.[0] ? selectedProd.colors[0] + ' / ' : ''}${sz}`.trim();
                    if (!variantOptions.includes(label)) variantOptions.push(label);
                  });
                }

                return (
                  <div
                    key={idx}
                    className="p-4 md:px-5 md:py-3.5 flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Col 1: Product Selection, Category Dropdown & Search (6 cols) */}
                    <div className="w-full md:col-span-6 flex items-start gap-3">
                      {/* Image Thumbnail */}
                      <div className="w-12 h-14 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center mt-1">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag size={18} className="text-slate-400" />
                        )}
                      </div>

                      {/* Filter Bar & Dropdown */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {!item.isCustom ? (
                          <>
                            {/* Step 1: Category Filter & Search Bar */}
                            <div className="grid grid-cols-2 gap-2">
                              {/* 1. Category Dropdown */}
                              <div className="relative">
                                <select
                                  value={item.selectedCategory || ''}
                                  onChange={e => handleCategoryFilterChange(idx, e.target.value)}
                                  className="w-full text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-brand-teal"
                                >
                                  <option value="">📁 All Categories</option>
                                  {categoriesList.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>

                              {/* 2. Search by Product ID or Name */}
                              <div className="relative">
                                <Search size={11} className="absolute left-2 top-2.5 text-slate-400" />
                                <input
                                  type="text"
                                  value={item.searchQuery || ''}
                                  onChange={e => handleSearchFilterChange(idx, e.target.value)}
                                  placeholder="Search ID / Name..."
                                  className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg pl-6 pr-2 py-1.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:bg-white"
                                />
                                {item.searchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => handleSearchFilterChange(idx, '')}
                                    className="absolute right-1.5 top-2 text-[10px] text-slate-400 hover:text-slate-600"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Step 2: Filtered Products Dropdown */}
                            <select
                              value={item.productId || ''}
                              onChange={e => handleProductSelect(idx, e.target.value)}
                              className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-brand-teal shadow-xs"
                            >
                              <option value="">
                                {filteredProductsForRow.length === 0
                                  ? '-- No products found in this category/search --'
                                  : `-- Select Product (${filteredProductsForRow.length} available) --`}
                              </option>
                              {filteredProductsForRow.map(p => {
                                const prodId = p.sku || p.id || 'N/A';
                                const price = (p.price || p.pricing?.basePrice || 0).toLocaleString('en-IN');
                                return (
                                  <option key={p.id || p.sku} value={p.id || p.sku}>
                                    [{prodId}] {p.name} — ₹{price}
                                  </option>
                                );
                              })}
                              <option value="custom">+ Type Custom / Non-Catalog Item</option>
                            </select>

                            {item.sku && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-semibold text-brand-navy">
                                  ID: {item.sku}
                                </span>
                                {item.selectedCategory && (
                                  <span className="text-slate-400">{item.selectedCategory}</span>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                Custom Item
                              </span>
                              <button
                                type="button"
                                onClick={() => handleProductSelect(idx, '')}
                                className="text-[10px] text-brand-teal hover:underline font-semibold"
                              >
                                Pick from Catalog
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item.name}
                              onChange={e => handleItemFieldChange(idx, 'name', e.target.value)}
                              placeholder="Enter Custom Item Name..."
                              className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-brand-teal"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Col 2: Variant / Size Selection Dropdown (2 cols) */}
                    <div className="w-full md:col-span-2">
                      <label className="block md:hidden text-[10px] font-semibold text-slate-500 mb-1">Variant / Size</label>
                      <select
                        value={item.variant || 'Free Size'}
                        onChange={e => handleItemFieldChange(idx, 'variant', e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-brand-teal font-medium"
                      >
                        {/* If product has specific variants */}
                        {variantOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                        {/* Standard size options if not already in variantOptions */}
                        {['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].filter(s => !variantOptions.includes(s)).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        {item.variant && !variantOptions.includes(item.variant) && !['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].includes(item.variant) && (
                          <option value={item.variant}>{item.variant}</option>
                        )}
                      </select>
                    </div>

                    {/* Col 3: Quantity with Stepper (2 cols) */}
                    <div className="w-full md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="block md:hidden text-[10px] font-semibold text-slate-500">Qty:</span>
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={e => handleItemFieldChange(idx, 'qty', e.target.value)}
                          className="w-10 text-center text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Col 4: Price Input (1 col) */}
                    <div className="w-full md:col-span-1 flex items-center justify-between md:justify-end gap-2">
                      <span className="block md:hidden text-[10px] font-semibold text-slate-500">Unit Price:</span>
                      <div className="relative inline-block w-full">
                        <span className="absolute left-2 top-2 text-xs text-slate-400 font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={e => handleItemFieldChange(idx, 'price', e.target.value)}
                          className="w-full text-right text-xs font-bold bg-white border border-slate-200 rounded-lg pl-5 pr-2 py-1.5 text-slate-800 focus:outline-none focus:border-brand-teal"
                        />
                      </div>
                    </div>

                    {/* Col 5: Remove (1 col) */}
                    <div className="w-full md:col-span-1 flex justify-end md:justify-center pt-1 md:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row inside Items card */}
            <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Items Total: <strong>{items.length}</strong></span>
              <span className="text-slate-700">Subtotal: <strong className="text-slate-900 font-bold">₹{subtotal.toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          {/* Pricing, Payment & Status Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Payment & Status */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <CreditCard size={14} className="text-brand-teal" />
                <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Payment & Status</h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-teal"
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value)}
                    className="w-full text-xs capitalize bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-teal font-medium"
                  >
                    {PAYMENT_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order Status</label>
                  <select
                    value={orderStatus}
                    onChange={e => setOrderStatus(e.target.value)}
                    className="w-full text-xs capitalize bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-teal font-semibold text-brand-teal"
                  >
                    {ORDER_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order Notes (WhatsApp Chat / Instructions)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Chat transcript notes, special blouse stitching requirements, etc."
                  className="w-full text-xs bg-slate-50/50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-brand-teal resize-none"
                />
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles size={14} className="text-brand-teal" />
                <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Order Summary</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Items Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Discount (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={e => setDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-24 text-right text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-brand-teal font-medium text-emerald-600"
                  />
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Shipping Fee (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={shipping}
                    onChange={e => setShipping(Math.max(0, Number(e.target.value)))}
                    className="w-24 text-right text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-brand-teal font-medium"
                  />
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Tax / GST (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={tax}
                    onChange={e => setTax(Math.max(0, Number(e.target.value)))}
                    className="w-24 text-right text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:border-brand-teal font-medium"
                  />
                </div>

                <div className="flex justify-between items-center border-t border-slate-200 pt-3 mt-2">
                  <span className="font-bold text-slate-800 text-sm">Grand Total</span>
                  <span className="font-bold text-brand-teal text-lg">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <Check size={14} className="text-emerald-600 flex-shrink-0" />
                <span>Ready to save. Order ID <strong>#{orderId}</strong> will be registered immediately.</span>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-teal/20 active:scale-95 cursor-pointer"
          >
            <Check size={14} />
            {isEdit ? 'Save Changes' : 'Create & Save Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
