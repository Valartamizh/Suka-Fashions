import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, Zap } from 'lucide-react';
import logo from '../../assets/logo.jpg';

export default function PhoneLoginForm({ onSendOtp }) {
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
      onSendOtp(phone);
    }, 400);
  };

  return (
    <div className="w-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-left">
      
      <div>
        {/* Suka logo header */}
        <div className="flex items-center gap-2.5 mb-6">
          <img src={logo} alt="Suka Fashions Logo" className="w-8 h-8 rounded-full border border-brand-powder shadow-sm" />
          <span className="font-serif font-bold text-brand-navy text-lg tracking-wider">
            Suka <span className="font-sans text-[8px] tracking-[0.28em] text-brand-teal uppercase ml-1">Fashions</span>
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light mb-1.5">
            Welcome to Suka
          </h1>
          <p className="font-sans text-xs text-brand-navy/60 font-light">
            Login or create an account to continue
          </p>
        </div>

        {/* Phone Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-navy mb-2">
              Mobile Number *
            </label>

            {/* Custom +91 prefix input */}
            <div className={`flex items-center border rounded-sm bg-white transition-all ${
              error ? 'border-red-400 ring-1 ring-red-400' : 'border-brand-powder focus-within:border-brand-teal focus-within:ring-1 focus-within:ring-brand-teal'
            }`}>
              <div className="px-3 py-3 border-r border-brand-powder/60 bg-brand-cream/30 text-brand-navy font-sans text-xs font-semibold flex items-center gap-1 select-none">
                <span className="text-brand-navy/70">+91</span>
                <span className="text-brand-navy/30">|</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="98765 43210"
                className="w-full px-3 py-3 font-sans text-sm text-brand-navy placeholder-brand-navy/30 outline-none bg-transparent"
                aria-label="Mobile Number"
              />
            </div>

            {error && (
              <p className="font-sans text-[11px] text-red-500 mt-1.5 font-medium animate-in fade-in">
                {error}
              </p>
            )}

            <p className="font-sans text-[10px] text-brand-navy/50 mt-1.5 tracking-wide">
              We'll send you a one-time password to verify your number.
            </p>
          </div>

          {/* CONTINUE Button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3.5 rounded-sm font-sans text-[10px] font-bold tracking-[0.22em] uppercase transition-all duration-200 shadow-md ${
              !isValid || loading
                ? 'bg-brand-powder/70 text-brand-navy/35 cursor-not-allowed shadow-none'
                : 'bg-brand-teal hover:bg-brand-tealDark text-white hover:shadow-lg active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'CONTINUE'
            )}
          </button>
        </form>

        {/* Terms & Privacy */}
        <p className="font-sans text-[10px] text-brand-navy/40 mt-4 leading-relaxed text-center sm:text-left">
          By continuing, you agree to Suka Fashions'{' '}
          <Link to="/terms" className="text-brand-teal hover:underline font-medium">Terms & Conditions</Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-brand-teal hover:underline font-medium">Privacy Policy</Link>.
        </p>
      </div>

      {/* Customer Benefits */}
      <div className="mt-6 pt-4 border-t border-brand-powder/40 flex items-center justify-between text-[9px] font-sans text-brand-navy/55 uppercase tracking-wider">
        <span className="flex items-center gap-1"><Heart size={11} className="text-brand-teal" /> Save Favourites</span>
        <span className="flex items-center gap-1"><Package size={11} className="text-brand-teal" /> Track Orders</span>
        <span className="flex items-center gap-1"><Zap size={11} className="text-brand-teal" /> Faster Checkout</span>
      </div>

    </div>
  );
}
