import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

export default function OrderSuccess() {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Generate random order ID
  const orderId = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);

  return (
    <div className="bg-brand-cream/20 min-h-[80vh] flex items-center py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="bg-white border border-brand-powder/60 rounded-sm shadow-sm p-8 sm:p-12 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-powderLight rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mb-6 border border-brand-teal/20">
              <CheckCircle size={40} strokeWidth={1.5} className="text-brand-teal" />
            </div>

            <p className="font-sans text-[10px] uppercase tracking-[0.25em] font-semibold text-brand-teal mb-3">
              Thank You For Your Purchase
            </p>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-brand-navy mb-6">
              Order Confirmed
            </h1>
            
            <p className="font-sans text-sm text-brand-navy/60 max-w-md mx-auto leading-relaxed mb-8">
              We've received your order and are getting it ready to be shipped. We will send you an email with tracking information once your package ships.
            </p>

            {/* Order Details Card */}
            <div className="w-full max-w-sm bg-brand-cream/30 border border-brand-powder/50 p-6 rounded-sm mb-10 text-left">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-brand-powder/60">
                <span className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60">Order Number</span>
                <span className="font-sans text-xs font-bold text-brand-navy">{orderId}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border border-brand-powder rounded-sm flex items-center justify-center text-brand-navy/40">
                  <Package size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 block mb-0.5">Estimated Delivery</span>
                  <span className="font-sans text-xs font-semibold text-brand-navy">Aug 28 - Aug 30, 2026</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/account/orders"
                className="flex items-center justify-center gap-2 bg-white border border-brand-powder px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy hover:text-brand-teal hover:border-brand-teal transition-all rounded-sm shadow-sm"
              >
                View Order Details
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-brand-navy text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal transition-all rounded-sm shadow-md"
              >
                <Home size={14} /> Back to Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
