import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import fallbackImage from '../assets/saree_golden.jpg';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col bg-white border border-brand-powder/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-350 rounded-sm relative"
    >
      {/* ── Image area ─────────────────────────────────── */}
      <div className="relative w-full aspect-[3/4] bg-brand-cream/40 overflow-hidden">

        {/* NEW badge */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-brand-teal text-white text-[9px] font-sans font-semibold tracking-[0.18em] uppercase px-2.5 py-1 z-10 rounded-sm shadow-sm">
            NEW
          </span>
        )}

        {/* Wishlist Button (Protected: Requires Login) */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            size={15}
            strokeWidth={wishlisted ? 0 : 1.8}
            className={`transition-colors duration-250 ${
              wishlisted ? 'fill-red-500 text-red-500' : 'text-brand-navy/50'
            }`}
          />
        </button>

        {/* Product image (Fitted object-cover object-top, zero image swap, fallback protection) */}
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          onError={handleImageError}
          className="product-img-primary w-full h-full object-cover object-top"
          loading="lazy"
        />

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-brand-teal/95 py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] font-semibold text-white uppercase">
            <ShoppingBag size={13} strokeWidth={2} />
            QUICK ADD
          </span>
        </div>
      </div>

      {/* ── Product info ───────────────────────────────── */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-grow text-left">

        {/* Brand label */}
        <span className="font-sans text-[8px] tracking-[0.22em] text-brand-teal font-semibold uppercase mb-0.5">
          SUKA FASHIONS
        </span>

        {/* Name */}
        <h3 className="font-serif text-sm sm:text-[14px] text-brand-navy font-medium mb-1.5 group-hover:text-brand-teal line-clamp-2 leading-snug transition-colors duration-200">
          {product.name}
        </h3>

        {/* Stars + review count */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                strokeWidth={0}
                className={s <= Math.round(product.rating) ? 'fill-amber-400' : 'fill-brand-navy/15'}
              />
            ))}
          </div>
          <span className="font-sans text-[10px] text-brand-navy/50 font-medium">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Prices */}
        <div className="mt-auto flex items-baseline flex-wrap gap-1.5">
          <span className="font-sans text-sm sm:text-base font-bold text-brand-navy">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.oldPrice && (
            <>
              <span className="font-sans text-xs text-brand-navy/35 line-through">
                ₹{product.oldPrice.toLocaleString('en-IN')}
              </span>
              <span className="font-sans text-[10px] font-semibold text-red-500 uppercase tracking-wide">
                {product.discount}
              </span>
            </>
          )}
        </div>

      </div>
    </Link>
  );
}
