import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import fallbackImage from '../assets/saree_golden.jpg';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
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
      className="group flex flex-col h-full bg-white border border-brand-powder/50 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-350 rounded-sm relative"
    >
      {/* ── Image area ─────────────────────────────────── */}
      <div className="relative w-full aspect-[3/4] bg-brand-cream/40 overflow-hidden flex-shrink-0">

        {/* NEW badge */}
        {product.isNew && (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-brand-teal text-white text-[8.5px] sm:text-[9px] font-sans font-semibold tracking-[0.18em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 z-10 rounded-sm shadow-xs">
            NEW
          </span>
        )}

        {/* Wishlist Button (Protected: Requires Login) */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-xs transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            size={14}
            strokeWidth={wishlisted ? 0 : 1.8}
            className={`transition-colors duration-250 ${
              wishlisted ? 'fill-red-500 text-red-500' : 'text-brand-navy/50'
            }`}
          />
        </button>

        {/* Product image */}
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          onError={handleImageError}
          className="product-img-primary w-full h-full object-cover object-top"
          loading="lazy"
        />

        {/* Quick Add overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, 1);
          }}
          className="absolute bottom-0 left-0 right-0 w-full bg-brand-teal/95 py-2.5 sm:py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5 sm:gap-2 font-sans text-[9px] sm:text-[10px] tracking-[0.2em] font-semibold text-white uppercase">
            <ShoppingBag size={12} strokeWidth={2} />
            QUICK ADD
          </span>
        </button>
      </div>

      {/* ── Product info (Uniform height flex column) ───────────────────── */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between text-left">
        <div>
          {/* Brand label */}
          <span className="font-sans text-[7.5px] sm:text-[8px] tracking-[0.22em] text-brand-teal font-semibold uppercase mb-0.5 block">
            SUKA FASHIONS
          </span>

          {/* Name with fixed 2-line min-height for uniform alignment */}
          <h3 className="font-serif text-xs sm:text-[13.5px] text-brand-navy font-medium mb-1 group-hover:text-brand-teal line-clamp-2 min-h-[34px] sm:min-h-[38px] leading-snug transition-colors duration-200">
            {product.name}
          </h3>

          {/* Stars + review count */}
          <div className="flex items-center gap-1.5 mb-1.5 min-h-[14px]">
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
            <span className="font-sans text-[9.5px] sm:text-[10px] text-brand-navy/50 font-medium">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Prices Row (Consistent alignment) */}
        <div className="mt-auto pt-1 flex items-baseline flex-wrap gap-1 sm:gap-1.5 min-h-[22px]">
          <span className="font-sans text-xs sm:text-sm md:text-base font-bold text-brand-navy">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.oldPrice && (
            <>
              <span className="font-sans text-[10px] sm:text-xs text-brand-navy/35 line-through">
                ₹{product.oldPrice.toLocaleString('en-IN')}
              </span>
              <span className="font-sans text-[8.5px] sm:text-[9.5px] font-bold text-red-500 uppercase tracking-wide">
                {product.discount}
              </span>
            </>
          )}
        </div>

      </div>
    </Link>
  );
}
