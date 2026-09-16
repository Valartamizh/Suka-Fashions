import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, ChevronRight, MessageSquare, Truck, Plus, X, MapPin, Eye, Edit2 } from 'lucide-react';
import logo from '../assets/logo.jpg';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

const STEPS = [
  { id: 1, name: 'Address' },
  { id: 2, name: 'Review & Confirm' }
];

const PUBLIC_PRODUCT_IMAGES = {
  sarees: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
  kurtis: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
  lehengas: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
  dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
  occasion: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
};

const getProductImageUrl = (item) => {
  if (item.image && typeof item.image === 'string' && item.image.startsWith('http')) {
    return item.image;
  }
  const category = (item.category || '').toLowerCase();
  return PUBLIC_PRODUCT_IMAGES[category] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80';
};

const DEFAULT_SAVED_ADDRESSES = [
  {
    id: 1,
    name: 'Pooja',
    street: '123 Fashion Street, Apt 4B',
    apartment: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 98765 43210',
    isDefault: true,
  },
];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { settings } = useSettings();
  const storeWhatsAppPhone = settings?.store?.whatsappNumber || settings?.store?.supportPhone || '+91 9488463850';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Saved Addresses State (Synced with localStorage / Account page)
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
    } catch (e) {
      return DEFAULT_SAVED_ADDRESSES;
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_addresses');
      const list = saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
      const def = list.find((a) => a.isDefault) || list[0];
      return def ? def.id : null;
    } catch (e) {
      return 1;
    }
  });

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Sync addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('suka_addresses', JSON.stringify(addresses));
    } catch (e) {
      console.error('Error saving addresses', e);
    }
  }, [addresses]);

  // Pre-filled Customer Form Data
  const [formData, setFormData] = useState({
    email: 'aditi.sharma@example.com',
    firstName: 'Aditi',
    lastName: 'Sharma',
    address: '123 Heritage Avenue, Apt 4B',
    apartment: 'Jubilee Hills',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 98765 43210',
  });

  // Sync selected address into formData
  useEffect(() => {
    if (selectedAddressId) {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        const parts = (addr.name || '').trim().split(' ');
        setFormData((prev) => ({
          ...prev,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || '',
          address: addr.street || '',
          apartment: addr.apartment || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          phone: addr.phone || '',
        }));
      }
    }
  }, [selectedAddressId, addresses]);

  const freeMin = Number(settings?.shipping?.freeShippingMin ?? 1999);
  const stdCharge = Number(settings?.shipping?.standardCharge ?? 99);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > freeMin ? 0 : stdCharge;
  const total = subtotal + shipping;

  const [checkoutErrors, setCheckoutErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (checkoutErrors[field]) {
      setCheckoutErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressErrors({});
    setAddressForm({
      name: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: addresses.length === 0,
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr, e) => {
    if (e) {
      e.stopPropagation();
    }
    setEditingAddressId(addr.id);
    setAddressErrors({});
    setAddressForm({
      name: addr.name || '',
      street: addr.street || '',
      apartment: addr.apartment || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      phone: addr.phone || '',
      isDefault: addr.isDefault || false,
    });
    setAddressModalOpen(true);
  };

  const validateAddressForm = () => {
    const errs = {};
    if (!addressForm.name.trim() || addressForm.name.trim().length < 2) {
      errs.name = 'Full Name is required (min 2 characters)';
    }
    if (!addressForm.street.trim() || addressForm.street.trim().length < 5) {
      errs.street = 'Street address is required (min 5 characters)';
    }
    if (!addressForm.city.trim()) {
      errs.city = 'City is required';
    }
    if (!addressForm.state.trim()) {
      errs.state = 'State is required';
    }
    const pincodeClean = (addressForm.pincode || '').replace(/\D/g, '');
    if (!pincodeClean || pincodeClean.length !== 6) {
      errs.pincode = 'Valid 6-digit PIN code required';
    }
    const rawDigits = (addressForm.phone || '').replace(/\D/g, '');
    const phoneDigits = rawDigits.slice(-10);
    if (!phoneDigits || phoneDigits.length !== 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddressSubmit = (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    if (editingAddressId) {
      // Update existing address
      let updatedList = addresses.map((a) => {
        if (a.id === editingAddressId) {
          return {
            ...a,
            ...addressForm,
            id: editingAddressId,
          };
        }
        if (addressForm.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });
      setAddresses(updatedList);
      setSelectedAddressId(editingAddressId);
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        ...addressForm,
      };
      let updatedList = addresses;
      if (addressForm.isDefault) {
        updatedList = addresses.map((a) => ({ ...a, isDefault: false }));
      }
      const finalAddresses = [...updatedList, newAddress];
      setAddresses(finalAddresses);
      setSelectedAddressId(newAddress.id);
    }

    setAddressModalOpen(false);
  };

  const validateStep1 = () => {
    if (addresses.length > 0 && selectedAddressId) {
      return true;
    }
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      errs.firstName = 'First Name is required (minimum 2 letters)';
    }
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Street Address is required (minimum 5 characters)';
    }
    if (!formData.city.trim()) {
      errs.city = 'City is required';
    }
    if (!formData.state.trim()) {
      errs.state = 'State is required';
    }
    const pincodeClean = (formData.pincode || '').replace(/\D/g, '');
    if (!pincodeClean || pincodeClean.length !== 6) {
      errs.pincode = 'Valid 6-digit PIN Code required';
    }
    const rawDigits = (formData.phone || '').replace(/\D/g, '');
    const phoneDigits = rawDigits.slice(-10);
    if (!phoneDigits || phoneDigits.length !== 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    setCheckoutErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else {
      // Final step submit: Redirect to WhatsApp with complete order breakdown
      const orderId = `SUKA-${Math.floor(10000 + Math.random() * 90000)}`;

      const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
      const customerName = selectedAddr ? selectedAddr.name : `${formData.firstName} ${formData.lastName}`.trim();
      const customerPhone = selectedAddr ? selectedAddr.phone : formData.phone;
      const customerStreet = selectedAddr ? selectedAddr.street : formData.address;
      const customerApartment = selectedAddr ? (selectedAddr.apartment || '') : (formData.apartment || '');
      const customerCity = selectedAddr ? selectedAddr.city : formData.city;
      const customerState = selectedAddr ? selectedAddr.state : formData.state;
      const customerPincode = selectedAddr ? selectedAddr.pincode : formData.pincode;

      const itemsListText = cartItems
        .map(item => {
          const imgUrl = getProductImageUrl(item);
          return `• *${item.name}* (${item.selectedSize || item.size || 'Free Size'}${item.selectedColor ? `, Color: ${item.selectedColor}` : ''}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n  📷 *Product Photo:* ${imgUrl}`;
        })
        .join('\n\n');

      const fullAddressStr = `${customerStreet}${customerApartment ? ', ' + customerApartment : ''}, ${customerCity}, ${customerState} - ${customerPincode}`;

      const whatsappMsg = encodeURIComponent(
        `*NEW ORDER PLACED ON SUKA FASHIONS* 🛍️\n` +
        `-----------------------------------\n` +
        `*Order ID:* ${orderId}\n` +
        `*Customer Name:* ${customerName}\n` +
        `*Phone:* ${customerPhone}\n` +
        `${formData.email ? `*Email:* ${formData.email}\n` : ''}` +
        `*Delivery Address:* ${fullAddressStr}\n\n` +
        `*ITEMS ORDERED:*\n${itemsListText}\n\n` +
        `*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n` +
        `*Delivery Charge:* FREE (Standard Delivery)\n` +
        `*TOTAL AMOUNT:* ₹${total.toLocaleString('en-IN')}\n` +
        `-----------------------------------\n` +
        `Please confirm my order and share dispatch details. Thank you!`
      );

      // Save order to OrderContext
      const createdOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: 'Processing',
        total: total,
        subtotal: subtotal,
        shipping: 0,
        paymentMethod: 'WhatsApp Express Checkout',
        items: cartItems.map(item => ({
          ...item,
          selectedSize: item.selectedSize || item.size || 'Free Size',
        })),
        address: {
          name: customerName,
          street: customerStreet,
          locality: customerApartment || customerCity,
          city: customerCity,
          state: customerState,
          pincode: customerPincode,
          phone: customerPhone,
        },
        timeline: [
          { label: 'Order Placed', date: 'Just Now', done: true },
          { label: 'Processing & Quality Check', date: 'In Progress', done: true },
          { label: 'Dispatched / Courier Air', date: 'Expected in 2-3 Days', done: false },
          { label: 'Doorstep Delivery', date: 'Expected in 4-5 Days', done: false },
        ],
      };

      addOrder(createdOrder);

      // Launch WhatsApp chat with configured store phone
      const whatsappUrl = getWhatsAppUrl(storeWhatsAppPhone, whatsappMsg);
      window.open(whatsappUrl, '_blank');

      // Clear cart & navigate to order success screen
      clearCart();
      navigate('/order-success', { state: { orderId: createdOrder.id, order: createdOrder } });
    }
  };

  return (
    <div className="bg-brand-cream/20 min-h-[85vh] pb-16 text-left">
      
      {/* Checkout Header with Brand Logo */}
      <div className="bg-white border-b border-brand-powder/60 py-3.5 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Suka Fashions Logo" className="w-10 h-10 object-contain rounded-full border border-brand-powder/60 shadow-2xs" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-brand-navy leading-none">
                Suka
              </span>
              <span className="font-sans text-[8.5px] tracking-[0.3em] text-brand-teal uppercase font-bold mt-0.5">
                FASHIONS
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-brand-navy/70 font-sans text-[10px] uppercase tracking-[0.15em] font-semibold bg-brand-cream/40 px-3 py-1.5 rounded-full border border-brand-powder/50">
            <ShieldCheck size={16} className="text-brand-teal" /> Express WhatsApp Checkout
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-6 sm:pt-8 pb-12 lg:pb-16">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16">
          
          {/* Left: Steps Form */}
          <div className="lg:w-[55%] xl:w-[60%]">
            
            {/* Stepper */}
            <div className="flex items-center justify-between mb-7 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-brand-powder/60 z-0" />
              {STEPS.map((step) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-brand-cream/20 px-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-sans text-[10px] transition-colors ${
                    currentStep > step.id ? 'bg-brand-teal text-white' : 
                    currentStep === step.id ? 'bg-brand-navy text-white ring-4 ring-brand-navy/10' : 
                    'bg-white border border-brand-powder text-brand-navy/40'
                  }`}>
                    {currentStep > step.id ? <Check size={12} strokeWidth={3} /> : step.id}
                  </div>
                  <span className={`font-sans text-[9px] uppercase tracking-wider ${currentStep >= step.id ? 'text-brand-navy font-semibold' : 'text-brand-navy/40'}`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Forms Container */}
            <div className="bg-white border border-brand-powder/50 rounded-sm p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleNext}>
                
                {/* STEP 1: Address */}
                {currentStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h2 className="font-serif text-xl sm:text-2xl text-brand-navy">Shipping Address</h2>
                        <p className="font-sans text-xs text-brand-navy/60 mt-0.5">Select a saved address or add a new delivery location.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenAddAddress}
                        className="self-start sm:self-auto font-sans text-xs text-brand-teal border border-brand-teal px-4 py-2 rounded-sm hover:bg-brand-teal hover:text-white transition-all uppercase tracking-[0.1em] font-semibold flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus size={15} /> Add New Address
                      </button>
                    </div>

                    {/* Saved Address Cards (When user has saved addresses) */}
                    {addresses.length > 0 ? (
                      <div className="mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {addresses.map((addr) => {
                            const isSelected = selectedAddressId === addr.id;
                            return (
                              <div
                                key={addr.id}
                                onClick={() => setSelectedAddressId(addr.id)}
                                className={`p-4 border rounded-sm cursor-pointer transition-all relative flex flex-col justify-between ${
                                  isSelected
                                    ? 'border-brand-teal bg-brand-powderLight/60 shadow-sm ring-1 ring-brand-teal'
                                    : 'border-brand-powder bg-white hover:border-brand-teal/60'
                                }`}
                              >
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={isSelected}
                                        onChange={() => setSelectedAddressId(addr.id)}
                                        className="w-4 h-4 text-brand-teal focus:ring-brand-teal cursor-pointer"
                                      />
                                      <span className="font-sans text-sm font-semibold text-brand-navy">
                                        {addr.name}
                                      </span>
                                    </div>
                                    {addr.isDefault && (
                                      <span className="bg-brand-teal text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                                        Default Address
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-sans text-xs text-brand-navy/70 leading-relaxed ml-6">
                                    {addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}<br />
                                    {addr.city}, {addr.state} - {addr.pincode}<br />
                                    Phone: <span className="font-medium text-brand-navy">{addr.phone}</span>
                                  </p>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-brand-powder/50 ml-6">
                                  <span className="text-[10.5px] text-brand-navy/50 font-sans">
                                    {isSelected ? '✓ Selected' : ''}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleOpenEditAddress(addr, e)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-teal/80 text-brand-teal hover:bg-brand-teal hover:text-white rounded-xs font-sans text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
                                  >
                                    <Eye size={13} />
                                    <span>View & Edit</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* Delivery Form Fields (When first time or no saved address) */
                      <div className="border-t border-brand-powder/60 pt-6">
                        <h3 className="font-sans text-[11px] uppercase tracking-widest font-semibold text-brand-navy/70 mb-4">
                          Contact & Address Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="sm:col-span-2">
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Email Address *</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className={`w-full border px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm ${
                                checkoutErrors.email ? 'border-red-500' : 'border-brand-powder'
                              }`}
                            />
                            {checkoutErrors.email && (
                              <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {checkoutErrors.email}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">First Name *</label>
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              className={`w-full border px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm ${
                                checkoutErrors.firstName ? 'border-red-500' : 'border-brand-powder'
                              }`}
                            />
                            {checkoutErrors.firstName && (
                              <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {checkoutErrors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Last Name</label>
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Street Address *</label>
                            <input
                              type="text"
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              className={`w-full border px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm mb-3 ${
                                checkoutErrors.address ? 'border-red-500' : 'border-brand-powder'
                              }`}
                            />
                            {checkoutErrors.address && (
                              <p className="font-sans text-[10px] text-red-500 mb-3 font-semibold">⚠️ {checkoutErrors.address}</p>
                            )}
                            <input
                              type="text"
                              value={formData.apartment}
                              onChange={(e) => handleInputChange('apartment', e.target.value)}
                              placeholder="Apartment, suite, landmark (optional)"
                              className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">City *</label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              className={`w-full border px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm ${
                                checkoutErrors.city ? 'border-red-500' : 'border-brand-powder'
                              }`}
                            />
                            {checkoutErrors.city && (
                              <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {checkoutErrors.city}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">State *</label>
                              <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                className={`w-full border px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none rounded-sm bg-white ${
                                  checkoutErrors.state ? 'border-red-500' : 'border-brand-powder'
                                }`}
                              />
                              {checkoutErrors.state && (
                                <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {checkoutErrors.state}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">PIN Code *</label>
                              <input
                                type="text"
                                maxLength={6}
                                value={formData.pincode}
                                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                                className={`w-full border px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm ${
                                  checkoutErrors.pincode ? 'border-red-500' : 'border-brand-powder'
                                }`}
                              />
                              {checkoutErrors.pincode && (
                                <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {checkoutErrors.pincode}</p>
                              )}
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Mobile Phone Number (WhatsApp Enabled) *</label>
                            <input
                              type="tel"
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                              className={`w-full border px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-all rounded-sm ${
                                checkoutErrors.phone ? 'border-red-500' : 'border-brand-powder'
                              }`}
                            />
                            {checkoutErrors.phone && (
                              <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {checkoutErrors.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: Review & WhatsApp Redirect Notice */}
                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Review & Place Order</h2>
                    
                    <div className="space-y-6">
                      
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm flex items-start gap-3 text-emerald-900">
                        <MessageSquare size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-sans text-xs font-bold uppercase tracking-wider mb-0.5">WhatsApp Redirect Enabled</p>
                          <p className="font-sans text-[11px] text-emerald-800 leading-relaxed">
                            Clicking <strong>"Place Order on WhatsApp"</strong> below will format your complete order invoice and launch a direct chat with Suka Fashions support ({storeWhatsAppPhone}) for instant confirmation.
                          </p>
                        </div>
                      </div>

                      <div className="border border-brand-powder/50 p-5 rounded-sm bg-brand-cream/10">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-powder/50">
                          <h3 className="font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-navy">Shipping Address</h3>
                          <button type="button" onClick={() => setCurrentStep(1)} className="text-[10px] uppercase text-brand-teal hover:underline font-bold">Edit</button>
                        </div>
                        <p className="font-sans text-xs text-brand-navy/80 leading-relaxed">
                          <strong className="text-brand-navy">{formData.firstName} {formData.lastName}</strong><br/>
                          {formData.address}{formData.apartment ? `, ${formData.apartment}` : ''}<br/>
                          {formData.city}, {formData.state} - {formData.pincode}<br/>
                          Phone: <span className="font-semibold text-brand-teal">{formData.phone}</span>
                        </p>
                      </div>

                      <div className="border border-brand-powder/50 p-4 rounded-sm bg-brand-cream/10 flex items-center gap-3">
                        <Truck size={18} className="text-brand-teal flex-shrink-0" />
                        <div className="text-xs font-sans text-brand-navy/80">
                          <span className="font-semibold text-brand-navy">Delivery Service: </span>
                          <span className="text-brand-teal font-bold uppercase tracking-wider">FREE Standard Shipping</span> (3-5 business days)
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:w-[45%] xl:w-[40%]">
            <div className="bg-white border border-brand-powder/50 rounded-sm p-6 shadow-sm sticky top-6">
              
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-6 pb-4 border-b border-brand-powder/60">
                Order Summary ({cartItems.length} Items)
              </h2>
              
              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => {
                  const pId = item.productId || item.sku || (products.find(p => p.id === item.id)?.productId) || item.id;
                  return (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-brand-cream border border-brand-powder/40 rounded-sm overflow-hidden flex-shrink-0 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 bg-brand-navy text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-sm text-brand-navy line-clamp-1 mb-0.5">{item.name}</p>
                        <p className="font-sans text-[10px] text-brand-navy/60 uppercase tracking-wider">
                          Size: {item.selectedSize || item.size || 'Free Size'}
                          {item.selectedColor ? ` • ${item.selectedColor}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-sans text-sm font-semibold text-brand-navy">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-brand-powder/60">
                <div className="flex justify-between font-sans text-xs text-brand-navy/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-sans text-xs text-brand-navy/70">
                  <span>Delivery Charge</span>
                  <span className="text-brand-teal font-semibold">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-sans pt-4 border-t border-brand-powder/60">
                <span className="text-sm uppercase tracking-widest font-semibold text-brand-navy">Total</span>
                <div className="text-right">
                  <span className="text-[10px] text-brand-navy/40 mr-2">INR</span>
                  <span className="text-xl font-bold text-brand-navy">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Continue / WhatsApp Place Order Button under Total Amount */}
              <div className="mt-6 pt-4 border-t border-brand-powder/60">
                <button 
                  type="button"
                  onClick={handleNext}
                  className={`w-full py-3.5 px-6 font-sans text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                    currentStep === 2 ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg' : 'bg-brand-navy hover:bg-brand-teal text-white'
                  }`}
                >
                  {currentStep === 2 ? (
                    <>
                      <MessageSquare size={16} /> Place Order on WhatsApp
                    </>
                  ) : (
                    <>
                      Continue to Review <ChevronRight size={14} />
                    </>
                  )}
                </button>

                <div className="mt-3 text-center">
                  {currentStep > 1 ? (
                    <button 
                      type="button" 
                      onClick={() => {
                        setCurrentStep(currentStep - 1);
                        window.scrollTo(0, 0);
                      }}
                      className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 hover:text-brand-navy transition-colors font-medium hover:underline cursor-pointer"
                    >
                      Back to Address
                    </button>
                  ) : (
                    <Link to="/cart" className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 hover:text-brand-navy transition-colors font-medium hover:underline">
                      Return to Bag
                    </Link>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Add Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-powder/60 bg-brand-cream/20">
              <div>
                <h3 className="font-serif text-lg font-semibold text-brand-navy">
                  {editingAddressId ? 'View & Edit Address' : 'Add New Address'}
                </h3>
                <p className="font-sans text-[11px] text-brand-navy/60">
                  {editingAddressId ? 'Review or update your delivery information' : 'Enter your complete delivery address'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="text-brand-navy/50 hover:text-brand-navy p-1 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAddressSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1 font-bold">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(e) => {
                    setAddressForm({ ...addressForm, name: e.target.value });
                    if (addressErrors.name) setAddressErrors({ ...addressErrors, name: '' });
                  }}
                  placeholder="e.g. Aditi Sharma"
                  className={`w-full border px-3.5 py-2 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                    addressErrors.name ? 'border-red-500' : 'border-brand-powder'
                  }`}
                />
                {addressErrors.name && (
                  <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1 font-bold">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => {
                    setAddressForm({ ...addressForm, street: e.target.value });
                    if (addressErrors.street) setAddressErrors({ ...addressErrors, street: '' });
                  }}
                  placeholder="House no, street name"
                  className={`w-full border px-3.5 py-2 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                    addressErrors.street ? 'border-red-500' : 'border-brand-powder'
                  }`}
                />
                {addressErrors.street && (
                  <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.street}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1 font-bold">
                  Apartment, Suite, Locality
                </label>
                <input
                  type="text"
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  placeholder="Landmark or area"
                  className="w-full border border-brand-powder px-3.5 py-2 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1 font-bold">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, city: e.target.value });
                      if (addressErrors.city) setAddressErrors({ ...addressErrors, city: '' });
                    }}
                    placeholder="e.g. Mumbai"
                    className={`w-full border px-3.5 py-2 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.city ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.city && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1 font-bold">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, state: e.target.value });
                      if (addressErrors.state) setAddressErrors({ ...addressErrors, state: '' });
                    }}
                    placeholder="e.g. Maharashtra"
                    className={`w-full border px-3.5 py-2 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.state ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.state && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1 font-bold">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') });
                      if (addressErrors.pincode) setAddressErrors({ ...addressErrors, pincode: '' });
                    }}
                    placeholder="e.g. 400050"
                    className={`w-full border px-3.5 py-2 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.pincode ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.pincode && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.pincode}</p>
                  )}
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1 font-bold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={addressForm.phone}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') });
                      if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: '' });
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full border px-3.5 py-2 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.phone ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.phone && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-brand-navy select-none">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 text-brand-teal rounded border-brand-powder focus:ring-brand-teal"
                  />
                  <span>Set as Default Shipping Address</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-powder/60">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 font-sans text-xs uppercase tracking-wider border border-brand-powder text-brand-navy/70 hover:bg-gray-50 rounded-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-sans text-xs uppercase tracking-wider bg-brand-navy hover:bg-brand-teal text-white rounded-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  {editingAddressId ? 'Save Changes' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
