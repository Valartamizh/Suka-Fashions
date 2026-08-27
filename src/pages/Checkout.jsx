import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, ChevronRight, MessageSquare, Truck, CreditCard } from 'lucide-react';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

const STEPS = [
  { id: 1, name: 'Address' },
  { id: 2, name: 'Delivery' },
  { id: 3, name: 'Payment' },
  { id: 4, name: 'Review' }
];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Pre-filled Mock Customer Data
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

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Netbanking');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = deliveryMethod === 'express' ? 250 : 0;
  const total = subtotal + shipping;

  const [checkoutErrors, setCheckoutErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (checkoutErrors[field]) {
      setCheckoutErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
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
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step submit: Redirect to WhatsApp with complete order breakdown
      const orderId = `SUKA-${Math.floor(10000 + Math.random() * 90000)}`;
      const itemsListText = cartItems
        .map(item => `• ${item.name} (${item.size}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
        .join('\n');

      const whatsappMsg = encodeURIComponent(
        `*NEW ORDER PLACED ON SUKA FASHIONS* 🛍️\n` +
        `-----------------------------------\n` +
        `*Order ID:* ${orderId}\n` +
        `*Customer Name:* ${formData.firstName} ${formData.lastName}\n` +
        `*Phone:* ${formData.phone}\n` +
        `*Email:* ${formData.email}\n` +
        `*Delivery Address:* ${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pincode}\n\n` +
        `*ITEMS ORDERED:*\n${itemsListText}\n\n` +
        `*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}\n` +
        `*Delivery Charge:* ${shipping === 0 ? 'FREE (Standard)' : `₹${shipping} (Express)`}\n` +
        `*TOTAL AMOUNT:* ₹${total.toLocaleString('en-IN')}\n` +
        `*Payment Choice:* ${paymentMethod}\n` +
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
        shipping: shipping,
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
          ...item,
          selectedSize: item.selectedSize || item.size || 'Free Size',
        })),
        address: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          locality: formData.apartment || formData.city,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        timeline: [
          { label: 'Order Placed', date: 'Just Now', done: true },
          { label: 'Processing & Quality Check', date: 'In Progress', done: true },
          { label: 'Dispatched / Courier Air', date: 'Expected in 2-3 Days', done: false },
          { label: 'Doorstep Delivery', date: 'Expected in 4-5 Days', done: false },
        ],
      };

      addOrder(createdOrder);

      // Launch WhatsApp chat
      window.open(`https://wa.me/919876543210?text=${whatsappMsg}`, '_blank');

      // Clear cart & navigate to order success screen
      clearCart();
      navigate('/order-success');
    }
  };

  return (
    <div className="bg-brand-cream/20 min-h-[85vh] pb-16 text-left">
      
      {/* Checkout Header */}
      <div className="bg-white border-b border-brand-powder/60 py-4">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 flex justify-between items-center">
          <Link to="/" className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-brand-navy">
            Suka <span className="font-sans text-[9px] tracking-[0.3em] text-brand-teal uppercase ml-1">FASHIONS</span>
          </Link>
          <div className="flex items-center gap-2 text-brand-navy/60 font-sans text-[10px] uppercase tracking-[0.15em] font-medium">
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
                
                {/* STEP 1: Address (Pre-filled with Mock Data) */}
                {currentStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-serif text-xl sm:text-2xl text-brand-navy">Shipping Address</h2>
                      <span className="text-[10px] font-sans uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200 font-bold">
                        Pre-filled Mock Customer Data
                      </span>
                    </div>

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

                {/* STEP 2: Delivery */}
                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Delivery Method</h2>
                    <div className="space-y-4">
                      <label 
                        onClick={() => setDeliveryMethod('standard')}
                        className={`flex items-start gap-4 border p-5 rounded-sm cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-brand-teal bg-brand-powderLight' : 'border-brand-powder'}`}
                      >
                        <input type="radio" name="delivery" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="mt-1 w-4 h-4 text-brand-teal border-brand-teal focus:ring-brand-teal" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-sans text-sm font-semibold text-brand-navy">Standard Delivery</span>
                            <span className="font-sans text-xs font-bold text-brand-teal">Free</span>
                          </div>
                          <p className="font-sans text-[11px] text-brand-navy/60">Delivered in 3-5 business days via BlueDart / Delhivery</p>
                        </div>
                      </label>

                      <label 
                        onClick={() => setDeliveryMethod('express')}
                        className={`flex items-start gap-4 border p-5 rounded-sm cursor-pointer transition-colors ${deliveryMethod === 'express' ? 'border-brand-teal bg-brand-powderLight' : 'border-brand-powder'}`}
                      >
                        <input type="radio" name="delivery" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="mt-1 w-4 h-4 text-brand-teal border-brand-powder focus:ring-brand-teal" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-sans text-sm font-medium text-brand-navy">Express Air Courier</span>
                            <span className="font-sans text-xs font-bold text-brand-navy">₹250</span>
                          </div>
                          <p className="font-sans text-[11px] text-brand-navy/60">Delivered in 1-2 business days with priority packing</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 3: Payment Choice */}
                {currentStep === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Select Preferred Payment Method</h2>
                    <div className="space-y-4">
                      
                      <label onClick={() => setPaymentMethod('UPI / Netbanking')} className={`flex items-start gap-4 border p-5 rounded-sm cursor-pointer transition-all ${paymentMethod === 'UPI / Netbanking' ? 'border-brand-teal bg-brand-powderLight' : 'border-brand-powder'}`}>
                        <input type="radio" name="payment" checked={paymentMethod === 'UPI / Netbanking'} onChange={() => setPaymentMethod('UPI / Netbanking')} className="mt-1 w-4 h-4 text-brand-teal" />
                        <div className="flex-1">
                          <span className="font-sans text-sm font-semibold text-brand-navy block mb-1">UPI / Google Pay / PhonePe / Netbanking</span>
                          <p className="font-sans text-[11px] text-brand-navy/60">Instant payment link sent via WhatsApp upon order confirmation.</p>
                        </div>
                      </label>

                      <label onClick={() => setPaymentMethod('Cash on Delivery (COD)')} className={`flex items-start gap-4 border p-5 rounded-sm cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery (COD)' ? 'border-brand-teal bg-brand-powderLight' : 'border-brand-powder'}`}>
                        <input type="radio" name="payment" checked={paymentMethod === 'Cash on Delivery (COD)'} onChange={() => setPaymentMethod('Cash on Delivery (COD)')} className="mt-1 w-4 h-4 text-brand-teal" />
                        <div className="flex-1">
                          <span className="font-sans text-sm font-semibold text-brand-navy block mb-1">Cash on Delivery (COD)</span>
                          <p className="font-sans text-[11px] text-brand-navy/60">Pay cash directly to the courier executive upon doorstep delivery.</p>
                        </div>
                      </label>

                      <label onClick={() => setPaymentMethod('Credit / Debit Card')} className={`flex items-start gap-4 border p-5 rounded-sm cursor-pointer transition-all ${paymentMethod === 'Credit / Debit Card' ? 'border-brand-teal bg-brand-powderLight' : 'border-brand-powder'}`}>
                        <input type="radio" name="payment" checked={paymentMethod === 'Credit / Debit Card'} onChange={() => setPaymentMethod('Credit / Debit Card')} className="mt-1 w-4 h-4 text-brand-teal" />
                        <div className="flex-1">
                          <span className="font-sans text-sm font-medium text-brand-navy block">Credit / Debit Card (Visa, Mastercard, RuPay)</span>
                        </div>
                      </label>

                    </div>
                  </div>
                )}

                {/* STEP 4: Review & WhatsApp Redirect Notice */}
                {currentStep === 4 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Review & Place Order</h2>
                    
                    <div className="space-y-6">
                      
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm flex items-start gap-3 text-emerald-900">
                        <MessageSquare size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-sans text-xs font-bold uppercase tracking-wider mb-0.5">WhatsApp Redirect Enabled</p>
                          <p className="font-sans text-[11px] text-emerald-800 leading-relaxed">
                            Clicking <strong>"Place Order on WhatsApp"</strong> below will format your order details and launch a direct chat with Suka Fashions support (+91 98765 43210) for fast confirmation.
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

                      <div className="border border-brand-powder/50 p-5 rounded-sm bg-brand-cream/10">
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-brand-powder/50">
                          <h3 className="font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-navy">Delivery & Payment</h3>
                          <button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] uppercase text-brand-teal hover:underline font-bold">Edit</button>
                        </div>
                        <p className="font-sans text-xs text-brand-navy/80">
                          Delivery: <strong>{deliveryMethod === 'express' ? 'Express Courier (₹250)' : 'Standard Free Shipping'}</strong><br/>
                          Payment: <strong>{paymentMethod}</strong>
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="mt-10 pt-6 border-t border-brand-powder/60 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 hover:text-brand-navy transition-colors font-medium"
                    >
                      Back to {STEPS[currentStep - 2].name}
                    </button>
                  ) : (
                    <Link to="/cart" className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 hover:text-brand-navy transition-colors font-medium">
                      Return to Bag
                    </Link>
                  )}

                  <button 
                    type="submit"
                    className={`px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm shadow-md transition-all flex items-center gap-2.5 ${
                      currentStep === 4 ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg' : 'bg-brand-navy hover:bg-brand-teal text-white'
                    }`}
                  >
                    {currentStep === 4 ? (
                      <>
                        <MessageSquare size={16} /> Place Order on WhatsApp
                      </>
                    ) : (
                      <>
                        Continue <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>

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
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-brand-cream border border-brand-powder/40 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 bg-brand-navy text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-sm text-brand-navy line-clamp-1 mb-1">{item.name}</p>
                      <p className="font-sans text-[10px] text-brand-navy/60 uppercase tracking-wider">Size: {item.size}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-sm font-semibold text-brand-navy">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-brand-powder/60">
                <div className="flex justify-between font-sans text-xs text-brand-navy/70">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-sans text-xs text-brand-navy/70">
                  <span>Delivery Charge</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-sans pt-4 border-t border-brand-powder/60">
                <span className="text-sm uppercase tracking-widest font-semibold text-brand-navy">Total</span>
                <div className="text-right">
                  <span className="text-[10px] text-brand-navy/40 mr-2">INR</span>
                  <span className="text-xl font-bold text-brand-navy">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

