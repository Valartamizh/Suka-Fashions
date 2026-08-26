import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, ChevronRight } from 'lucide-react';
import { products } from '../data/products';

const STEPS = [
  { id: 1, name: 'Address' },
  { id: 2, name: 'Delivery' },
  { id: 3, name: 'Payment' },
  { id: 4, name: 'Review' }
];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Mock cart summary
  const subtotal = 9498; // 3499 + 5999
  const shipping = 0;
  const total = subtotal + shipping;

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Final step submit
      navigate('/order-success');
    }
  };

  return (
    <div className="bg-brand-cream/20 min-h-[85vh] pb-16">
      
      {/* Checkout Header (Minimal) */}
      <div className="bg-white border-b border-brand-powder/60 py-4">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 flex justify-between items-center">
          <Link to="/" className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-brand-navy">
            Suka <span className="font-sans text-[9px] tracking-[0.3em] text-brand-teal uppercase ml-1">Fashions</span>
          </Link>
          <div className="flex items-center gap-2 text-brand-navy/60 font-sans text-[10px] uppercase tracking-[0.15em] font-medium">
            <ShieldCheck size={16} /> Secure Checkout
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
              {STEPS.map((step, idx) => (
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
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Shipping Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-2">
                        <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Email Address *</label>
                        <input required type="email" defaultValue="user@example.com" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm" />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">First Name *</label>
                        <input required type="text" defaultValue="Aditi" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm" />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Last Name *</label>
                        <input required type="text" defaultValue="Sharma" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Address *</label>
                        <input required type="text" defaultValue="123 Fashion Street, Apt 4B" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm mb-3" />
                        <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm" />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">City *</label>
                        <input required type="text" defaultValue="Mumbai" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">State *</label>
                          <select className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none rounded-sm bg-white">
                            <option>Maharashtra</option>
                            <option>Delhi</option>
                            <option>Karnataka</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">PIN Code *</label>
                          <input required type="text" defaultValue="400001" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm" />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Phone Number *</label>
                        <input required type="tel" defaultValue="+91 98765 43210" className="w-full border border-brand-powder px-4 py-3 font-sans text-sm text-brand-navy focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all rounded-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Delivery */}
                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Delivery Method</h2>
                    <div className="space-y-4">
                      <label className="flex items-start gap-4 border border-brand-teal bg-brand-powderLight p-5 rounded-sm cursor-pointer">
                        <input type="radio" name="delivery" defaultChecked className="mt-1 w-4 h-4 text-brand-teal border-brand-teal focus:ring-brand-teal" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-sans text-sm font-semibold text-brand-navy">Standard Delivery</span>
                            <span className="font-sans text-xs font-bold text-brand-navy">Free</span>
                          </div>
                          <p className="font-sans text-[11px] text-brand-navy/60">Delivered in 3-5 business days</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-4 border border-brand-powder hover:border-brand-teal p-5 rounded-sm cursor-pointer transition-colors">
                        <input type="radio" name="delivery" className="mt-1 w-4 h-4 text-brand-teal border-brand-powder focus:ring-brand-teal" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-sans text-sm font-medium text-brand-navy">Express Delivery</span>
                            <span className="font-sans text-xs font-bold text-brand-navy">₹250</span>
                          </div>
                          <p className="font-sans text-[11px] text-brand-navy/60">Delivered in 1-2 business days</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 3: Payment */}
                {currentStep === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Payment Options</h2>
                    <div className="space-y-4">
                      <label className="flex items-start gap-4 border border-brand-teal bg-brand-powderLight p-5 rounded-sm cursor-pointer">
                        <input type="radio" name="payment" defaultChecked className="mt-1 w-4 h-4 text-brand-teal border-brand-teal focus:ring-brand-teal" />
                        <div className="flex-1">
                          <span className="font-sans text-sm font-semibold text-brand-navy block mb-3">UPI / Netbanking</span>
                          <div className="bg-white border border-brand-powder/50 p-4 rounded-sm flex items-center justify-center text-brand-navy/40 text-xs">
                            Secure UPI Payment Gateway Mockup
                          </div>
                        </div>
                      </label>
                      <label className="flex items-start gap-4 border border-brand-powder p-5 rounded-sm cursor-pointer opacity-70">
                        <input type="radio" name="payment" className="mt-1 w-4 h-4" />
                        <div className="flex-1">
                          <span className="font-sans text-sm font-medium text-brand-navy block">Credit / Debit Card</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-4 border border-brand-powder p-5 rounded-sm cursor-pointer opacity-70">
                        <input type="radio" name="payment" className="mt-1 w-4 h-4" />
                        <div className="flex-1">
                          <span className="font-sans text-sm font-medium text-brand-navy block mb-1">Cash on Delivery</span>
                          <p className="font-sans text-[10px] text-brand-navy/50">Additional ₹50 handling fee applies.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* STEP 4: Review */}
                {currentStep === 4 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-6">Review Order</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-brand-powder/50 p-5 rounded-sm bg-brand-cream/10">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-powder/50">
                          <h3 className="font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-navy">Shipping To</h3>
                          <button type="button" onClick={() => setCurrentStep(1)} className="text-[10px] uppercase text-brand-teal hover:underline">Edit</button>
                        </div>
                        <p className="font-sans text-xs text-brand-navy/70 leading-relaxed">
                          <span className="font-medium text-brand-navy">Aditi Sharma</span><br/>
                          123 Fashion Street, Apt 4B<br/>
                          Mumbai, Maharashtra 400001<br/>
                          +91 98765 43210
                        </p>
                      </div>

                      <div className="border border-brand-powder/50 p-5 rounded-sm bg-brand-cream/10">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-powder/50">
                          <h3 className="font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-navy">Method</h3>
                          <button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] uppercase text-brand-teal hover:underline">Edit</button>
                        </div>
                        <p className="font-sans text-xs text-brand-navy/70">Standard Delivery (Free)</p>
                      </div>

                      <div className="border border-brand-powder/50 p-5 rounded-sm bg-brand-cream/10">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-powder/50">
                          <h3 className="font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-navy">Payment</h3>
                          <button type="button" onClick={() => setCurrentStep(3)} className="text-[10px] uppercase text-brand-teal hover:underline">Edit</button>
                        </div>
                        <p className="font-sans text-xs text-brand-navy/70">UPI / Netbanking</p>
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
                    className="bg-brand-navy text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal transition-colors rounded-sm shadow-md flex items-center gap-2"
                  >
                    {currentStep === 4 ? 'Place Order' : 'Continue'} 
                    {currentStep !== 4 && <ChevronRight size={14} />}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="lg:w-[45%] xl:w-[40%]">
            <div className="bg-white border border-brand-powder/50 rounded-sm p-6 shadow-sm sticky top-6">
              
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-6 pb-4 border-b border-brand-powder/60">
                Order Summary
              </h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {[products[0], products[1]].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-brand-cream border border-brand-powder/40 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 bg-brand-navy text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-sm text-brand-navy line-clamp-1 mb-1">{item.name}</p>
                      <p className="font-sans text-[10px] text-brand-navy/60 uppercase tracking-wider">Size: Free Size</p>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-sm font-semibold text-brand-navy">₹{item.price.toLocaleString('en-IN')}</span>
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
                  <span>Shipping</span>
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
