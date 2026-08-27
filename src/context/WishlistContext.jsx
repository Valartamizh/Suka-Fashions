import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, X, LogIn } from 'lucide-react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const toggleWishlist = (product) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
    return true;
  };

  const isInWishlist = (productId) => {
    if (!isLoggedIn) return false;
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: isLoggedIn ? wishlistItems : [],
        wishlistCount: isLoggedIn ? wishlistItems.length : 0,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        loginModalOpen,
        setLoginModalOpen,
      }}
    >
      {children}
      {loginModalOpen && <WishlistLoginModal onClose={() => setLoginModalOpen(false)} />}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

function WishlistLoginModal({ onClose }) {
  const navigate = useNavigate();

  const handleProceedToLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-md shadow-2xl w-full max-w-md p-6 sm:p-8 text-center border border-brand-powder/60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-full bg-brand-powderLight text-brand-teal flex items-center justify-center mx-auto mb-4 border border-brand-powder/60">
          <Lock size={24} strokeWidth={1.8} />
        </div>

        <span className="font-sans text-[10px] tracking-[0.25em] text-brand-teal uppercase font-bold block mb-1">
          LOGIN REQUIRED
        </span>

        <h3 className="font-serif text-2xl font-light text-brand-navy mb-3 uppercase tracking-wider">
          Save To Your Wishlist
        </h3>

        <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light mb-6">
          Please log in or register your Suka Fashions account to save your favorite ethnic pieces and view them anytime.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleProceedToLogin}
            className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white py-3.5 font-sans text-xs font-bold uppercase tracking-[0.18em] rounded-sm transition-all shadow-md"
          >
            <LogIn size={15} /> Login / Register Now
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 font-sans text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
