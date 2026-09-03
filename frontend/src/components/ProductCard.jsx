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

  const defaultColor = product.colors?.[0];
  const primaryImage = (defaultColor?.images?.find(i => i.isPrimary)?.url)
    || defaultColor?.images?.[0]?.url
    || (typeof defaultColor?.images?.[0] === 'string' ? defaultColor.images[0] : null)
    || product.image
    || fallbackImage;

  const displayPrice = product.price || 0;
  const displayMrp = product.mrp || product.oldPrice || 0;
  const discountText = displayMrp > displayPrice
    ? `${Math.round(((displayMrp - displayPrice) / displayMrp) * 100)}% OFF`
    : product.discount;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      ...product,
      image: primaryImage,
      colorName: defaultColor?.name || 'Standard',
      colorId: defaultColor?.id,
    });
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
  };

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className="group flex flex-col h-full bg-white border border-brand-powder/50 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-350 rounded-sm relative"
    >
      {/* ── Image area ─────────────────────────────────── */}
      <div className="relative w-full aspect-[3/4] bg-brand-cream/40 overflow-hidden flex-shrink-0">

        {/* NEW / BESTSELLER badge */}
        {product.isNew && (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-brand-teal text-white text-[8.5px] sm:text-[9px] font-sans font-semibold tracking-[0.18em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 z-10 rounded-sm shadow-xs">
            NEW
          </span>
        )}
        {!product.isNew && product.isBestSeller && (
          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-amber-600 text-white text-[8.5px] sm:text-[9px] font-sans font-semibold tracking-[0.18em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 z-10 rounded-sm shadow-xs">
            BESTSELLER
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
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
          src={primaryImage}
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
            addToCart({
              ...product,
              image: primaryImage,
              selectedColorImage: primaryImage,
              colorName: defaultColor?.name || 'Standard',
              colorId: defaultColor?.id,
              size: defaultColor?.variants?.[0]?.size || 'Free Size',
            }, 1);
          }}
          className="absolute bottom-0 left-0 right-0 w-full bg-brand-teal/95 py-2.5 sm:py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5 sm:gap-2 font-sans text-[9px] sm:text-[10px] tracking-[0.2em] font-semibold text-white uppercase">
            <ShoppingBag size={12} strokeWidth={2} />
            QUICK ADD
          </span>
        </button>
      </div>

      {/* ── Product info (Compact, Clean & Tight Layout) ───────────────────── */}
      <div className="p-2.5 sm:p-3 flex flex-col text-left space-y-1">
        {/* Brand label */}
        <span className="font-sans text-[8.5px] sm:text-[9px] tracking-[0.2em] text-brand-teal font-bold uppercase block">
          SUKA FASHIONS • {product.category?.toUpperCase()}
        </span>

        {/* Name: prominent font size, tight line height */}
        <h3 className="font-serif text-sm sm:text-[15px] text-brand-navy font-semibold group-hover:text-brand-teal line-clamp-1 leading-snug transition-colors duration-200">
          {product.name}
        </h3>

        {/* Stars + Color Swatches in single clean row */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={10}
                  strokeWidth={0}
                  className={s <= Math.round(product.rating || 5) ? 'fill-amber-400' : 'fill-brand-navy/15'}
                />
              ))}
            </div>
            <span className="font-sans text-[10px] text-brand-navy/60 font-semibold">
              {product.rating || 4.8} ({product.reviewsCount || 42})
            </span>
          </div>

          {/* Color Swatch Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={c.id || i}
                  className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs inline-block"
                  style={{ backgroundColor: c.hex || '#006B70' }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[8.5px] text-slate-500 font-bold">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Prices Row: tight and prominent */}
        <div className="pt-1 flex items-baseline flex-wrap gap-1.5">
          <span className="font-sans text-sm sm:text-base font-extrabold text-brand-navy">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {displayMrp > displayPrice && (
            <>
              <span className="font-sans text-[11px] sm:text-xs text-brand-navy/40 line-through">
                ₹{displayMrp.toLocaleString('en-IN')}
              </span>
              {discountText && (
                <span className="font-sans text-[9px] sm:text-[9.5px] font-bold text-red-600 uppercase tracking-wide">
                  {discountText}
                </span>
              )}
            </>
          )}
        </div>

      </div>
    </Link>
  );
}
