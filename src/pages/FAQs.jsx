import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Sparkles, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    category: 'Ordering & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Credit & Debit cards (Visa, Mastercard, RuPay, Amex), Net Banking across 50+ Indian banks, UPI (Google Pay, PhonePe, Paytm, BHIM), and Cash on Delivery (COD) up to ₹10,000.',
  },
  {
    category: 'Ordering & Payment',
    question: 'Is it safe to make online payments on Suka Fashions?',
    answer: 'Yes, absolutely. Our checkout portal is 256-bit SSL encrypted and PCI-DSS compliant. We do not store any card credentials or banking passcodes.',
  },
  {
    category: 'Sizing & Customization',
    question: 'Do you offer blouse stitching and custom fitting?',
    answer: 'Yes! We offer unstitched, semi-stitched, and custom tailor stitching options for saree blouses and lehenga cholis. You can select your preferred neckline, sleeve length, and padding preferences on the product detail page.',
  },
  {
    category: 'Sizing & Customization',
    question: 'How do I select the right size for Kurtis and Dresses?',
    answer: 'We provide bust, waist, hip, and length measurements in both inches and centimeters for our products. If you are between sizes, we recommend opting for the larger size.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'How long will it take to receive my order?',
    answer: 'Standard domestic orders are dispatched within 24 to 48 hours and delivered in 4 to 7 business days. Express shipping delivers in 2 to 3 days. Custom stitched garments require an extra 3 to 5 business days.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'Do you ship internationally?',
    answer: 'Yes, we deliver worldwide to over 50 countries via DHL Express and FedEx International. Transit time is usually 6 to 10 business days.',
  },
  {
    category: 'Returns & Refunds',
    question: 'What is your return policy?',
    answer: 'We offer a 7-day hassle-free return and exchange policy from the date of delivery. Returned garments must be unworn with original brand tags intact.',
  },
  {
    category: 'Returns & Refunds',
    question: 'How do I request a return or exchange?',
    answer: 'Log in to your Suka Fashions account, go to "My Orders", click "Request Return/Exchange", select your reason, and confirm doorstep pickup. Alternatively, email care@sukafashions.com.',
  },
  {
    category: 'Fabric Care',
    question: 'How should I care for my silk sarees and organza garments?',
    answer: 'We strongly recommend professional Dry Cleaning for all pure silk, Kanchipuram, Banarasi, organza, and heavily embroidered pieces. Store them wrapped in a soft white cotton cloth or muslin bag in a cool, dry place.',
  },
];

export default function FAQs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  const categories = ['All', 'Ordering & Payment', 'Sizing & Customization', 'Shipping & Delivery', 'Returns & Refunds', 'Fabric Care'];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-white text-left">
      
      {/* Header */}
      <section className="bg-brand-cream/60 py-12 sm:py-16 border-b border-brand-powder/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-2 block">
            Help & Knowledge Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-brand-navy tracking-wide mb-6">
            Frequently Asked Questions
          </h1>

          {/* Live Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. shipping, returns, silk care)..."
              className="w-full pl-12 pr-4 py-3.5 border border-brand-powder rounded-sm text-xs font-sans shadow-2xs focus:outline-none focus:border-brand-teal bg-white"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/40" />
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="py-12 sm:py-20 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-10 border-b border-brand-powder/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-2 text-xs font-sans uppercase tracking-wider font-semibold rounded-sm whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-navy text-white shadow-2xs'
                  : 'bg-brand-cream/40 text-brand-navy/70 border border-brand-powder hover:text-brand-teal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-brand-cream/30 border border-brand-powder/40 rounded-sm">
            <HelpCircle size={32} className="mx-auto text-brand-navy/30 mb-3" />
            <p className="font-serif text-xl text-brand-navy mb-1">No matching questions found.</p>
            <p className="font-sans text-xs text-brand-navy/50 mb-4">Try searching with a different keyword or category.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-xs font-sans text-brand-teal font-bold uppercase tracking-wider underline"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-brand-powder/70 rounded-sm bg-white overflow-hidden shadow-2xs transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-serif text-base sm:text-lg text-brand-navy hover:text-brand-teal transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="ml-4 text-brand-teal flex-shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-brand-powder/40 font-sans text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-light bg-brand-cream/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions Box */}
        <div className="mt-16 p-8 bg-brand-navy text-white rounded-sm text-center space-y-4">
          <MessageCircle size={32} className="mx-auto text-brand-powder" />
          <h3 className="font-serif text-2xl">Still Have Questions?</h3>
          <p className="font-sans text-xs text-brand-powder/70 max-w-md mx-auto leading-relaxed">
            Can't find the answer you're looking for? Please reach out to our dedicated support concierges.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-block bg-brand-teal hover:bg-brand-tealDark text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm shadow-md transition-colors"
            >
              Contact Customer Care
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
