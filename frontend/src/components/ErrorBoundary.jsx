// ErrorBoundary.jsx — Prevents white screens & provides elegant fallback recovery
import React from 'react';
import { RefreshCw, Home, ShoppingBag, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 bg-slate-50 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-brand-powder text-brand-teal flex items-center justify-center mb-4 shadow-sm border border-brand-teal/20">
            <AlertTriangle size={32} />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            We encountered an unexpected issue while rendering this section. Don't worry, your shopping bag and account data are completely safe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Reload Page</span>
            </button>

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Home size={14} />
              <span>Go to Home</span>
            </button>

            <a
              href="/products"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0b1b4f] hover:bg-[#07133a] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ShoppingBag size={14} />
              <span>Explore Collection</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
