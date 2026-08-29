import React from 'react';
import { Truck, Clock, ShieldCheck, Globe, PackageCheck, AlertCircle } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-6 sm:py-8 border-b border-brand-powder/60">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-1.5 block">
            Customer Information
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif text-brand-navy tracking-wide mb-2 sm:mb-3">
            Shipping & Delivery Policy
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/60 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our fast, insured domestic and international shipping services.
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-10 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-10">
        
        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-brand-cream/30 p-6 rounded-sm border border-brand-powder/60 text-center">
            <Truck size={24} className="text-brand-teal mx-auto mb-3" />
            <h3 className="font-serif text-base text-brand-navy mb-1">Free Shipping</h3>
            <p className="font-sans text-xs text-brand-navy/60">On all prepaid domestic orders above ₹1,999</p>
          </div>
          <div className="bg-brand-cream/30 p-6 rounded-sm border border-brand-powder/60 text-center">
            <Clock size={24} className="text-brand-teal mx-auto mb-3" />
            <h3 className="font-serif text-base text-brand-navy mb-1">Fast Dispatch</h3>
            <p className="font-sans text-xs text-brand-navy/60">Orders dispatched within 24–48 business hours</p>
          </div>
          <div className="bg-brand-cream/30 p-6 rounded-sm border border-brand-powder/60 text-center">
            <Globe size={24} className="text-brand-teal mx-auto mb-3" />
            <h3 className="font-serif text-base text-brand-navy mb-1">Worldwide Shipping</h3>
            <p className="font-sans text-xs text-brand-navy/60">Delivering to 50+ countries via DHL & FedEx</p>
          </div>
        </div>

        {/* Detailed Shipping Breakdown */}
        <div className="space-y-8 text-brand-navy/80 font-sans text-xs sm:text-sm leading-relaxed">
          
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
              1. Domestic Shipping (India)
            </h2>
            <p className="mb-3">
              We offer reliable and insured shipping across all pin codes in India through our premier courier partners (BlueDart, Delhivery, DTDC, and Ecom Express).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brand-navy/70">
              <li><strong>Standard Delivery:</strong> Delivered within 4 to 7 business days from dispatch date.</li>
              <li><strong>Express Delivery:</strong> Available for select metro cities (Delivered within 2 to 3 business days).</li>
              <li><strong>Free Shipping:</strong> Applicable on prepaid orders exceeding ₹1,999. A nominal delivery fee of ₹99 applies on orders below ₹1,999.</li>
              <li><strong>Cash on Delivery (COD):</strong> COD is available for orders up to ₹10,000. A handling charge of ₹99 applies to all COD orders.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
              2. Custom Stitching & Made-to-Order Dispatch
            </h2>
            <p className="mb-3">
              If your order includes custom blouse stitching, fall & picot finishing, or customized lehenga sizing, please allow an additional <strong>3 to 5 business days</strong> for master tailors to craft your garment to perfection before dispatch.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
              3. International Shipping
            </h2>
            <p className="mb-3">
              Suka Fashions ships worldwide including the USA, UK, UAE, Canada, Australia, Singapore, and Europe.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brand-navy/70">
              <li><strong>Transit Time:</strong> Delivered within 6 to 10 business days via DHL Express or FedEx International.</li>
              <li><strong>Shipping Charges:</strong> Calculated dynamically at checkout based on package weight and destination country.</li>
              <li><strong>Customs & Import Duties:</strong> Any customs duties, import taxes, or local VAT levied by the destination country's customs authority are the sole responsibility of the customer.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
              4. Order Tracking & Notifications
            </h2>
            <p>
              Once your package is packed and handed over to our courier partner, you will instantly receive an SMS and Email notification containing your <strong>Tracking ID (AWB)</strong> and live tracking link. You can also track your shipment live on our <a href="/track-order" className="text-brand-teal font-bold hover:underline">Track Order Page</a>.
            </p>
          </div>

          <div className="p-5 bg-amber-50 border border-amber-200 rounded-sm flex items-start gap-3 text-amber-900">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider mb-1">Tamper-Proof Packaging Assurance</p>
              <p className="text-xs">
                All Suka Fashions orders are shipped in sealed tamper-evident luxury boxes. If your package appears opened, torn, or damaged at the time of delivery, please refuse delivery and immediately contact Customer Care at +91 98765 43210.
              </p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
