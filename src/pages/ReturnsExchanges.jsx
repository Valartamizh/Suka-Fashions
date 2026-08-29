import React from 'react';
import { RefreshCw, CheckCircle, ShieldAlert, ArrowLeftRight, CreditCard, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReturnsExchanges() {
  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-6 sm:py-8 border-b border-brand-powder/60">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-1.5 block">
            Hassle-Free Guarantee
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif text-brand-navy tracking-wide mb-2 sm:mb-3">
            Returns & Exchanges Policy
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/60 max-w-xl mx-auto leading-relaxed">
            Your complete satisfaction is our priority. Enjoy 7-day easy returns and seamless exchange pickups.
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-10 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-10">
        
        {/* Step Guide Grid */}
        <div>
          <h2 className="font-serif text-2xl text-brand-navy text-center mb-8 uppercase tracking-wider">How Returns & Exchanges Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-sm border border-brand-powder/70 shadow-2xs text-center">
              <div className="w-10 h-10 rounded-full bg-brand-powderLight text-brand-teal font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-serif text-base text-brand-navy mb-2">Initiate Request</h3>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed">
                Log into your Account or contact Customer Care within 7 days of delivery to submit a return or exchange request.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-brand-powder/70 shadow-2xs text-center">
              <div className="w-10 h-10 rounded-full bg-brand-powderLight text-brand-teal font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-serif text-base text-brand-navy mb-2">Doorstep Pickup</h3>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed">
                Our courier executive will pick up the package directly from your doorstep within 24 to 48 hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-brand-powder/70 shadow-2xs text-center">
              <div className="w-10 h-10 rounded-full bg-brand-powderLight text-brand-teal font-serif font-bold text-lg flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-serif text-base text-brand-navy mb-2">Instant Refund / Exchange</h3>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed">
                Once quality-checked, your replacement item will be dispatched or refund credited to your original payment mode.
              </p>
            </div>

          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-brand-navy/80 font-sans text-xs sm:text-sm leading-relaxed">
          
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
              1. Return & Exchange Eligibility
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-brand-navy/70">
              <li>Items must be returned within <strong>7 days</strong> of delivery date.</li>
              <li>Garments must be unused, unwashed, unworn, and free from perfume, makeup, or stains.</li>
              <li>Original security tags, brand labels, and protective packaging must remain attached and intact.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
              2. Non-Returnable Items
            </h2>
            <p className="mb-3">
              To maintain strict quality and hygiene standards, the following categories are strictly non-returnable:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brand-navy/70">
              <li>Custom-stitched blouses, tailored sarees with fall & picot attached, or altered lehengas.</li>
              <li>Items purchased during Mega Clearance Sale (discounted at 50% or above).</li>
              <li>Inner slips, shapewear, or intimate accessories.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
              3. Refund Options & Timelines
            </h2>
            <p className="mb-3">
              Upon receiving your returned package at our quality control warehouse, refunds are processed within <strong>2 to 4 business days</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brand-navy/70">
              <li><strong>Prepaid Orders (Card / Netbanking / UPI):</strong> Refund credited back directly to the original bank account or card.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> Refund issued via instant Store Credit Voucher or NEFT bank transfer upon sharing bank account details.</li>
            </ul>
          </div>

          {/* Quick Action Box */}
          <div className="p-8 bg-brand-cream/50 border border-brand-powder rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl text-brand-navy mb-1">Need To Initiate A Return?</h3>
              <p className="font-sans text-xs text-brand-navy/60">Log in to your account or get in touch with our concierge team.</p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/account/orders"
                className="px-6 py-3 bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[10px] uppercase font-bold tracking-widest rounded-sm shadow-md transition-colors"
              >
                Go To My Orders
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-sans text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
