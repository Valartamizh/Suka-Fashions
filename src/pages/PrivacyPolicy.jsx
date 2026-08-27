import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-12 sm:py-16 border-b border-brand-powder/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-2 block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy tracking-wide mb-4">
            Privacy Policy
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/60 max-w-lg mx-auto leading-relaxed">
            Last Updated: August 27, 2026. Your privacy and personal data protection are paramount to us.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-brand-navy/80 font-sans text-xs sm:text-sm leading-relaxed space-y-8">
        
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            1. Information We Collect
          </h2>
          <p className="mb-3">
            At Suka Fashions, we collect personal information necessary to process your luxury garment orders, deliver products, and personalize your luxury shopping experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-brand-navy/70">
            <li><strong>Contact Details:</strong> Your name, delivery address, phone number, and email address.</li>
            <li><strong>Order & Transaction Data:</strong> Purchased items, measurement preferences, invoice records, and shipping carrier history.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device identifiers, and cookie preference data.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            2. How We Use Your Information
          </h2>
          <p className="mb-3">We strictly use your personal information to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-brand-navy/70">
            <li>Process, pack, tailor, and ship your luxury apparel orders.</li>
            <li>Send real-time SMS and Email tracking updates and invoice receipts.</li>
            <li>Provide customer care support and process hassle-free 7-day returns/refunds.</li>
            <li>Improve website security and prevent fraudulent transactions.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            3. Payment Data Security
          </h2>
          <p>
            We do NOT store or hold your complete credit card numbers, CVVs, or Netbanking passwords. All online payments are handled directly by PCI-DSS compliant, RBI-regulated payment gateway partners (Razorpay and Cashfree) secured with 256-bit SSL encryption.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            4. Third-Party Data Sharing
          </h2>
          <p>
            We never sell, rent, or trade your personal data to third-party advertising brokers. Your delivery address and phone number are shared solely with authorized courier logistics partners (BlueDart, Delhivery, DHL) for order fulfillment.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            5. Cookies Policy
          </h2>
          <p>
            Our website uses session cookies to keep track of your shopping cart items, wishlist preferences, and currency settings. You can manage or disable cookie preferences in your web browser at any time.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            6. Contact Our Privacy Officer
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data deletion, please contact us at <a href="mailto:privacy@sukafashions.com" className="text-brand-teal font-bold hover:underline">privacy@sukafashions.com</a>.
          </p>
        </div>

      </section>

    </div>
  );
}
