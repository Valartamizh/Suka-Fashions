import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ChevronDown, Check, Ruler, ThumbsUp, MessageSquare, X, Send, ZoomIn, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

// Color name mapping
const COLOR_NAMES = {
  '#006B70': 'Teal',
  '#D4AF37': 'Gold Zari',
  '#F8C8DC': 'Blush Pink',
  '#0F1E2E': 'Navy Blue',
  '#000000': 'Midnight Black',
  '#800000': 'Maroon Red',
  '#FFDB58': 'Mustard Yellow',
  '#FFFFFF': 'Pure White',
  '#FFFFF0': 'Ivory White',
  '#DC143C': 'Crimson Red',
  '#50C878': 'Emerald Green',
  '#191970': 'Midnight Blue',
  '#FFB6C1': 'Pastel Pink',
  '#FF0000': 'Classic Red',
  '#9DC183': 'Sage Green',
  '#FFCBA4': 'Peach',
  '#B0E0E6': 'Powder Blue',
  '#3A5A40': 'Deep Forest',
  '#0F2C59': 'Indigo Blue',
  '#FF8C00': 'Vibrant Orange',
  '#0B6623': 'Deep Emerald',
};

const getColorName = (hex, product, index) => {
  if (!hex) return 'Standard Color';
  const upper = hex.toUpperCase();
  if (COLOR_NAMES[upper]) return COLOR_NAMES[upper];
  if (upper === '#FFFFFF' || upper === '#FFFFF0') return 'Pure White';
  return product?.colors && product.colors.length > 1 ? `Option ${index + 1}` : 'Primary Color';
};

// Initial customer reviews for products
const MOCK_PRODUCT_REVIEWS = [
  {
    id: 1,
    author: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    date: '20 Aug 2026',
    verified: true,
    title: 'Absolutely breathtaking quality!',
    content: 'The drape and finish are top-tier. I wore this for my cousin\'s engagement ceremony and received non-stop compliments all evening. The fabric feels weightless yet luxurious.',
    helpfulCount: 14,
  },
  {
    id: 2,
    author: 'Radhika S.',
    location: 'Bengaluru',
    rating: 5,
    date: '18 Aug 2026',
    verified: true,
    title: 'Worth every rupee!',
    content: 'Color is exactly as shown in the photos. Packaging was very elegant and shipping was delivered in 3 days. Will definitely be buying more from Suka Fashions!',
    helpfulCount: 9,
  },
  {
    id: 3,
    author: 'Ananya Krishnan',
    location: 'Chennai',
    rating: 4,
    date: '12 Aug 2026',
    verified: true,
    title: 'Beautiful fabric & fit',
    content: 'Very graceful outfit with intricate work. The texture is premium and drapes beautifully. Great customer service as well.',
    helpfulCount: 6,
  },
  {
    id: 4,
    author: 'Meera Trivedi',
    location: 'Delhi',
    rating: 5,
    date: '05 Aug 2026',
    verified: true,
    title: 'Stunning craftsmanship',
    content: 'The attention to detail on the borders and seams is wonderful. Comfortable for long wedding functions.',
    helpfulCount: 11,
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  // Interactive States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0); // index
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Image Lightbox Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Accordion States
  const [openAccordion, setOpenAccordion] = useState('details');

  // Related Products & Reviews
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewsList, setReviewsList] = useState(MOCK_PRODUCT_REVIEWS);
  const [helpfulClicked, setHelpfulClicked] = useState({});

  // Review Form Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    name: '',
    title: '',
    comment: '',
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    // Determine product
    const foundProduct = products.find(p => p.id === id) || products.find(p => p.slug === id) || products[0];
    setProduct(foundProduct);
    
    // Reset states
    setSelectedSize(foundProduct.sizes?.[0] || 'Free Size');
    setSelectedColor(0);
    setQuantity(1);
    setAddedToCart(false);
    
    // Related products
    setRelatedProducts(products.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 4));
    
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  // Keyboard navigation for image preview lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!previewOpen) return;
      if (e.key === 'Escape') setPreviewOpen(false);
      if (e.key === 'ArrowRight') nextPreview();
      if (e.key === 'ArrowLeft') prevPreview();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewOpen, previewIndex, product]);

  if (!product) return null;

  const galleryImages = [product.image, product.imageHover].filter(Boolean);

  const openPreviewModal = (index) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const nextPreview = () => {
    setPreviewIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevPreview = () => {
    setPreviewIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const toggleAccordion = (accId) => {
    setOpenAccordion(openAccordion === accId ? null : accId);
  };

  const scrollToReviews = () => {
    const el = document.getElementById('customer-reviews-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHelpfulClick = (reviewId) => {
    if (helpfulClicked[reviewId]) return;
    setHelpfulClicked(prev => ({ ...prev, [reviewId]: true }));
    setReviewsList(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    
    const createdReview = {
      id: Date.now(),
      author: newReview.name,
      location: 'Verified Customer',
      rating: Number(newReview.rating),
      date: 'Just now',
      verified: true,
      title: newReview.title || 'Great Product',
      content: newReview.comment,
      helpfulCount: 0,
    };

    setReviewsList([createdReview, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOpen(false);
      setNewReview({ rating: 5, name: '', title: '', comment: '' });
    }, 2000);
  };

  const currentColorHex = product.colors?.[selectedColor] || '#006B70';
  const currentColorName = getColorName(currentColorHex, product, selectedColor);

  return (
    <div className="bg-white pb-14 lg:pb-18">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-6 sm:pt-8 pb-10 text-left">
        
        {/* Breadcrumbs */}
        <nav className="text-[10px] font-sans text-brand-navy/50 uppercase tracking-[0.2em] mb-5 lg:mb-6 flex items-center flex-wrap gap-2">
          <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-teal transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-brand-teal transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left Side: Images Gallery */}
          <div className="lg:w-[55%] flex flex-col gap-4">
            <div 
              onClick={() => openPreviewModal(selectedColor)}
              className="w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden border border-brand-powder/50 rounded-sm shadow-sm bg-brand-cream/30 relative group cursor-zoom-in"
            >
              <img 
                src={selectedColor === 0 ? product.image : (product.imageHover || product.image)} 
                alt={product.name} 
                className="w-full h-full object-cover object-top transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              />

              {/* Hover Badge for Preview */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPreviewModal(selectedColor);
                }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-brand-navy p-2 rounded-sm shadow-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] tracking-widest font-semibold uppercase"
              >
                <ZoomIn size={14} /> Preview
              </button>

              {/* Optional Badges */}
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-brand-teal text-white text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm shadow-sm font-semibold">
                  New Arrival
                </span>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              <button 
                onClick={() => { setSelectedColor(0); openPreviewModal(0); }} 
                className={`aspect-[3/4] overflow-hidden border bg-white rounded-sm p-1 transition-all ${selectedColor === 0 ? 'border-brand-teal border-2' : 'border-brand-powder/60 opacity-70 hover:opacity-100 hover:border-brand-teal'}`}
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top rounded-xs" />
              </button>
              {product.imageHover && (
                <button 
                  onClick={() => { setSelectedColor(1); openPreviewModal(1); }} 
                  className={`aspect-[3/4] overflow-hidden border bg-white rounded-sm p-1 transition-all ${selectedColor === 1 ? 'border-brand-teal border-2' : 'border-brand-powder/60 opacity-70 hover:opacity-100 hover:border-brand-teal'}`}
                >
                  <img src={product.imageHover} alt={product.name} className="w-full h-full object-cover object-top rounded-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Info & Actions (Sticky) */}
          <div className="lg:w-[45%]">
            <div className="sticky top-[100px]">
              
              <span className="font-sans text-[10px] text-brand-teal font-semibold tracking-[0.25em] uppercase mb-2 block">
                Suka Fashions
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] leading-tight text-brand-navy font-light mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-sans text-2xl font-bold text-brand-navy">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.oldPrice && (
                  <span className="font-sans text-sm sm:text-base text-brand-navy/40 line-through">
                    ₹{product.oldPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="font-sans text-[10px] text-brand-navy/50 tracking-wider">
                  (Incl. of all taxes)
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-8 pb-8 border-b border-brand-powder/60">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= Math.floor(product.rating) ? 'fill-amber-400' : 'text-brand-powder'} strokeWidth={1} />
                  ))}
                </div>
                <span className="font-sans text-xs text-brand-navy/60 font-medium border-r border-brand-powder/60 pr-3">
                  {product.rating}
                </span>
                <button
                  onClick={scrollToReviews}
                  className="font-sans text-xs text-brand-teal hover:underline font-semibold pl-1 transition-colors"
                >
                  Read {product.reviewsCount || reviewsList.length} Reviews
                </button>
              </div>

              {/* Color Selection (Enhanced with Color Names & Visible Borders for White Swatches) */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-navy mb-3 block">
                    COLOR: <span className="font-bold text-brand-teal capitalize ml-1.5">{currentColorName}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.colors.map((colorHex, idx) => {
                      const isWhite = colorHex.toUpperCase() === '#FFFFFF' || colorHex.toUpperCase() === '#FFFFF0';
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(idx)}
                          title={getColorName(colorHex, product, idx)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            selectedColor === idx
                              ? 'ring-2 ring-brand-teal ring-offset-2'
                              : 'ring-1 ring-slate-300 hover:ring-brand-teal'
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full shadow-xs ${
                              isWhite ? 'border-2 border-slate-300 bg-white' : 'border border-black/10'
                            }`}
                            style={{ backgroundColor: colorHex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-navy">
                      Size
                    </span>
                    <button className="font-sans text-[10px] text-brand-navy/60 hover:text-brand-teal transition-colors uppercase tracking-[0.1em] flex items-center gap-1.5">
                      <Ruler size={12} /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-10 px-3 flex items-center justify-center font-sans text-xs uppercase tracking-wider rounded-sm transition-all duration-200 border ${
                          selectedSize === size
                            ? 'bg-brand-navy text-white border-brand-navy font-semibold shadow-md'
                            : 'bg-white text-brand-navy border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-sans text-[10px] tracking-wide text-brand-navy/60">
                      {product.stock > 0 ? 'In Stock — Ready to Ship' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-brand-powder rounded-sm w-[100px] flex-shrink-0 bg-white">
                  <button onClick={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)} className="w-8 h-12 font-sans text-lg text-brand-navy/60 hover:text-brand-teal transition-colors flex items-center justify-center">-</button>
                  <span className="flex-1 text-center font-sans text-xs text-brand-navy font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(prev => prev + 1)} className="w-8 h-12 font-sans text-lg text-brand-navy/60 hover:text-brand-teal transition-colors flex items-center justify-center">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-sm transition-all duration-300 font-sans text-[10px] font-bold tracking-[0.2em] uppercase shadow-md ${
                    product.stock === 0 ? 'bg-brand-powder text-brand-navy/40 cursor-not-allowed' :
                    addedToCart ? 'bg-emerald-600 text-white shadow-lg' : 'bg-brand-teal hover:bg-brand-tealDark text-white hover:shadow-xl'
                  }`}
                >
                  {addedToCart ? <Check size={16} strokeWidth={2.5} /> : <ShoppingBag size={15} strokeWidth={2} />}
                  <span>{product.stock === 0 ? 'Sold Out' : (addedToCart ? 'Added' : 'Add to Bag')}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="w-12 h-[50px] flex-shrink-0 flex items-center justify-center border border-brand-powder rounded-sm text-brand-navy hover:text-brand-teal hover:border-brand-teal transition-all duration-300 bg-white shadow-sm"
                >
                  <Heart size={18} strokeWidth={isInWishlist(product.id) ? 0 : 1.5} className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''} />
                </button>
              </div>

              {/* Delivery Features */}
              <div className="flex flex-col gap-3 p-4 bg-brand-powderLight/50 border border-brand-powder/60 rounded-sm mb-8">
                <div className="flex items-center gap-3">
                  <Truck size={15} className="text-brand-teal" />
                  <span className="font-sans text-[11px] text-brand-navy/70 tracking-wide">Free Shipping within India on orders above ₹1999</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw size={15} className="text-brand-teal" />
                  <span className="font-sans text-[11px] text-brand-navy/70 tracking-wide">7 Days easy returns and exchanges</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-brand-powder/60">
                {[
                  { id: 'details', title: 'Product Description', content: product.description },
                  { id: 'fabric', title: 'Material & Care', content: `Fabric: ${product.fabric || 'Premium Blend'}. Dry clean only. Do not bleach. Iron on low heat.` },
                  { id: 'shipping', title: 'Shipping & Returns', content: 'Dispatched within 24-48 hours. Delivered in 3-5 business days. 7-day hassle-free return policy.' },
                ].map((acc) => (
                  <div key={acc.id} className="border-b border-brand-powder/60">
                    <button 
                      onClick={() => toggleAccordion(acc.id)}
                      className="w-full flex items-center justify-between py-5 text-left group"
                    >
                      <span className="font-sans text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                        {acc.title}
                      </span>
                      <ChevronDown size={14} className={`text-brand-navy/40 transition-transform duration-300 ${openAccordion === acc.id ? 'rotate-180 text-brand-teal' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === acc.id ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="font-sans text-xs text-brand-navy/70 leading-relaxed font-light">
                        {acc.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* ── CUSTOMER REVIEWS SECTION ───────────────────────────────────── */}
        <div id="customer-reviews-section" className="border-t border-brand-powder/60 pt-12 lg:pt-16 mt-14">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-powder/40">
            <div>
              <span className="font-sans text-[10px] tracking-[0.28em] text-brand-teal uppercase font-semibold block mb-2">
                VERIFIED CUSTOMER REVIEWS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy uppercase tracking-wider">
                Customer Ratings & Reviews
              </h2>
            </div>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="mt-4 md:mt-0 inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-teal text-white font-sans text-[10px] tracking-[0.2em] font-bold uppercase px-6 py-3 rounded-sm transition-colors shadow-sm"
            >
              <MessageSquare size={14} /> Write a Review
            </button>
          </div>

          {/* Rating Overview Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-brand-cream/30 border border-brand-powder/60 p-6 sm:p-8 rounded-sm mb-10">
            
            {/* Score */}
            <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-brand-powder/60 pb-6 md:pb-0 md:pr-6">
              <span className="font-serif text-5xl font-bold text-brand-navy mb-1">{product.rating}</span>
              <div className="flex items-center text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className={s <= Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'} strokeWidth={1} />
                ))}
              </div>
              <span className="font-sans text-xs text-brand-navy/60">Based on {product.reviewsCount || 89} verified reviews</span>
            </div>

            {/* Distribution bars */}
            <div className="flex flex-col justify-center gap-2 border-b md:border-b-0 md:border-r border-brand-powder/60 pb-6 md:pb-0 md:pr-6">
              {[
                { stars: 5, pct: 82 },
                { stars: 4, pct: 12 },
                { stars: 3, pct: 4 },
                { stars: 2, pct: 1 },
                { stars: 1, pct: 1 },
              ].map(item => (
                <div key={item.stars} className="flex items-center gap-3 text-xs font-sans text-brand-navy/70">
                  <span className="w-8 flex items-center gap-1 font-semibold">{item.stars} <Star size={10} className="fill-amber-400 text-amber-400" /></span>
                  <div className="flex-1 h-2 bg-brand-powder/60 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-teal rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="w-8 text-right font-medium text-brand-navy/40">{item.pct}%</span>
                </div>
              ))}
            </div>

            {/* Verified Trust Seal */}
            <div className="flex flex-col items-center justify-center text-center p-2">
              <span className="w-12 h-12 rounded-full bg-brand-powder flex items-center justify-center text-brand-teal mb-3 font-bold text-lg">
                ✓
              </span>
              <p className="font-serif text-base font-semibold text-brand-navy mb-1">100% Verified Buyer Reviews</p>
              <p className="font-sans text-xs text-brand-navy/60 leading-relaxed max-w-xs">
                All reviews are collected from real customers who purchased this item.
              </p>
            </div>

          </div>

          {/* Individual Reviews List */}
          <div className="space-y-6">
            {reviewsList.map(review => (
              <div key={review.id} className="p-6 bg-white border border-brand-powder/50 rounded-sm shadow-2xs text-left transition-all hover:border-brand-teal/40">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={13} className={s <= review.rating ? 'fill-amber-400' : 'text-slate-200'} strokeWidth={1} />
                        ))}
                      </div>
                      <span className="font-sans text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        ✓ Verified Buyer
                      </span>
                    </div>
                    <h4 className="font-serif text-base sm:text-lg font-semibold text-brand-navy">{review.title}</h4>
                  </div>
                  <span className="font-sans text-[11px] text-brand-navy/40">{review.date}</span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-brand-navy/75 leading-relaxed font-light mb-4">
                  "{review.content}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs font-bold text-brand-navy">{review.author}</span>
                    {review.location && <span className="font-sans text-[11px] text-brand-navy/40">· {review.location}</span>}
                  </div>
                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    className={`flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1 rounded-md transition-colors ${
                      helpfulClicked[review.id] ? 'bg-brand-powder text-brand-teal font-semibold' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp size={12} />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ── Related Products ───────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-brand-powder/40 bg-brand-cream/30 py-10 lg:py-14 mt-12">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-brand-navy mb-1.5 uppercase tracking-wider">
              Complete The Look
            </h3>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-brand-navy/50 font-semibold mb-7">
              You May Also Like
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FULL SCREEN LIGHTBOX IMAGE PREVIEW MODAL ───────────────────── */}
      {previewOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewOpen(false)}
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between w-full text-white z-10" onClick={e => e.stopPropagation()}>
            <div>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-powder font-semibold block">
                SUKA FASHIONS · HIGH RESOLUTION PREVIEW
              </span>
              <h3 className="font-serif text-lg font-medium">{product.name}</h3>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-sans text-xs text-white/60 font-medium">
                {previewIndex + 1} / {galleryImages.length}
              </span>
              <button 
                onClick={() => setPreviewOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close preview"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Main Large Image View with Left / Right Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            {galleryImages.length > 1 && (
              <button
                onClick={prevPreview}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-brand-teal text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-lg"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
              <img
                src={galleryImages[previewIndex]}
                alt={`${product.name} preview angle ${previewIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-sm shadow-2xl transition-all duration-300"
              />
            </div>

            {galleryImages.length > 1 && (
              <button
                onClick={nextPreview}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-brand-teal text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-lg"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-3 z-10 py-2" onClick={e => e.stopPropagation()}>
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setPreviewIndex(i)}
                className={`w-14 h-18 sm:w-16 sm:h-20 rounded-sm overflow-hidden border-2 transition-all ${
                  previewIndex === i ? 'border-brand-teal scale-105 opacity-100 shadow-md' : 'border-white/20 opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── WRITE A REVIEW MODAL ─────────────────────────────────────── */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs" onClick={() => setReviewModalOpen(false)}>
          <div className="relative bg-white rounded-md shadow-2xl w-full max-w-lg p-6 sm:p-8 text-left" onClick={e => e.stopPropagation()}>
            <button onClick={() => setReviewModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            
            <h3 className="font-serif text-2xl font-normal text-brand-navy mb-1">Write a Review</h3>
            <p className="font-sans text-xs text-brand-navy/60 mb-6">Share your experience with "{product.name}"</p>

            {reviewSubmitted ? (
              <div className="py-8 text-center bg-emerald-50 border border-emerald-200 rounded-sm">
                <span className="text-3xl mb-2 block">🌟</span>
                <p className="font-serif text-lg font-bold text-emerald-800 mb-1">Thank you for your review!</p>
                <p className="font-sans text-xs text-emerald-700">Your review has been published successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="font-sans text-xs font-semibold text-brand-navy block mb-2">Overall Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star size={24} className={star <= newReview.rating ? 'fill-amber-400' : 'text-slate-300'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="font-sans text-xs font-semibold text-brand-navy block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    className="w-full border border-slate-200 rounded-sm px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-teal"
                    value={newReview.name}
                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="font-sans text-xs font-semibold text-brand-navy block mb-1">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Gorgeous embroidery and fabric"
                    className="w-full border border-slate-200 rounded-sm px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-teal"
                    value={newReview.title}
                    onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="font-sans text-xs font-semibold text-brand-navy block mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the fabric, fit, color accuracy, and overall experience..."
                    className="w-full border border-slate-200 rounded-sm px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-teal resize-none"
                    value={newReview.comment}
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-xs font-bold uppercase tracking-wider py-3.5 rounded-sm transition-colors shadow-md mt-4"
                >
                  <Send size={14} /> Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
