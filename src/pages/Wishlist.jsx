import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { products } from '../data/products';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([products[2], products[4], products[7]]);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const moveToCart = (id) => {
    // In a real app, dispatch to cart context
    removeFromWishlist(id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 text-center">
        <div className="max-w-md mx-auto bg-brand-cream/30 border border-brand-powder/50 p-10 rounded-sm">
          <Heart size={40} strokeWidth={1} className="mx-auto text-brand-navy/20 mb-6" />
          <p className="font-sans text-[10px] tracking-[0.25em] text-brand-teal uppercase font-semibold mb-4">
            Your Wishlist is Empty
          </p>
          <h2 className="font-serif text-2xl text-brand-navy font-light mb-6 uppercase tracking-wider">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-12">
      
      <div className="flex justify-between items-end mb-8 pb-4 border-b border-brand-powder/60">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-navy tracking-wider uppercase mb-2">
            Wishlist
          </h1>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-brand-navy/60 font-medium">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
          </p>
        </div>
        <button 
          onClick={() => setWishlistItems([])}
          className="hidden sm:block font-sans text-[10px] uppercase tracking-widest text-brand-navy/40 hover:text-red-500 transition-colors"
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
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </Link>
              
              {/* Remove Button */}
              <button 
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-navy/50 hover:text-red-500 transition-colors shadow-sm"
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
                onClick={() => moveToCart(item.id)}
                className="mt-auto w-full py-2.5 sm:py-3 border border-brand-navy text-brand-navy font-sans text-[10px] uppercase tracking-[0.15em] font-semibold hover:bg-brand-navy hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} /> Move to Bag
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
