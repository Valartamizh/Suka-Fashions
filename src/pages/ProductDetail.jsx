import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ChevronDown, Check, Ruler } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  
  // Interactive States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0); // index
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Accordion States
  const [openAccordion, setOpenAccordion] = useState('details');

  // Related Products
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Determine product
    const foundProduct = products.find(p => p.id === id) || products.find(p => p.slug === id) || products[0];
    setProduct(foundProduct);
    
    // Reset states
    setSelectedSize(foundProduct.sizes?.[0] || 'M');
    setSelectedColor(0);
    setQuantity(1);
    setAddedToCart(false);
    
    // Fake related products
    setRelatedProducts(products.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 4));
    
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (!product) return null;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 text-left">
        
        {/* Breadcrumbs */}
        <nav className="text-[10px] font-sans text-brand-navy/50 uppercase tracking-[0.2em] mb-8 lg:mb-10 flex items-center flex-wrap gap-2">
          <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-teal transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-brand-teal transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left Side: Images Gallery */}
          <div className="lg:w-[55%] flex flex-col gap-4">
            <div className="w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden border border-brand-powder/50 rounded-sm shadow-sm bg-brand-cream/30 relative group">
              <img 
                src={selectedColor === 0 ? product.image : product.imageHover} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              />
              {/* Optional Badges */}
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-brand-teal text-white text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm shadow-sm font-semibold">
                  New Arrival
                </span>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              <button onClick={() => setSelectedColor(0)} className={`aspect-[3/4] overflow-hidden border bg-white rounded-sm p-1 transition-all ${selectedColor === 0 ? 'border-brand-teal border-2' : 'border-brand-powder/60 opacity-70 hover:opacity-100 hover:border-brand-teal'}`}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xs" />
              </button>
              {product.imageHover && (
                <button onClick={() => setSelectedColor(1)} className={`aspect-[3/4] overflow-hidden border bg-white rounded-sm p-1 transition-all ${selectedColor === 1 ? 'border-brand-teal border-2' : 'border-brand-powder/60 opacity-70 hover:opacity-100 hover:border-brand-teal'}`}>
                  <img src={product.imageHover} alt={product.name} className="w-full h-full object-cover rounded-xs" />
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
                <button className="font-sans text-xs text-brand-navy hover:text-brand-teal transition-colors underline-offset-4 hover:underline pl-1">
                  Read {product.reviewsCount} Reviews
                </button>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-navy mb-3 block">
                    Color: <span className="font-normal text-brand-navy/60 capitalize ml-1">{selectedColor === 0 ? 'Primary' : 'Secondary'}</span>
                  </span>
                  <div className="flex gap-3">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(idx)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${selectedColor === idx ? 'ring-2 ring-brand-teal ring-offset-2' : 'ring-1 ring-brand-powder hover:ring-brand-teal'}`}
                      >
                        <span className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: color }} />
                      </button>
                    ))}
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
                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
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
                    addedToCart ? 'bg-brand-tealLight text-white shadow-lg shadow-brand-teal/20' : 'bg-brand-teal hover:bg-brand-tealDark text-white hover:shadow-xl hover:shadow-brand-teal/20'
                  }`}
                >
                  {addedToCart ? <Check size={16} strokeWidth={2.5} /> : <ShoppingBag size={15} strokeWidth={2} />}
                  <span>{product.stock === 0 ? 'Sold Out' : (addedToCart ? 'Added' : 'Add to Bag')}</span>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-12 h-[50px] flex-shrink-0 flex items-center justify-center border border-brand-powder rounded-sm text-brand-navy hover:text-brand-teal hover:border-brand-teal transition-all duration-300 bg-white shadow-sm"
                >
                  <Heart size={18} strokeWidth={isWishlisted ? 0 : 1.5} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
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
      </div>

      {/* ── Related Products ───────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-brand-powder/40 bg-brand-cream/30 py-16 sm:py-20 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-brand-navy mb-2 uppercase tracking-wider">
              Complete The Look
            </h3>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-brand-navy/50 font-semibold mb-10">
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

    </div>
  );
}
