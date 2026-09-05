import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const InstagramIcon = ({ className = "w-4 h-4 fill-current" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const supportPhone = settings?.store?.supportPhone || '+91 98765 43210';
  const supportEmail = settings?.store?.supportEmail || 'care@sukafashions.com';
  const storeAddress = settings?.store?.address || '42, Commercial Street, Bengaluru, Karnataka 560001';

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full Name is required (minimum 2 characters)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    const rawDigits = (formData.phone || '').replace(/\D/g, '');
    const phoneDigits = rawDigits.slice(-10);
    if (!phoneDigits || phoneDigits.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' });
      setErrors({});
    }, 4000);
  };

  return (
    <div className="w-full bg-white text-left">
      
      {/* Hero Header */}
      <section className="bg-brand-cream/60 py-4 sm:py-6 lg:py-8 border-b border-brand-powder/60">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-brand-teal font-bold mb-1 sm:mb-1.5 block">
            We'd Love To Hear From You
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-serif text-brand-navy tracking-wide mb-1.5 sm:mb-3">
            Contact Customer Care
          </h1>
          <p className="font-sans text-xs sm:text-sm text-brand-navy/60 max-w-xl mx-auto leading-relaxed">
            Have questions about your order, custom fitting, or bridal styling? Our dedicated support team is here to assist you.
          </p>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="py-3 sm:py-6 lg:py-8 w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10">
          
          {/* Contact Details & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-8">
            <div>
              <h2 className="font-serif text-lg sm:text-2xl text-brand-navy mb-1.5 sm:mb-3 uppercase tracking-wider">Get In Touch</h2>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light">
                Reach out to us via phone, email, WhatsApp, or Instagram. We aim to respond to all inquiries within 2 to 4 business hours.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 bg-brand-cream/30 p-4 sm:p-6 rounded-sm border border-brand-powder/60">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-powderLight text-brand-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-brand-navy mb-0.5">Call Us Direct</h3>
                  <a href={`tel:${supportPhone.replace(/\s+/g, '')}`} className="font-sans text-sm font-semibold text-brand-teal hover:underline">{supportPhone}</a>
                  <p className="font-sans text-[11px] text-brand-navy/50">Direct Support for Orders & Assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-powderLight text-brand-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-brand-navy mb-0.5">Email Support</h3>
                  <a href={`mailto:${supportEmail}`} className="font-sans text-sm font-semibold text-brand-teal hover:underline">{supportEmail}</a>
                  <p className="font-sans text-[11px] text-brand-navy/50">For order updates & custom bridal queries</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <InstagramIcon className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-brand-navy mb-0.5">Instagram DM</h3>
                  <a href="https://instagram.com/sukafashions" target="_blank" rel="noopener noreferrer" className="font-sans text-sm font-semibold text-brand-teal hover:underline">
                    @sukafashions
                  </a>
                  <p className="font-sans text-[11px] text-brand-navy/50">Follow us for daily drops & DM support</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-powderLight text-brand-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-brand-navy mb-0.5">Operating Hours</h3>
                  <p className="font-sans text-xs text-brand-navy/70">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
                  <p className="font-sans text-[11px] text-brand-navy/50">Sunday: Closed (Online Orders Active 24/7)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-powderLight text-brand-teal flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-brand-navy mb-0.5">Flagship Store & HQ</h3>
                  <p className="font-sans text-xs text-brand-navy/70 leading-relaxed">
                    {storeAddress}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action Boxes */}
            <div className="space-y-3">
              
              {/* WhatsApp Quick Chat Box */}
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-emerald-950 flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-600" /> WhatsApp Stylist
                  </h4>
                  <p className="font-sans text-[11px] text-emerald-800">Chat live with our fashion concierge.</p>
                </div>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-[10px] uppercase font-bold tracking-wider rounded-sm shadow-xs transition-colors whitespace-nowrap"
                >
                  Chat Now
                </a>
              </div>

              {/* Instagram Quick DM Box */}
              <div className="p-5 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border border-pink-200 rounded-sm flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-pink-950 flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4 text-pink-600 fill-current" /> Instagram DM
                  </h4>
                  <p className="font-sans text-[11px] text-pink-800">DM us for quick styling tips & order updates.</p>
                </div>
                <a
                  href="https://instagram.com/sukafashions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-sans text-[10px] uppercase font-bold tracking-wider rounded-sm shadow-xs transition-all whitespace-nowrap"
                >
                  DM @sukafashions
                </a>
              </div>

            </div>

          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-8 lg:p-10 rounded-sm border border-brand-powder/70 shadow-2xs">
            <h2 className="font-serif text-lg sm:text-2xl text-brand-navy mb-1.5 sm:mb-2 uppercase tracking-wider">Send Us A Message</h2>
            <p className="font-sans text-xs text-brand-navy/60 mb-4 sm:mb-8">Fill out the form below and our customer care executive will connect with you.</p>

            {submitted ? (
              <div className="p-6 sm:p-8 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-3 animate-in fade-in">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h3 className="font-serif text-lg sm:text-xl text-emerald-950">Thank You For Reaching Out!</h3>
                <p className="font-sans text-xs text-emerald-800 max-w-md mx-auto">
                  Your message has been received successfully. A member of our team will contact you shortly via email or phone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-2">Your Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full px-4 py-3 border rounded-sm text-xs font-sans focus:outline-none focus:border-brand-teal transition-colors ${
                        errors.name ? 'border-red-500' : 'border-brand-powder'
                      }`}
                    />
                    {errors.name && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="priya@example.com"
                      className={`w-full px-4 py-3 border rounded-sm text-xs font-sans focus:outline-none focus:border-brand-teal transition-colors ${
                        errors.email ? 'border-red-500' : 'border-brand-powder'
                      }`}
                    />
                    {errors.email && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-2">Phone / Mobile Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+91 98765 00000"
                      className={`w-full px-4 py-3 border rounded-sm text-xs font-sans focus:outline-none focus:border-brand-teal transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-brand-powder'
                      }`}
                    />
                    {errors.phone && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-2">Subject Category</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-brand-powder rounded-sm text-xs font-sans bg-white focus:outline-none focus:border-brand-teal transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Status & Tracking</option>
                      <option value="custom">Custom Stitching & Bridal Styling</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="wholesale">Wholesale & Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-1.5 sm:mb-2">Your Message *</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: '' });
                    }}
                    placeholder="Tell us how we can help you..."
                    className={`w-full px-4 py-2.5 sm:py-3 border rounded-sm text-xs font-sans focus:outline-none focus:border-brand-teal transition-colors ${
                      errors.message ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {errors.message && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-brand-teal hover:bg-brand-tealDark text-white px-8 py-3 font-sans text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={13} /> Send Message
                </button>

              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
