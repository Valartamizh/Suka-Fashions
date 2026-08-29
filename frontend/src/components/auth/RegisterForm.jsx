import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, Zap, User, Mail, Phone as PhoneIcon } from 'lucide-react';
import logo from '../../assets/logo.jpg';

export default function RegisterForm({ onSendOtp, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preference: 'Sarees',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full Name is required (minimum 2 letters)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (formData.phone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSendOtp({
        phone: formData.phone,
        name: formData.name.trim(),
        email: formData.email.trim(),
        preference: formData.preference,
        isNewUser: true,
      });
    }, 400);
  };

  return (
    <div className="w-full h-full min-h-[560px] lg:min-h-[640px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-left self-stretch">
      <div>
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6">
          <Link to="/" className="group flex flex-col sm:flex-row items-center gap-4 mb-2">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 border-2 border-brand-teal/30 shadow-md group-hover:border-brand-teal transition-all bg-white flex items-center justify-center">
              <img
                src={logo}
                alt="Suka Fashions Logo"
                className="w-full h-full object-cover rounded-full shadow-inner"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-light text-xl sm:text-2xl text-brand-navy tracking-wider">
                Suka <span className="font-semibold text-brand-teal">Fashions</span>
              </span>
              <span className="font-sans text-[8.5px] tracking-[0.35em] text-brand-navy/50 font-bold uppercase mt-0.5">
                LUXURY ETHNIC WEAR
              </span>
            </div>
          </Link>
          <div className="w-12 h-0.5 bg-gradient-to-r from-brand-teal to-brand-powder rounded-full my-1 hidden sm:block" />
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-6">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] font-extrabold text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full inline-block mb-2">
            NEW CUSTOMER REGISTRATION
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light mb-1">
            Create Your Account
          </h1>
          <p className="font-sans text-xs text-brand-navy/60 font-light">
            Register to enjoy personalized styling, wishlist sync, & exclusive member privileges.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-1.5">
              Full Name *
            </label>
            <div className={`flex items-center border rounded-md bg-white transition-all ${errors.name ? 'border-red-400 ring-2 ring-red-400/20' : 'border-brand-powder/80 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20'
              }`}>
              <div className="pl-3 text-brand-navy/40">
                <User size={16} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Pooja Sharma"
                className="w-full px-3 py-3 font-sans text-sm text-brand-navy placeholder-brand-navy/35 outline-none bg-transparent font-medium"
              />
            </div>
            {errors.name && (
              <p className="font-sans text-[10.5px] text-red-500 mt-1 font-semibold">⚠️ {errors.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-1.5">
              Email Address *
            </label>
            <div className={`flex items-center border rounded-md bg-white transition-all ${errors.email ? 'border-red-400 ring-2 ring-red-400/20' : 'border-brand-powder/80 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20'
              }`}>
              <div className="pl-3 text-brand-navy/40">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="pooja@example.com"
                className="w-full px-3 py-3 font-sans text-sm text-brand-navy placeholder-brand-navy/35 outline-none bg-transparent font-medium"
              />
            </div>
            {errors.email && (
              <p className="font-sans text-[10.5px] text-red-500 mt-1 font-semibold">⚠️ {errors.email}</p>
            )}
          </div>

          {/* Mobile Number (+91) */}
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-1.5">
              Mobile Number *
            </label>
            <div className={`flex items-center border rounded-md bg-white transition-all ${errors.phone ? 'border-red-400 ring-2 ring-red-400/20' : 'border-brand-powder/80 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20'
              }`}>
              <div className="px-3.5 py-3 border-r border-brand-powder/60 bg-brand-cream/40 text-brand-navy font-sans text-xs font-bold flex items-center gap-1 select-none rounded-l-md">
                <span>+91</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-3 py-3 font-sans text-sm text-brand-navy placeholder-brand-navy/35 outline-none bg-transparent font-medium tracking-wider"
              />
            </div>
            {errors.phone && (
              <p className="font-sans text-[10.5px] text-red-500 mt-1 font-semibold">⚠️ {errors.phone}</p>
            )}
          </div>

          {/* Preferred Wear */}
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-1.5">
              Favorite Ethnic Category (Optional)
            </label>
            <select
              value={formData.preference}
              onChange={(e) => setFormData({ ...formData, preference: e.target.value })}
              className="w-full px-3 py-2.5 border border-brand-powder/80 rounded-md font-sans text-xs text-brand-navy bg-white outline-none focus:border-brand-teal"
            >
              <option value="Sarees">Silk & Designer Sarees</option>
              <option value="Kurtis">Kurti Sets & Anarkalis</option>
              <option value="Lehengas">Bridal & Partywear Lehengas</option>
              <option value="Dresses">Indo-Western & Ethnic Dresses</option>
            </select>
          </div>

          {/* REGISTER & SEND OTP Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-md bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.99] shadow-brand-teal/20 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'REGISTER & VERIFY OTP →'
            )}
          </button>
        </form>

        {/* Switch to Sign In */}
        <div className="mt-5 text-center sm:text-left">
          <p className="font-sans text-xs text-brand-navy/60">
            Already registered?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-bold text-brand-teal hover:underline cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </p>
        </div>
      </div>

      {/* Customer Benefits */}
      <div className="mt-6 pt-4 border-t border-brand-powder/50 flex flex-wrap items-center justify-between gap-2 text-[9.5px] font-sans text-brand-navy/70 font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1.5 bg-brand-powderLight/60 px-2.5 py-1 rounded-full"><Heart size={12} className="text-brand-teal" /> Save Favorites</span>
        <span className="flex items-center gap-1.5 bg-brand-powderLight/60 px-2.5 py-1 rounded-full"><Package size={12} className="text-brand-teal" /> Live Orders</span>
        <span className="flex items-center gap-1.5 bg-brand-powderLight/60 px-2.5 py-1 rounded-full"><Zap size={12} className="text-brand-teal" /> Member Perks</span>
      </div>
    </div>
  );
}
