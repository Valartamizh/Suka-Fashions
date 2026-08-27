// AdminLogin page — /admin/login (Luxury Light Theme Portal)
import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import logo from '../../assets/logo.jpg';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState('aditi@sukafashions.com');
  const [password, setPassword] = useState('admin123');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password, remember);
    setLoading(false);
    if (result.success) {
      navigate('/admin');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-cream/40 via-white to-brand-powderLight/30 flex items-center justify-center p-4 sm:p-6 lg:p-10 select-none relative overflow-hidden text-center">

      {/* Background Soft Glow Accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-powder/50 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Luxury Portal Glass Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur-xl border border-brand-powder/80 rounded-3xl p-8 sm:p-12 shadow-[0_24px_70px_-15px_rgba(0,107,112,0.12)] text-left">

        {/* Top Header with BIG Centerpiece Logo Crest */}
        <div className="flex flex-col items-center text-center mb-8">

          {/* BIG Circular Brand Logo */}
          <div className="relative mb-5 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 border-2 border-brand-teal/40 shadow-xl bg-white flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:border-brand-teal">
              <img
                src={logo}
                alt="Suka Fashions Brand Logo"
                className="w-full h-full object-cover rounded-full shadow-inner"
              />
            </div>
            {/* Live Online Badge Indicator */}
            <span className="absolute bottom-1 right-2 bg-brand-teal text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm border-2 border-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> ADMIN
            </span>
          </div>

          <span className="font-sans text-[9px] tracking-[0.35em] text-brand-teal font-extrabold uppercase bg-brand-powderLight/80 border border-brand-powder/60 px-4 py-1.5 rounded-full mb-3 shadow-2xs inline-flex items-center gap-1.5">
            <Sparkles size={11} className="text-brand-teal" /> SUKA FASHIONS PRIVILEGE PORTAL
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-brand-navy font-light tracking-wide mb-1">
            Storefront Administration
          </h1>

          <p className="font-sans text-xs text-brand-navy/60 font-light tracking-wide max-w-xs">
            Sign in with your administrative account to access operations & dashboard controls
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-xs font-sans text-red-700 font-medium animate-in fade-in">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Executive Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Field */}
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-extrabold text-brand-navy/90 mb-2">
              Administrator Email *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/40">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sukafashions.com"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-brand-cream/15 border border-brand-powder/80 rounded-xl text-xs font-sans text-brand-navy placeholder-brand-navy/35 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.2em] font-extrabold text-brand-navy/90 mb-2">
              Security Password *
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/40">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full pl-11 pr-11 py-3.5 bg-brand-cream/15 border border-brand-powder/80 rounded-xl text-xs font-sans text-brand-navy placeholder-brand-navy/35 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand-navy p-1 transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Keep Signed In & Reset */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-brand-navy/70 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-brand-powder text-brand-teal accent-brand-teal cursor-pointer"
              />
              <span>Keep me signed in</span>
            </label>
            <span className="font-sans text-[11px] text-brand-teal font-semibold hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Luxury Teal Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-teal hover:bg-brand-tealDark disabled:opacity-70 text-white font-sans font-extrabold text-[11px] tracking-[0.2em] uppercase py-4 rounded-xl transition-all duration-300 shadow-lg shadow-brand-teal/20 hover:shadow-xl hover:shadow-brand-teal/30 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                SIGN IN TO DASHBOARD <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info Box */}
        <div className="mt-6 p-3 bg-brand-powderLight/60 border border-brand-powder/60 rounded-xl text-center">
          <p className="font-sans text-[10px] text-brand-navy/70 font-medium">
            🔑 <span className="font-bold text-brand-teal">Demo Credentials:</span> aditi@sukafashions.com | admin123
          </p>
        </div>

        {/* Footer Security Badges & Storefront Link */}
        <div className="mt-6 pt-4 border-t border-brand-powder/40 flex items-center justify-between text-[10.5px] font-sans text-brand-navy/60">
          <span className="flex items-center gap-1.5 font-medium text-brand-teal">
            <ShieldCheck size={14} /> 256-Bit SSL Encrypted Admin
          </span>
          <Link to="/" className="text-brand-teal font-bold hover:underline transition-colors">
            ← Customer Storefront
          </Link>
        </div>

      </div>

    </div>
  );
}
