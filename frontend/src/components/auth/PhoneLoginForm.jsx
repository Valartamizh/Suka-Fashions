import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, Zap } from 'lucide-react';
import logo from '../../assets/logo.jpg';

export default function PhoneLoginForm({ onSendOtp, onSwitchToRegister }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Digits only
    if (value.length <= 10) {
      setPhone(value);
      if (error) setError('');
    }
  };

  const isValid = phone.length === 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    // Simulate short network delay
    setTimeout(() => {
      setLoading(false);
      onSendOtp({ phone });
    }, 400);
  };

  return (
    <div className="w-full h-full min-h-0 sm:min-h-[560px] lg:min-h-[640px] flex flex-col justify-between p-4 sm:p-10 lg:p-12 text-left self-stretch">

      <div>
        {/* Prominent Brand Logo Header (Desktop only - Mobile has clean top navigation branding) */}
        <div className="hidden sm:flex flex-col items-start text-left mb-8">
          <Link to="/" className="group flex flex-row items-center gap-4 mb-4">
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 border-2 border-brand-teal/30 shadow-md group-hover:border-brand-teal transition-all bg-white flex items-center justify-center">
              <img
                src={logo}
                alt="Suka Fashions Brand Logo"
                className="w-full h-full object-cover rounded-full shadow-inner"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-light text-2xl sm:text-3xl text-brand-navy tracking-wider">
                Suka <span className="font-semibold text-brand-teal">Fashions</span>
              </span>
              <span className="font-sans text-[9px] tracking-[0.35em] text-brand-navy/50 font-bold uppercase mt-1">
                LUXURY ETHNIC WEAR
              </span>
            </div>
          </Link>

          <div className="w-12 h-0.5 bg-gradient-to-r from-brand-teal to-brand-powder rounded-full my-2" />
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-4 sm:mb-7">
          <span className="font-sans text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-extrabold text-brand-teal bg-brand-teal/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full inline-block mb-1.5 sm:mb-2">
            ✦ QUICK STOREFRONT ACCESS ✦
          </span>
          <h1 className="font-serif text-xl sm:text-3xl text-brand-navy font-light mb-1">
            Welcome to Suka
          </h1>
          <p className="font-sans text-[11.5px] sm:text-xs text-brand-navy/60 font-light">
            Enter your mobile number to sign in or create a new account
          </p>
        </div>

        {/* Phone Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
          <div>
            <label className="block font-sans text-[9.5px] sm:text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-1.5 sm:mb-2">
              Mobile Number *
            </label>

            {/* Custom +91 prefix input */}
            <div className={`flex items-center border rounded-md bg-white transition-all shadow-xs ${error ? 'border-red-400 ring-2 ring-red-400/20' : 'border-brand-powder/80 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20'
              }`}>
              <div className="px-3.5 py-2.5 sm:px-4 sm:py-3.5 border-r border-brand-powder/60 bg-brand-cream/40 text-brand-navy font-sans text-sm font-semibold flex items-center gap-1.5 select-none rounded-l-md">
                <span className="text-brand-navy font-bold">+91</span>
                <span className="text-brand-navy/20">|</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3.5 font-sans text-sm text-brand-navy placeholder-brand-navy/35 outline-none bg-transparent font-medium tracking-wider"
                aria-label="Mobile Number"
              />
            </div>

            {error && (
              <p className="font-sans text-[10.5px] sm:text-[11px] text-red-500 mt-1.5 font-medium animate-in fade-in flex items-center gap-1">
                ⚠️ {error}
              </p>
            )}

            <p className="font-sans text-[10px] sm:text-[10.5px] text-brand-navy/55 mt-1.5 sm:mt-2 tracking-wide font-light">
              We'll send a 6-digit OTP via SMS to verify your mobile number.
            </p>
          </div>

          {/* CONTINUE Button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3 sm:py-4 rounded-md font-sans text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition-all duration-300 shadow-md ${!isValid || loading
                ? 'bg-brand-powder/70 text-brand-navy/35 cursor-not-allowed shadow-none'
                : 'bg-brand-teal hover:bg-brand-tealDark text-white hover:shadow-xl active:scale-[0.99] shadow-brand-teal/20'
              }`}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'CONTINUE TO LOGIN →'
            )}
          </button>
        </form>

        {/* Register Prompt for New Users */}
        <div className="mt-3.5 pt-3 sm:mt-5 sm:pt-4 border-t border-brand-powder/40 text-center sm:text-left">
          <p className="font-sans text-[11.5px] sm:text-xs text-brand-navy/60">
            New customer at Suka Fashions?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-brand-teal hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Terms & Privacy */}
        <p className="font-sans text-[9.5px] sm:text-[10px] text-brand-navy/45 mt-2.5 sm:mt-4 leading-relaxed text-center sm:text-left">
          By continuing, you agree to Suka Fashions'{' '}
          <Link to="/terms" className="text-brand-teal hover:underline font-semibold">Terms</Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-brand-teal hover:underline font-semibold">Privacy Policy</Link>.
        </p>
      </div>

      {/* Customer Benefits */}
      <div className="mt-4 pt-3 sm:mt-8 sm:pt-5 border-t border-brand-powder/50 flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[8.5px] sm:text-[9.5px] font-sans text-brand-navy/70 font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1 bg-brand-powderLight/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full"><Heart size={11} className="text-brand-teal" /> Save Favorites</span>
        <span className="flex items-center gap-1 bg-brand-powderLight/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full"><Package size={11} className="text-brand-teal" /> Track Orders</span>
        <span className="flex items-center gap-1 bg-brand-powderLight/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full"><Zap size={11} className="text-brand-teal" /> Express Checkout</span>
      </div>

    </div>
  );
}
