import React from 'react';

export default function TermsConditions() {
  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-12 sm:py-16 border-b border-brand-powder/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-2 block">
            Legal & Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy tracking-wide mb-4">
            Terms & Conditions
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/60 max-w-lg mx-auto leading-relaxed">
            Welcome to Suka Fashions. By accessing or purchasing from our storefront, you agree to these Terms of Service.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-brand-navy/80 font-sans text-xs sm:text-sm leading-relaxed space-y-8">
        
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            1. General Agreement
          </h2>
          <p>
            These Terms & Conditions govern your use of the Suka Fashions website, mobile interfaces, and storefront transactions. Suka Fashions reserves the right to modify or update these terms at any time without prior notice.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            2. Handloom Authenticity & Color Variations
          </h2>
          <p>
            Each piece at Suka Fashions is handcrafted using traditional handloom weaving, hand-embroidery, and natural dye processes. Minor variations in weave texture, zari motif alignment, or color shade (+/- 5%) are inherent characteristics of authentic artisanal textiles and shall not be deemed as defects.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            3. Pricing & Taxes
          </h2>
          <p>
            All product prices listed on the domestic store are inclusive of Goods and Services Tax (GST). Prices are subject to change without notice, but confirmed orders will be fulfilled at the price active at the time of order placement.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            4. Intellectual Property Rights
          </h2>
          <p>
            All content on this website—including logo graphics, photographs, saree pattern designs, product descriptions, video lookbooks, and website code—is the exclusive intellectual property of Suka Fashions and is protected under Indian Copyright and Trademark laws.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-3 uppercase tracking-wider pb-2 border-b border-brand-powder/60">
            5. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any legal disputes arising out of storefront transactions shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
          </p>
        </div>

      </section>

    </div>
  );
}
