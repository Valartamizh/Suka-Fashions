import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X, LogIn, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Wishlist() {
  const { isLoggedIn } = useAuth();
  const { wishlistItems, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: () => {},
  });

  const requestRemoveFromWishlist = (product) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove from Wishlist?',
      message: `Are you sure you want to remove "${product.name}" from your wishlist?`,
      confirmText: 'Remove Item',
      onConfirm: () => {
        toggleWishlist(product);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const requestClearWishlist = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear Entire Wishlist?',
      message: 'Are you sure you want to remove all saved items from your wishlist?',
      confirmText: 'Clear Wishlist',
      onConfirm: () => {
        clearWishlist();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  // If customer is not logged in, prompt to log in
  if (!isLoggedIn) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-12 pb-20 text-center">
        <div className="max-w-md mx-auto bg-white border border-brand-powder/60 p-8 sm:p-10 rounded-sm shadow-md">
          <div className="w-14 h-14 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mx-auto mb-4">
            <Lock size={26} strokeWidth={1.5} />
          </div>
          <p className="font-sans text-[10px] tracking-[0.25em] text-brand-teal uppercase font-semibold mb-2">
            PLEASE LOGIN TO CONTINUE
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light mb-3 uppercase tracking-wider">
            Your Saved Wishlist
          </h2>
          <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light mb-6">
            Please log in to your Suka Fashions account to save, view, and sync your favorite items across devices.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-brand-teal hover:bg-brand-tealDark text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-bold transition-all rounded-sm shadow-md"
          >
            <LogIn size={15} /> Login / Register to View Wishlist
          </Link>
        </div>
      </div>
    );
  }

  // If logged in but empty
  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-8 pb-16 text-center">
        <div className="max-w-md mx-auto bg-brand-cream/30 border border-brand-powder/50 p-8 sm:p-10 rounded-sm">
          <Heart size={36} strokeWidth={1} className="mx-auto text-brand-navy/20 mb-4" />
          <p className="font-sans text-[10px] tracking-[0.25em] text-brand-teal uppercase font-semibold mb-3">
            Your Wishlist is Empty
          </p>
          <h2 className="font-serif text-2xl text-brand-navy font-light mb-5 uppercase tracking-wider">
            Save your favorite pieces here
          </h2>
          <Link
            to="/products"
            className="inline-block bg-brand-navy text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal transition-colors rounded-sm"
          >
            Discover Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-6 sm:pt-8 pb-12 lg:pb-16 text-left">
      
      <div className="flex justify-between items-end mb-6 pb-3 border-b border-brand-powder/60">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase mb-1">
            Wishlist
          </h1>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-navy/60 font-medium">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
          </p>
        </div>
        <button 
          onClick={requestClearWishlist}
          className="hidden sm:block font-sans text-[10px] uppercase tracking-widest text-brand-navy/40 hover:text-red-500 transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group relative flex flex-col bg-white border border-transparent hover:border-brand-powder/50 rounded-sm transition-all duration-300 hover:shadow-sm">
            
            {/* Image */}
            <div className="w-full aspect-[3/4] sm:aspect-[4/5] bg-brand-cream border border-brand-powder/40 rounded-sm overflow-hidden relative mb-4">
              <Link to={`/product/${item.slug}`}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
              </Link>
              
              {/* Remove Button */}
              <button 
                onClick={() => requestRemoveFromWishlist(item)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-navy/50 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
                aria-label="Remove from wishlist"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Info */}
            <div className="px-1 flex-1 flex flex-col">
              <Link to={`/product/${item.slug}`}>
                <h3 className="font-serif text-sm sm:text-base text-brand-navy font-medium line-clamp-1 mb-1 group-hover:text-brand-teal transition-colors">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-sans text-sm font-bold text-brand-navy">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
                {item.oldPrice && (
                  <span className="font-sans text-[10px] text-brand-navy/40 line-through">
                    ₹{item.oldPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              
              {/* Add to Cart Action */}
              <button
                onClick={() => moveToCart(item)}
                className="mt-auto w-full py-2.5 sm:py-3 border border-brand-navy text-brand-navy font-sans text-[10px] uppercase tracking-[0.15em] font-semibold hover:bg-brand-navy hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={14} /> Move to Bag
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
