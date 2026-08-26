// AdminLogin page — /admin/login
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

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
    await new Promise(r => setTimeout(r, 700));
    const result = login(email, password, remember);
    setLoading(false);
    if (result.success) {
      navigate('/admin');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-brand-navy p-10 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-0 left-0 w-64 h-64 border border-white rounded-full -translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 right-0 w-80 h-80 border border-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-brand-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-sans">SF</span>
            </div>
            <div>
              <p className="font-serif text-white text-base font-bold leading-none">Suka Fashions</p>
              <p className="font-sans text-brand-teal text-[10px] font-bold tracking-widest uppercase mt-1">Admin Panel</p>
            </div>
          </div>

          <div className="mt-16">
            <h1 className="font-serif text-4xl font-bold text-white leading-tight mb-4">
              Manage your<br />
              store with ease.
            </h1>
            <p className="text-brand-powder/60 text-sm leading-relaxed max-w-xs">
              The Suka Fashions admin panel gives you complete control over your products, orders, customers, and content.
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Stats preview */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Revenue', value: '₹24.8L' },
              { label: 'Active Products', value: '148' },
              { label: 'Orders This Month', value: '326' },
              { label: 'Happy Customers', value: '1,284' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-brand-powder/50 text-[10px] uppercase tracking-widest font-sans">{stat.label}</p>
                <p className="text-white font-bold text-xl font-sans mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs font-sans">SF</span>
            </div>
            <div>
              <p className="font-serif text-brand-navy text-sm font-bold leading-none">Suka Fashions</p>
              <p className="font-sans text-brand-teal text-[9px] font-bold tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-sans text-2xl font-bold text-slate-800 mb-1">Welcome back</h2>
            <p className="text-sm text-slate-400">Sign in to access the admin panel.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
              <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sukafashions.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-teal accent-brand-teal cursor-pointer"
                />
                <span className="text-xs text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-xs text-brand-teal font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-teal hover:bg-brand-tealDark disabled:opacity-70 text-white font-sans font-semibold text-sm py-3 rounded-xl transition-all shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Login to Admin'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Demo: use any email & password to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
