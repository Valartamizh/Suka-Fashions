import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ChevronDown, Check, ThumbsUp, MessageSquare, X, Send, ZoomIn, ChevronLeft, ChevronRight, Maximize2, MapPin, Plus, Copy, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

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

const DEFAULT_SAVED_ADDRESSES = [
  {
    id: 1,
    name: 'Pooja Sharma',
    street: '123 Fashion Street, Apt 4B',
    apartment: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 98765 43210',
    isDefault: true,
  },
];

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
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { addOrder } = useOrders();
  const [product, setProduct] = useState(null);
  
  // Interactive States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0); // index
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  
  // WhatsApp Express Checkout & Address Modal States
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [whatsappDeliveryMethod, setWhatsappDeliveryMethod] = useState('standard');
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
    } catch (e) {
      return DEFAULT_SAVED_ADDRESSES;
    }
  });
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_addresses');
      const list = saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
      const def = list.find((a) => a.isDefault) || list[0];
      return def ? def.id : 1;
    } catch (e) {
      return 1;
    }
  });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: user?.name || 'Pooja Sharma',
    phone: user?.phone || '+91 98765 43210',
    email: user?.email || 'pooja@example.com',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    saveForFuture: true,
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [orderSuccessNotification, setOrderSuccessNotification] = useState(null);

  // Image Lightbox Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Accordion States
  const [openAccordion, setOpenAccordion] = useState('details');

  // Related Products & Reviews
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewsList, setReviewsList] = useState(MOCK_PRODUCT_REVIEWS);
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Review Form Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    name: '',
    title: '',
    comment: '',
  });
  const [reviewErrors, setReviewErrors] = useState({});
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

  // Sync selected address into addressForm
  useEffect(() => {
    if (!isAddingNewAddress && selectedAddressId) {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        setAddressForm({
          name: addr.name || user?.name || 'Pooja Sharma',
          phone: addr.phone || user?.phone || '+91 98765 43210',
          email: user?.email || 'pooja@example.com',
          street: addr.street || '',
          apartment: addr.apartment || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          saveForFuture: true,
        });
        setAddressErrors({});
      }
    }
  }, [selectedAddressId, savedAddresses, isAddingNewAddress, user]);

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
  const currentColorHex = product.colors?.[selectedColor] || '#006B70';
  const currentColorName = getColorName(currentColorHex, product, selectedColor);
  const productIdCode = product.productId || product.sku || `SUK-${product.id.substring(0, 6).toUpperCase()}`;

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
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity, selectedSize, currentColorName);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNowWhatsApp = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    // Refresh addresses from localStorage
    try {
      const saved = localStorage.getItem('suka_addresses');
      if (saved) {
        const list = JSON.parse(saved);
        setSavedAddresses(list);
        if (!selectedAddressId || !list.some(a => a.id === selectedAddressId)) {
          const def = list.find(a => a.isDefault) || list[0];
          if (def) setSelectedAddressId(def.id);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setWhatsappModalOpen(true);
  };

  const validateAddressForm = () => {
    const errs = {};
    if (!addressForm.name.trim() || addressForm.name.trim().length < 2) {
      errs.name = 'Full Name is required (min 2 characters)';
    }
    const rawDigits = (addressForm.phone || '').replace(/\D/g, '');
    const phoneDigits = rawDigits.slice(-10);
    if (!phoneDigits || phoneDigits.length !== 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    if (!addressForm.street.trim() || addressForm.street.trim().length < 5) {
      errs.street = 'Street address / House No. required (min 5 characters)';
    }
    if (!addressForm.city.trim()) {
      errs.city = 'City is required';
    }
    if (!addressForm.state.trim()) {
      errs.state = 'State is required';
    }
    const pincodeClean = (addressForm.pincode || '').replace(/\D/g, '');
    if (!pincodeClean || pincodeClean.length !== 6) {
      errs.pincode = 'Valid 6-digit PIN code required';
    }
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmWhatsAppOrder = (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    const subtotal = product.price * quantity;
    const shipping = whatsappDeliveryMethod === 'express' ? 250 : (subtotal >= 1999 ? 0 : 150);
    const total = subtotal + shipping;
    const orderId = `SUKA-${Math.floor(10000 + Math.random() * 90000)}`;

    // Save to saved addresses if new
    if (addressForm.saveForFuture && isAddingNewAddress) {
      const newAddr = {
        id: Date.now(),
        name: addressForm.name,
        street: addressForm.street,
        apartment: addressForm.apartment,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        phone: addressForm.phone,
        isDefault: savedAddresses.length === 0,
      };
      const updatedList = [...savedAddresses, newAddr];
      setSavedAddresses(updatedList);
      try {
        localStorage.setItem('suka_addresses', JSON.stringify(updatedList));
      } catch (err) {}
      setSelectedAddressId(newAddr.id);
      setIsAddingNewAddress(false);
    }

    // Save order in OrderContext
    const createdOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      total: total,
      subtotal: subtotal,
      shipping: shipping,
      paymentMethod: 'WhatsApp Express Order',
      items: [
        {
          id: product.id,
          productId: productIdCode,
          sku: productIdCode,
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: quantity,
          selectedSize: selectedSize,
          selectedColor: currentColorName,
          image: product.image,
        },
      ],
      address: {
        name: addressForm.name,
        street: addressForm.street,
        apartment: addressForm.apartment,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        phone: addressForm.phone,
      },
    };
    addOrder(createdOrder);

    // Format WhatsApp Message
    const rawImg = product.image || '';
    const imgUrl = rawImg.startsWith('http')
      ? rawImg
      : rawImg.startsWith('/')
      ? `${window.location.origin}${rawImg}`
      : `${window.location.origin}/${rawImg}`;

    const fullAddress = `${addressForm.street}${addressForm.apartment ? ', ' + addressForm.apartment : ''}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}`;

    const whatsappMsg = encodeURIComponent(
      `*🛍️ NEW ORDER - SUKA FASHIONS*\n` +
      `═══════════════════════════\n` +
      `*Order ID:* ${orderId}\n` +
      `*Product ID (SKU):* ${productIdCode}\n` +
      `*Product:* ${product.name}\n` +
      `*Category:* ${product.category.toUpperCase()}\n` +
      `*Color:* ${currentColorName}\n` +
      `*Size:* ${selectedSize}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Item Price:* ₹${subtotal.toLocaleString('en-IN')}\n` +
      `*Delivery Fee:* ${shipping === 0 ? 'FREE (Standard)' : `₹${shipping} (Express)`}\n` +
      `*TOTAL AMOUNT:* ₹${total.toLocaleString('en-IN')}\n` +
      `═══════════════════════════\n` +
      `*📦 DELIVERY ADDRESS:*\n` +
      `*Recipient:* ${addressForm.name}\n` +
      `*Mobile Number:* ${addressForm.phone}\n` +
      `${addressForm.email ? `*Email:* ${addressForm.email}\n` : ''}` +
      `*Address:* ${fullAddress}\n` +
      `═══════════════════════════\n` +
      `📷 *Product Photo:* ${imgUrl}\n\n` +
      `Hi Suka Fashions, I have submitted my delivery address and would like to confirm this order. Please share payment and dispatch details. Thank you!`
    );

    window.open(`https://wa.me/919876543210?text=${whatsappMsg}`, '_blank');
    setWhatsappModalOpen(false);
    setOrderSuccessNotification({
      orderId,
      productId: productIdCode,
      total,
      name: addressForm.name,
    });
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

  const validateReview = () => {
    const errs = {};
    if (!newReview.name.trim() || newReview.name.trim().length < 2) {
      errs.name = 'Your name is required (minimum 2 letters)';
    }
    if (!newReview.title.trim() || newReview.title.trim().length < 3) {
      errs.title = 'Review title is required (minimum 3 letters)';
    }
    if (!newReview.comment.trim() || newReview.comment.trim().length < 10) {
      errs.comment = 'Review comment must be at least 10 characters long';
    }
    setReviewErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!validateReview()) return;
    
    const createdReview = {
      id: Date.now(),
      author: newReview.name,
      location: 'Verified Customer',
      rating: Number(newReview.rating),
      date: 'Just now',
      verified: true,
      title: newReview.title || 'Great Product!',
      content: newReview.comment,
      helpfulCount: 0,
    };

    setReviewsList([createdReview, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOpen(false);
      setNewReview({ rating: 5, name: '', title: '', comment: '' });
      setReviewErrors({});
    }, 2000);
  };

  return (
    <div className="bg-white pb-0">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-3 sm:pt-5 pb-4 text-left">
        
        {/* Breadcrumbs */}
        <nav className="text-[10px] font-sans text-brand-navy/50 uppercase tracking-[0.2em] mb-4 lg:mb-5 flex items-center flex-wrap gap-2">
          <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-teal transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-brand-teal transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Product Layout: Full-Width 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-start">
          
          {/* Left Side: Images Gallery (6 Cols) */}
          <div className="lg:col-span-6 w-full flex flex-col gap-3.5">
            <div 
              onClick={() => openPreviewModal(selectedColor)}
              className="w-full h-[480px] sm:h-[540px] lg:h-[580px] overflow-hidden border border-brand-powder/50 rounded-sm shadow-sm bg-brand-cream/30 relative group cursor-zoom-in flex items-center justify-center"
            >
              <img 
                src={selectedColor === 0 ? product.image : (product.imageHover || product.image)} 
                alt={product.name} 
                className="w-full h-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Navigation Arrows on Main Image */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor((prev) => (prev === 0 ? 1 : 0));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-brand-teal hover:text-white text-brand-navy shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor((prev) => (prev === 0 ? 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-brand-teal hover:text-white text-brand-navy shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Wishlist Button on Product Image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white flex items-center justify-center transition-all hover:scale-110 z-10 cursor-pointer group/fav"
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={18}
                  strokeWidth={isInWishlist(product.id) ? 0 : 1.8}
                  className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-brand-navy group-hover/fav:text-red-500 transition-colors'}
                />
              </button>

              {/* Hover Badge for Preview */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openPreviewModal(selectedColor);
                }}
                className="absolute top-4 right-15 bg-white/90 backdrop-blur-sm text-brand-navy p-2 rounded-sm shadow-md hover:bg-brand-teal hover:text-white transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] tracking-widest font-semibold uppercase cursor-pointer z-10"
              >
                <ZoomIn size={14} /> Preview
              </button>

              {/* Optional Badges */}
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-brand-teal text-white text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-sm shadow-sm font-semibold z-10">
                  New Arrival
                </span>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-2.5">
              <button 
                type="button"
                onClick={() => setSelectedColor(0)} 
                className={`w-18 h-22 sm:w-20 sm:h-24 overflow-hidden border bg-brand-cream/20 rounded-sm p-1 transition-all cursor-pointer ${selectedColor === 0 ? 'border-brand-teal ring-2 ring-brand-teal/40' : 'border-brand-powder/60 opacity-70 hover:opacity-100 hover:border-brand-teal'}`}
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded-xs" />
              </button>
              {product.imageHover && (
                <button 
                  type="button"
                  onClick={() => setSelectedColor(1)} 
                  className={`w-18 h-22 sm:w-20 sm:h-24 overflow-hidden border bg-brand-cream/20 rounded-sm p-1 transition-all cursor-pointer ${selectedColor === 1 ? 'border-brand-teal ring-2 ring-brand-teal/40' : 'border-brand-powder/60 opacity-70 hover:opacity-100 hover:border-brand-teal'}`}
                >
                  <img src={product.imageHover} alt={product.name} className="w-full h-full object-contain rounded-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Right Side: Info & Actions (6 Cols, Sticky) */}
          <div className="lg:col-span-6 w-full">
            <div className="sticky top-[100px]">
              
              {/* Brand & Product ID Badge */}
              <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                <span className="font-sans text-[10px] text-brand-teal font-bold tracking-[0.25em] uppercase">
                  Suka Fashions
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-brand-powderLight text-brand-navy border border-brand-powder shadow-xs">
                  <span className="font-sans text-[9px] uppercase tracking-wider font-semibold text-brand-navy/60">Product ID:</span>
                  <span className="font-mono text-xs font-bold text-brand-teal tracking-wide">{productIdCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(productIdCode);
                      setCopiedSku(true);
                      setTimeout(() => setCopiedSku(false), 2000);
                    }}
                    title="Copy Product ID"
                    className="text-brand-navy/40 hover:text-brand-teal transition-colors p-0.5 ml-0.5 cursor-pointer"
                  >
                    {copiedSku ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

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

              {/* Order Success Notification Banner */}
              {orderSuccessNotification && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-sm flex items-start gap-3 shadow-sm">
                  <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900 flex-1">
                    <p className="font-bold text-emerald-950 font-serif text-sm mb-0.5">
                      Order Invoice Dispatched: {orderSuccessNotification.orderId}
                    </p>
                    <p className="mb-1 text-emerald-800">
                      Product ID <span className="font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded-xs">{orderSuccessNotification.productId}</span> and delivery address have been sent to WhatsApp!
                    </p>
                    <Link to="/account" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-900 hover:underline mt-1">
                      View Order in Account <ArrowRight size={12} />
                    </Link>
                  </div>
                  <button onClick={() => setOrderSuccessNotification(null)} className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Add to Cart & Buy Now Buttons (Single Row / Side-by-Side) */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-3 rounded-sm transition-all duration-300 font-sans text-[10.5px] sm:text-xs font-bold tracking-[0.16em] uppercase shadow-md ${
                    product.stock === 0 ? 'bg-brand-powder text-brand-navy/40 cursor-not-allowed' :
                    addedToCart ? 'bg-emerald-600 text-white shadow-lg' : 'bg-brand-teal hover:bg-brand-tealDark text-white hover:shadow-xl cursor-pointer'
                  }`}
                >
                  {addedToCart ? <Check size={15} strokeWidth={2.5} /> : <ShoppingBag size={15} strokeWidth={2} />}
                  <span className="truncate">{product.stock === 0 ? 'Sold Out' : (addedToCart ? 'Added' : 'Add to Bag')}</span>
                </button>

                {/* Direct Buy Now via WhatsApp Button */}
                <button
                  onClick={handleBuyNowWhatsApp}
                  disabled={product.stock === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-3 rounded-sm font-sans text-[10.5px] sm:text-xs uppercase tracking-[0.16em] font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={15} className="flex-shrink-0" />
                  <span className="truncate">Buy on WhatsApp</span>
                </button>
              </div>

              {/* Delivery Features */}
              <div className="flex flex-col gap-2.5 p-3.5 bg-brand-powderLight/50 border border-brand-powder/60 rounded-sm mb-5">
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
                      className="w-full flex items-center justify-between py-3.5 text-left group"
                    >
                      <span className="font-sans text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                        {acc.title}
                      </span>
                      <ChevronDown size={14} className={`text-brand-navy/40 transition-transform duration-300 ${openAccordion === acc.id ? 'rotate-180 text-brand-teal' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === acc.id ? 'max-h-40 pb-3.5 opacity-100' : 'max-h-0 opacity-0'}`}>
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

        {/* ── CUSTOMER REVIEWS SECTION ───────────────────────── */}
        <div id="customer-reviews-section" className="mt-6 sm:mt-8 pt-6 border-t border-brand-powder/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="font-sans text-[10px] text-brand-teal font-semibold tracking-[0.25em] uppercase mb-1 block">
                Customer Feedback
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light uppercase tracking-wider">
                Ratings & Reviews
              </h2>
            </div>
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  navigate('/login');
                  return;
                }
                setReviewModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-teal text-white font-sans text-xs uppercase tracking-wider px-6 py-3 rounded-sm transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <MessageSquare size={14} /> Write a Review
            </button>
          </div>

          {/* Rating Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-brand-powderLight/40 border border-brand-powder/60 p-5 sm:p-6 rounded-sm mb-5">
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-brand-powder/60 pb-6 md:pb-0 md:pr-6 text-center">
              <span className="font-serif text-5xl sm:text-6xl text-brand-navy font-light mb-2">{product.rating}</span>
              <div className="flex items-center gap-1 text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className={s <= Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'} />
                ))}
              </div>
              <p className="font-sans text-xs text-brand-navy/60">
                Based on {product.reviewsCount || reviewsList.length} verified buyer reviews
              </p>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center space-y-2 md:pl-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = rating === 5 ? 85 : rating === 4 ? 12 : rating === 3 ? 2 : rating === 2 ? 1 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3 text-xs font-sans text-brand-navy/70">
                    <span className="w-12 flex items-center gap-1">{rating} <Star size={11} className="fill-amber-400 text-amber-400" /></span>
                    <div className="flex-1 bg-brand-powder h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${count}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-brand-navy/50">{count}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Reviews List (Shows 1 Review by default) */}
          <div className="space-y-4">
            {(showAllReviews ? reviewsList : reviewsList.slice(0, 1)).map((rev) => (
              <div key={rev.id} className="p-5 sm:p-6 bg-white border border-brand-powder/60 rounded-sm shadow-2xs text-left">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-sm font-bold text-brand-navy">{rev.author}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-emerald-200">
                          <Check size={10} strokeWidth={3} /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-navy/50 font-sans">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= rev.rating ? 'fill-amber-400' : 'text-slate-300'} />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{rev.location}</span>
                      <span>•</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-serif text-base font-medium text-brand-navy mb-2">{rev.title}</h4>
                <p className="font-sans text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-light mb-4">
                  {rev.content}
                </p>

                <div className="flex items-center gap-4 text-xs font-sans text-brand-navy/50 pt-3 border-t border-brand-powder/40">
                  <span>Was this helpful?</span>
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      helpfulClicked[rev.id] ? 'text-brand-teal font-semibold' : 'hover:text-brand-navy'
                    }`}
                  >
                    <ThumbsUp size={12} /> ({rev.helpfulCount})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Toggle Expand / Collapse */}
          {reviewsList.length > 1 && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-white hover:bg-brand-teal hover:text-white border border-brand-teal text-brand-teal font-sans text-[11px] uppercase tracking-[0.18em] font-bold rounded-sm transition-all shadow-2xs hover:shadow-md cursor-pointer"
              >
                <span>{showAllReviews ? 'Show Fewer Reviews' : `Read All ${reviewsList.length} Reviews`}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showAllReviews ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* ── RELATED PRODUCTS ───────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 pt-6 border-t border-brand-powder/60">
            <span className="font-sans text-[10px] text-brand-teal font-semibold tracking-[0.25em] uppercase mb-1 block">
              Complete the Look
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light uppercase tracking-wider mb-5">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── FULL-SCREEN IMAGE LIGHTBOX MODAL ───────────────────────── */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setPreviewOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between z-10 text-white" onClick={e => e.stopPropagation()}>
            <div className="text-left">
              <h3 className="font-serif text-lg text-white font-light">{product.name}</h3>
              <p className="font-sans text-xs text-white/70">Photo {previewIndex + 1} of {galleryImages.length} • PID: {productIdCode}</p>
            </div>
            <button
              onClick={() => setPreviewOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>
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
        </div>
      )}

      {/* ── EXPRESS WHATSAPP CHECKOUT & ADDRESS MODAL ───────────────────────── */}
      {whatsappModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs overflow-y-auto"
          onClick={() => setWhatsappModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-md shadow-2xl w-full max-w-3xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-brand-navy text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-brand-navy/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-white flex items-center gap-2">
                    Express WhatsApp Order
                  </h3>
                  <p className="font-sans text-[10.5px] sm:text-xs text-brand-powder/80">
                    Provide your delivery address to generate your order invoice
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <form onSubmit={handleConfirmWhatsAppOrder} className="overflow-y-auto p-5 sm:p-7 space-y-6">
              
              {/* Order Item & Summary Card */}
              <div className="bg-brand-powderLight/40 border border-brand-powder/80 rounded-sm p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  
                  {/* Product Info */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={selectedColor === 0 ? product.image : (product.imageHover || product.image)}
                      alt={product.name}
                      className="w-16 h-20 sm:w-18 sm:h-22 object-cover object-top rounded-xs border border-brand-powder bg-white flex-shrink-0"
                    />
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-brand-powder/60 text-brand-navy border border-brand-powder/80 mb-1">
                        <span className="font-sans text-[9px] uppercase font-semibold text-brand-navy/70">Product ID:</span>
                        <span className="font-mono text-[11px] font-bold text-brand-teal">{productIdCode}</span>
                      </div>
                      <h4 className="font-serif text-base font-medium text-brand-navy line-clamp-1">{product.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-brand-navy/70 mt-1">
                        <span>Color: <strong className="text-brand-navy">{currentColorName}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-brand-navy">{selectedSize}</strong></span>
                        <span>•</span>
                        <span>Qty: <strong className="text-brand-navy">{quantity}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-brand-powder/60">
                    <span className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 block">Item Subtotal</span>
                    <span className="font-sans text-lg font-bold text-brand-navy">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Delivery Option Selector */}
                <div className="mt-4 pt-3.5 border-t border-brand-powder/60 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-center justify-between p-2.5 rounded-sm border cursor-pointer transition-all ${
                      whatsappDeliveryMethod === 'standard'
                        ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal'
                        : 'border-brand-powder bg-white hover:border-brand-teal/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="delivery_method"
                        checked={whatsappDeliveryMethod === 'standard'}
                        onChange={() => setWhatsappDeliveryMethod('standard')}
                        className="accent-brand-teal"
                      />
                      <div>
                        <p className="font-sans text-xs font-semibold text-brand-navy">Standard Delivery</p>
                        <p className="font-sans text-[10px] text-brand-navy/60">3-5 Business Days</p>
                      </div>
                    </div>
                    <span className="font-sans text-xs font-bold text-emerald-700">
                      {(product.price * quantity) >= 1999 ? 'FREE' : '₹150'}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-2.5 rounded-sm border cursor-pointer transition-all ${
                      whatsappDeliveryMethod === 'express'
                        ? 'border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal'
                        : 'border-brand-powder bg-white hover:border-brand-teal/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="delivery_method"
                        checked={whatsappDeliveryMethod === 'express'}
                        onChange={() => setWhatsappDeliveryMethod('express')}
                        className="accent-brand-teal"
                      />
                      <div>
                        <p className="font-sans text-xs font-semibold text-brand-navy">Express Delivery</p>
                        <p className="font-sans text-[10px] text-brand-navy/60">1-2 Business Days</p>
                      </div>
                    </div>
                    <span className="font-sans text-xs font-bold text-brand-navy">₹250</span>
                  </label>
                </div>
              </div>

              {/* Saved Addresses Quick Picker */}
              {savedAddresses.length > 0 && !isAddingNewAddress && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="font-sans text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand-teal" /> Select Delivery Address
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAddress(true);
                        setAddressForm({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          email: user?.email || '',
                          street: '',
                          apartment: '',
                          city: '',
                          state: '',
                          pincode: '',
                          saveForFuture: true,
                        });
                        setAddressErrors({});
                      }}
                      className="text-brand-teal font-sans text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3 rounded-sm border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-brand-teal bg-brand-teal/5 ring-2 ring-brand-teal/30 shadow-xs'
                            : 'border-brand-powder/80 bg-white hover:border-brand-teal/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-sans text-xs font-bold text-brand-navy">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-brand-powder/60 text-brand-navy px-1.5 py-0.5 rounded-xs font-semibold uppercase">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-brand-navy/70 line-clamp-2 leading-relaxed">
                          {addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="font-sans text-[11px] text-brand-navy/60 mt-1">📱 {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address Input Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-brand-navy flex items-center gap-1.5">
                    <MapPin size={14} className="text-brand-teal" />
                    {isAddingNewAddress ? 'New Delivery Address' : 'Recipient & Address Details'}
                  </h4>
                  {isAddingNewAddress && savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="text-brand-navy/60 hover:text-brand-navy text-xs font-sans font-semibold underline cursor-pointer"
                    >
                      Choose Saved Address
                    </button>
                  )}
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="font-sans text-[11px] font-semibold text-brand-navy block mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pooja Sharma"
                      value={addressForm.name}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, name: e.target.value });
                        if (addressErrors.name) setAddressErrors({ ...addressErrors, name: '' });
                      }}
                      className={`w-full border rounded-sm px-3 py-2 text-xs outline-none transition-colors ${
                        addressErrors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-brand-teal'
                      }`}
                    />
                    {addressErrors.name && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">{addressErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-sans text-[11px] font-semibold text-brand-navy block mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={addressForm.phone}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, phone: e.target.value });
                        if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: '' });
                      }}
                      className={`w-full border rounded-sm px-3 py-2 text-xs outline-none transition-colors ${
                        addressErrors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-brand-teal'
                      }`}
                    />
                    {addressErrors.phone && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">{addressErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="font-sans text-[11px] font-semibold text-brand-navy block mb-1">
                    Flat / House No. / Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 402, Sunshine Heights, 12th Main Road"
                    value={addressForm.street}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, street: e.target.value });
                      if (addressErrors.street) setAddressErrors({ ...addressErrors, street: '' });
                    }}
                    className={`w-full border rounded-sm px-3 py-2 text-xs outline-none transition-colors ${
                      addressErrors.street ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-brand-teal'
                    }`}
                  />
                  {addressErrors.street && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">{addressErrors.street}</p>
                  )}
                </div>

                {/* Apartment / Landmark */}
                <div>
                  <label className="font-sans text-[11px] font-semibold text-brand-navy block mb-1">
                    Apartment / Landmark / Locality <span className="text-brand-navy/40 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near HDFC Bank, Bandra West"
                    value={addressForm.apartment}
                    onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                    className="w-full border border-slate-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-teal"
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="font-sans text-[11px] font-semibold text-brand-navy block mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={addressForm.city}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, city: e.target.value });
                        if (addressErrors.city) setAddressErrors({ ...addressErrors, city: '' });
                      }}
                      className={`w-full border rounded-sm px-3 py-2 text-xs outline-none transition-colors ${
                        addressErrors.city ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-brand-teal'
                      }`}
                    />
                    {addressErrors.city && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">{addressErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-sans text-[11px] font-semibold text-brand-navy block mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={addressForm.state}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, state: e.target.value });
                        if (addressErrors.state) setAddressErrors({ ...addressErrors, state: '' });
                      }}
                      className={`w-full border rounded-sm px-3 py-2 text-xs outline-none transition-colors ${
                        addressErrors.state ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-brand-teal'
                      }`}
                    />
                    {addressErrors.state && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">{addressErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-sans text-[11px] font-semibold text-brand-navy block mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit PIN"
                      value={addressForm.pincode}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') });
                        if (addressErrors.pincode) setAddressErrors({ ...addressErrors, pincode: '' });
                      }}
                      className={`w-full border rounded-sm px-3 py-2 text-xs outline-none transition-colors ${
                        addressErrors.pincode ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-brand-teal'
                      }`}
                    />
                    {addressErrors.pincode && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">{addressErrors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* Save for future checkbox */}
                {isAddingNewAddress && (
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={addressForm.saveForFuture}
                      onChange={(e) => setAddressForm({ ...addressForm, saveForFuture: e.target.checked })}
                      className="accent-brand-teal rounded-xs"
                    />
                    <span className="font-sans text-xs text-brand-navy/80">Save this address to my account for future orders</span>
                  </label>
                )}
              </div>

              {/* Modal Footer / Action Button */}
              <div className="pt-4 border-t border-brand-powder/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-brand-navy/70 text-xs font-sans">
                  <ShieldCheck size={16} className="text-brand-teal" />
                  <span>Direct WhatsApp Concierge & Support</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setWhatsappModalOpen(false)}
                    className="w-1/3 sm:w-auto px-4 py-3 border border-brand-powder rounded-sm font-sans text-xs font-semibold text-brand-navy hover:bg-brand-powderLight transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 sm:w-auto flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>Confirm & Buy on WhatsApp</span>
                    <span className="ml-1 opacity-90">
                      (₹{((product.price * quantity) + (whatsappDeliveryMethod === 'express' ? 250 : ((product.price * quantity) >= 1999 ? 0 : 150))).toLocaleString('en-IN')})
                    </span>
                  </button>
                </div>
              </div>

            </form>
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
                    placeholder="e.g. Ananya Sharma"
                    className={`w-full border rounded-sm px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-teal ${
                      reviewErrors.name ? 'border-red-500' : 'border-slate-200'
                    }`}
                    value={newReview.name}
                    onChange={e => {
                      setNewReview({ ...newReview, name: e.target.value });
                      if (reviewErrors.name) setReviewErrors({ ...reviewErrors, name: '' });
                    }}
                  />
                  {reviewErrors.name && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {reviewErrors.name}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="font-sans text-xs font-semibold text-brand-navy block mb-1">Review Headline *</label>
                  <input
                    type="text"
                    placeholder="e.g. Gorgeous embroidery and fabric"
                    className={`w-full border rounded-sm px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-teal ${
                      reviewErrors.title ? 'border-red-500' : 'border-slate-200'
                    }`}
                    value={newReview.title}
                    onChange={e => {
                      setNewReview({ ...newReview, title: e.target.value });
                      if (reviewErrors.title) setReviewErrors({ ...reviewErrors, title: '' });
                    }}
                  />
                  {reviewErrors.title && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {reviewErrors.title}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="font-sans text-xs font-semibold text-brand-navy block mb-1">Your Review *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the fabric, fit, color accuracy, and overall experience..."
                    className={`w-full border rounded-sm px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-brand-teal resize-none ${
                      reviewErrors.comment ? 'border-red-500' : 'border-slate-200'
                    }`}
                    value={newReview.comment}
                    onChange={e => {
                      setNewReview({ ...newReview, comment: e.target.value });
                      if (reviewErrors.comment) setReviewErrors({ ...reviewErrors, comment: '' });
                    }}
                  />
                  {reviewErrors.comment && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {reviewErrors.comment}</p>
                  )}
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
