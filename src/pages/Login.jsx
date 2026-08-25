import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake login
    navigate('/account');
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 py-12 bg-white relative">
        
        {/* Mobile Logo (Absolute Top) */}
        <Link to="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full border border-brand-powder" />
          <span className="font-serif font-bold text-brand-navy">Suka</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-navy mb-3">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="font-sans text-sm text-brand-navy/60 font-light">
              {isLogin 
                ? 'Sign in to access your orders, wishlist, and exclusive offers.' 
                : 'Join Suka Fashions to experience premium ethnic wear.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">First Name</label>
                  <input required type="text" className="w-full border-b-2 border-brand-powder/60 bg-brand-cream/20 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-colors" />
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Last Name</label>
                  <input required type="text" className="w-full border-b-2 border-brand-powder/60 bg-brand-cream/20 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-colors" />
                </div>
              </div>
            )}

            <div>
              <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Email Address *</label>
              <input required type="email" className="w-full border-b-2 border-brand-powder/60 bg-brand-cream/20 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-colors" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70">Password *</label>
                {isLogin && (
                  <button type="button" className="font-sans text-[10px] uppercase tracking-wider text-brand-teal hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>
              <input required type="password" minLength={6} className="w-full border-b-2 border-brand-powder/60 bg-brand-cream/20 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none transition-colors" />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-brand-navy hover:bg-brand-teal text-white py-4 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold transition-all shadow-md rounded-sm"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>

          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-powder/60"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-sans">
              <span className="px-4 bg-white text-brand-navy/40">OR</span>
            </div>
          </div>

          {/* Toggle */}
          <div className="text-center font-sans text-sm text-brand-navy/70">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-brand-teal hover:underline ml-1"
            >
              {isLogin ? 'Register Here' : 'Sign In'}
            </button>
          </div>

          <p className="mt-12 text-center font-sans text-[9px] uppercase tracking-widest text-brand-navy/30">
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </p>

        </div>
      </div>

      {/* Right: Editorial Image (Desktop Only) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-brand-cream overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=1200&auto=format&fit=crop" 
          alt="Suka Fashions Editorial" 
          className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
        
        {/* Overlay Content */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <Link to="/" className="inline-block mb-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-12 h-12 rounded-full border border-white/30" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl tracking-wider">Suka</span>
                <span className="font-sans text-[8px] tracking-[0.3em] uppercase">Fashions</span>
              </div>
            </div>
          </Link>
          <p className="font-serif text-3xl max-w-md font-light leading-snug">
            "Elegance is not standing out, but being remembered."
          </p>
        </div>
      </div>

    </div>
  );
}
