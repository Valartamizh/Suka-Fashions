import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products as fallbackProducts } from '../data/products';
import { Star, Heart, ShoppingBag, Truck, RefreshCw, ChevronDown, Check, ThumbsUp, MessageSquare, X, Send, ZoomIn, ChevronLeft, ChevronRight, Maximize2, MapPin, Plus, Copy, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Camera, Image as ImageIcon, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';

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
  const { getProductById, products, activeProducts } = useProducts();
  const [product, setProduct] = useState(null);
  
  // Interactive States
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart, cartCount } = useCart();
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
  const relatedScrollRef = useRef(null);
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
    image: null,
  });
  const [reviewImagePreview, setReviewImagePreview] = useState(null);
  const [reviewErrors, setReviewErrors] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleReviewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setReviewErrors((prev) => ({ ...prev, image: 'Image size should be under 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImagePreview(reader.result);
        setNewReview((prev) => ({ ...prev, image: reader.result }));
        setReviewErrors((prev) => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReviewImage = () => {
    setReviewImagePreview(null);
    setNewReview((prev) => ({ ...prev, image: null }));
  };

  // Determine product & initial variant states
  useEffect(() => {
    const all = products?.length > 0 ? products : fallbackProducts;
    const foundProduct = (getProductById && getProductById(id)) || all.find(p => p.id === id || p.slug === id) || all[0];
    setProduct(foundProduct);
    
    if (foundProduct) {
      const defaultColor = foundProduct.colors?.[0];
      const defaultColorId = defaultColor?.id || (foundProduct.colors?.[0] ? '0' : 'default');
      setSelectedColorId(defaultColorId);
      setSelectedImageIdx(0);
      const firstSize = defaultColor?.variants?.[0]?.size || foundProduct.sizes?.[0] || 'Free Size';
      setSelectedSize(firstSize);
      setQuantity(1);
      setAddedToCart(false);
      
      const related = (activeProducts || all).filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 8);
      setRelatedProducts(related);
    }
    
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id, products, getProductById, activeProducts]);

  // Derived normalized Color Variants list
  const colorsList = useMemo(() => {
    if (!product) return [];
    if (product.colors && product.colors.length > 0) {
      return product.colors.map((c, idx) => {
        if (typeof c === 'string') {
          return {
            id: `clr-${idx}`,
            name: getColorName(c, product, idx),
            hex: c,
            images: [
              { id: '1', url: idx === 0 ? product.image : (product.imageHover || product.image), isPrimary: true }
            ],
            variants: (product.sizes || ['Free Size']).map(s => ({
              size: s,
              sellingPrice: product.price,
              mrp: product.mrp || product.oldPrice,
              stock: product.stock,
              sku: `${product.sku || product.id}-${s}`
            }))
          };
        }
        return {
          ...c,
          id: c.id || `clr-${idx}`,
          name: c.name || getColorName(c.hex, product, idx),
          hex: c.hex || '#006B70',
          images: (c.images && c.images.length > 0) ? c.images : [{ id: '1', url: product.image, isPrimary: true }],
          variants: (c.variants && c.variants.length > 0) ? c.variants : [{ size: 'Free Size', sellingPrice: product.price, mrp: product.mrp, stock: product.stock }]
        };
      });
    }
    return [{
      id: 'default',
      name: 'Standard',
      hex: '#006B70',
      images: [{ id: '1', url: product.image, isPrimary: true }],
      variants: [{ size: 'Free Size', sellingPrice: product.price, mrp: product.mrp, stock: product.stock }]
    }];
  }, [product]);

  const activeColor = colorsList.find(c => c.id === selectedColorId) || colorsList[0] || {};
  const activeGalleryImages = (activeColor.images || []).map(img => typeof img === 'string' ? img : img.url).filter(Boolean);
  if (activeGalleryImages.length === 0 && product?.image) {
    activeGalleryImages.push(product.image);
  }

  const activeSizes = activeColor.variants || [];
  const currentVariant = activeSizes.find(v => v.size === selectedSize) || activeSizes[0] || {};
  const currentPrice = currentVariant.sellingPrice || product?.price || 0;
  const currentMrp = currentVariant.mrp || product?.mrp || product?.oldPrice || 0;
  const currentStock = currentVariant.stock !== undefined ? Number(currentVariant.stock) : (product?.stock || 0);
  const currentColorName = activeColor.name || 'Standard';
  const currentColorHex = activeColor.hex || '#006B70';
  const displayImage = activeGalleryImages[selectedImageIdx] || activeGalleryImages[0] || product?.image;

  // Handle color switch
  const handleColorSelect = (colorObj) => {
    setSelectedColorId(colorObj.id);
    setSelectedImageIdx(0);
    if (colorObj.variants && colorObj.variants.length > 0) {
      const match = colorObj.variants.find(v => v.size === selectedSize && Number(v.stock) > 0) || colorObj.variants.find(v => Number(v.stock) > 0) || colorObj.variants[0];
      setSelectedSize(match.size);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: product.id,
      productId: product.id,
      colorId: activeColor.id,
      colorName: currentColorName,
      colorHex: currentColorHex,
      size: selectedSize,
      price: currentPrice,
      sellingPrice: currentPrice,
      mrp: currentMrp,
      image: activeGalleryImages[0] || product.image,
      selectedColorImage: activeGalleryImages[0] || product.image,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

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

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-white">
        <div className="w-10 h-10 border-3 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="font-serif text-lg font-bold text-slate-800 mb-1">Loading Product Details...</h2>
        <p className="text-xs text-slate-500 mb-5">Fetching fabric specifications, images & size options</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal text-white text-xs font-bold rounded-lg shadow-xs hover:bg-brand-tealDark transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Products
        </Link>
      </div>
    );
  }

  const productIdCode = product.productId || product.sku || (product.id ? `SUK-${product.id.toString().substring(0, 6).toUpperCase()}` : 'SUK-001');

  const openPreviewModal = (index) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const nextPreview = () => {
    setPreviewIndex((prev) => (prev + 1) % (activeGalleryImages.length || 1));
  };

  const prevPreview = () => {
    setPreviewIndex((prev) => (prev - 1 + (activeGalleryImages.length || 1)) % (activeGalleryImages.length || 1));
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

    let deliveryAddress = { ...addressForm };

    // If using a saved address, grab from saved addresses without form validation
    if (savedAddresses.length > 0 && !isAddingNewAddress) {
      const selected = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
      if (selected) {
        deliveryAddress = {
          name: selected.name,
          phone: selected.phone,
          email: selected.email || user?.email || '',
          street: selected.street,
          apartment: selected.apartment || '',
          city: selected.city,
          state: selected.state,
          pincode: selected.pincode,
        };
      }
    } else {
      if (!validateAddressForm()) return;
      deliveryAddress = { ...addressForm };

      // Save to saved addresses
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

    const subtotal = product.price * quantity;
    const total = subtotal;
    const orderId = `SUKA-${Math.floor(10000 + Math.random() * 90000)}`;

    // Save order in OrderContext
    const createdOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      total: total,
      subtotal: subtotal,
      shipping: 0,
      paymentMethod: 'WhatsApp Express Order',
      items: [
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: quantity,
          selectedSize: selectedSize,
          selectedColor: currentColorName,
          image: product.image,
        },
      ],
      address: deliveryAddress,
    };
    addOrder(createdOrder);

    // Format WhatsApp Message
    const rawImg = product.image || '';
    const imgUrl = rawImg.startsWith('http')
      ? rawImg
      : rawImg.startsWith('/')
      ? `${window.location.origin}${rawImg}`
      : `${window.location.origin}/${rawImg}`;

    const fullAddress = `${deliveryAddress.street}${deliveryAddress.apartment ? ', ' + deliveryAddress.apartment : ''}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`;

    const whatsappMsg = encodeURIComponent(
      `*🛍️ NEW ORDER - SUKA FASHIONS*\n` +
      `═══════════════════════════\n` +
      `*Order ID:* ${orderId}\n` +
      `*Product:* ${product.name}\n` +
      `*Category:* ${product.category.toUpperCase()}\n` +
      `*Color:* ${currentColorName}\n` +
      `*Size:* ${selectedSize}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Item Price:* ₹${subtotal.toLocaleString('en-IN')}\n` +
      `*TOTAL AMOUNT:* ₹${total.toLocaleString('en-IN')}\n` +
      `═══════════════════════════\n` +
      `*📦 DELIVERY ADDRESS:*\n` +
      `*Recipient:* ${deliveryAddress.name}\n` +
      `*Mobile Number:* ${deliveryAddress.phone}\n` +
      `${deliveryAddress.email ? `*Email:* ${deliveryAddress.email}\n` : ''}` +
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
      location: 'Customer',
      rating: Number(newReview.rating),
      date: 'Just now',
      verified: true,
      title: newReview.title || 'Great Product!',
      content: newReview.comment,
      image: newReview.image || null,
      helpfulCount: 0,
    };

    setReviewsList([createdReview, ...reviewsList]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOpen(false);
      setNewReview({ rating: 5, name: '', title: '', comment: '', image: null });
      setReviewImagePreview(null);
      setReviewErrors({});
    }, 2000);
  };

  return (
    <div className="bg-white pb-0">

      {/* ── MOBILE HERO & PRODUCT SHEET (Matching Image 2 Reference) ── */}
      <div className="lg:hidden w-full text-left">
        {/* 1. Full-Bleed Edge-to-Edge Hero Image */}
        <div 
          onClick={() => openPreviewModal(selectedImageIdx)}
          className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-brand-cream/40 overflow-hidden cursor-zoom-in"
        >
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover object-top"
          />

          {/* Floating Top Header Over Image: Back (Left), Wishlist & Cart (Right) */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/products');
                }
              }}
              className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-brand-navy hover:bg-white active:scale-95 transition-all cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>

            <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist({
                    ...product,
                    image: displayImage,
                    colorName: currentColorName,
                    colorId: activeColor.id,
                  });
                }}
                className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-brand-navy hover:bg-white active:scale-95 transition-all cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  strokeWidth={isInWishlist(product.id) ? 0 : 1.8}
                  className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-brand-navy'}
                />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/cart');
                }}
                className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-brand-navy hover:bg-white active:scale-95 transition-all relative cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-teal text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-sans">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Floating Next and Prev Navigation Arrows */}
          {activeGalleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIdx((prev) => (prev === 0 ? activeGalleryImages.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 backdrop-blur-xs border border-white/60 shadow-xs text-brand-navy/80 flex items-center justify-center transition-all hover:bg-white/90 hover:text-brand-navy active:scale-90 z-20 cursor-pointer opacity-70 hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIdx((prev) => (prev + 1) % activeGalleryImages.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 backdrop-blur-xs border border-white/60 shadow-xs text-brand-navy/80 flex items-center justify-center transition-all hover:bg-white/90 hover:text-brand-navy active:scale-90 z-20 cursor-pointer opacity-70 hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </>
          )}

          {/* Image switch indicator dots */}
          {activeGalleryImages.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-2 z-10">
              {activeGalleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    selectedImageIdx === idx ? 'w-6 bg-white shadow-sm' : 'w-2 bg-white/60'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Clean Product Info Card (Mobile) */}
        <div className="bg-[#FAF8F5] p-5 sm:p-6 border-b border-brand-powder/40 text-left">
          {/* Eyebrow Series */}
          <p className="font-sans text-[10.5px] font-bold text-emerald-800 tracking-[0.2em] uppercase mb-1.5">
            SUKA COUTURE • {product.category?.toUpperCase()}
          </p>

          {/* Product Title */}
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brand-navy leading-tight mb-2">
            {product.name}
          </h1>

          {/* Tagline / Subtitle */}
          <p className="font-serif text-xs sm:text-sm italic text-brand-navy/80 mb-3">
            "{product.tagline || product.shortDescription || product.description?.slice(0, 90) || 'Grace in every drape • Intricate handcrafted artistry'}..."
          </p>

          {/* Color Selection (Mobile) */}
          {colorsList && colorsList.length > 0 && (
            <div className="mb-4">
              <span className="font-sans text-[10px] font-bold tracking-[0.18em] uppercase text-brand-navy mb-2 block">
                COLOR: <span className="text-brand-teal uppercase">{currentColorName}</span>
              </span>
              <div className="flex items-center gap-2.5">
                {colorsList.map((colorObj) => {
                  const isWhite = colorObj.hex?.toUpperCase() === '#FFFFFF' || colorObj.hex?.toUpperCase() === '#FFFFF0';
                  const isSelected = activeColor.id === colorObj.id;
                  return (
                    <button
                      key={colorObj.id}
                      type="button"
                      onClick={() => handleColorSelect(colorObj)}
                      title={colorObj.name}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-brand-teal ring-offset-2 scale-105'
                          : 'ring-1 ring-slate-300'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-full ${
                          isWhite ? 'border-2 border-slate-300 bg-white' : 'border border-black/10'
                        }`}
                        style={{ backgroundColor: colorObj.hex || '#006B70' }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant / Size Selector (Mobile) */}
          {activeSizes && activeSizes.length > 0 && (
            <div className="mb-4">
              <span className="font-sans text-[10px] font-bold tracking-[0.18em] uppercase text-brand-navy mb-2.5 block">
                SIZE: <span className="text-brand-teal uppercase">{selectedSize}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {activeSizes.map((variant) => {
                  const isOutOfStock = Number(variant.stock) <= 0;
                  const isSelected = selectedSize === variant.size;
                  return (
                    <button
                      key={variant.size}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`px-5 py-2 text-xs font-bold rounded-lg transition-all border ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#1B2559] text-white border-[#1B2559] shadow-sm'
                          : 'bg-white text-brand-navy border-slate-300 hover:border-brand-teal'
                      }`}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
              {/* Stock Alert (Mobile): Only show when Out of Stock or Low Stock (<= 5) */}
              {currentStock === 0 && (
                <div className="mt-3 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  <span className="font-sans text-xs font-bold tracking-wide">
                    Out of Stock
                  </span>
                </div>
              )}
              {currentStock > 0 && currentStock <= 5 && (
                <div className="mt-3 flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 animate-ping" />
                  <span className="font-sans text-xs font-bold tracking-wide">
                    Hurry! Only {currentStock} left in stock — Order soon
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-sans text-2xl font-bold text-brand-navy">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {currentMrp > currentPrice && (
              <span className="font-sans text-sm text-brand-navy/40 line-through">
                ₹{currentMrp.toLocaleString('en-IN')}
              </span>
            )}
            {currentMrp > currentPrice && (
              <span className="font-sans text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-xs">
                {Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className={`w-full py-3 px-2 rounded-md font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-md ${
                currentStock === 0
                  ? 'bg-brand-powder text-brand-navy/40 cursor-not-allowed'
                  : addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-teal hover:bg-brand-tealDark text-white cursor-pointer'
              }`}
            >
              {currentStock === 0 ? 'Out of Stock' : addedToCart ? '✓ Added' : 'Add to Bag'}
            </button>

            <button
              type="button"
              onClick={handleBuyNowWhatsApp}
              disabled={currentStock === 0}
              className="w-full py-3 px-2 rounded-md font-sans text-xs font-bold tracking-wider uppercase bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shadow-md cursor-pointer"
            >
              Buy on WhatsApp
            </button>
          </div>

          {/* Delivery Features (Mobile) */}
          <div className="flex flex-col gap-2 p-3 bg-brand-powderLight/60 border border-brand-powder/60 rounded-md mb-4">
            <div className="flex items-center gap-2.5">
              <Truck size={14} className="text-brand-teal flex-shrink-0" />
              <span className="font-sans text-[11px] text-brand-navy/80 tracking-wide">
                {product.shippingInfo || 'Free Shipping within India on orders above ₹1999'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw size={14} className="text-brand-teal flex-shrink-0" />
              <span className="font-sans text-[11px] text-brand-navy/80 tracking-wide">
                {product.returnInfo || '7 Days easy returns and exchanges'}
              </span>
            </div>
          </div>

          {/* Accordions (Mobile) */}
          <div className="border-t border-brand-powder/60 divide-y divide-brand-powder/40">
            {[
              { id: 'details', title: 'Product Description', content: product.description || 'Elevate your celebratory ensemble with this handcrafted creation.' },
              { id: 'fabric', title: 'Material & Care', content: product.materialCare || (product.fabric ? `Fabric: ${product.fabric}. ${product.careInstructions || 'Dry clean only. Do not bleach. Iron on low heat.'}` : 'Fabric: Premium Blend. Dry clean only. Do not bleach. Iron on low heat.') },
              { id: 'shipping', title: 'Shipping & Returns', content: product.shippingReturns || 'Dispatched within 24-48 hours. Delivered in 3-5 business days. 7-day hassle-free return policy.' },
            ].map((acc) => (
              <div key={acc.id} className="py-0.5">
                <button 
                  type="button"
                  onClick={() => toggleAccordion(acc.id)}
                  className="w-full flex items-center justify-between py-3 text-left group cursor-pointer"
                >
                  <span className="font-sans text-[11px] uppercase tracking-[0.16em] font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                    {acc.title}
                  </span>
                  <ChevronDown size={14} className={`text-brand-navy/40 transition-transform duration-300 ${openAccordion === acc.id ? 'rotate-180 text-brand-teal' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordion === acc.id ? 'max-h-60 pb-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="font-sans text-xs text-brand-navy/70 leading-relaxed font-light whitespace-pre-line">
                    {acc.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP & SHARED DETAILS CONTAINER ── */}
      <div className="max-w-[1520px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 pt-0 sm:pt-4 pb-6 text-left">
        
        {/* Breadcrumbs (Desktop Only) */}
        <nav className="hidden lg:flex text-[10px] font-sans text-brand-navy/50 uppercase tracking-[0.2em] mb-4 lg:mb-5 items-center flex-wrap gap-2">
          <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-teal transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-brand-teal transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold truncate max-w-[240px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Main Product Layout: Balanced 2-Column Grid (Desktop) */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
          
          {/* Left Side: Images Gallery (6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 w-full flex flex-col gap-3.5">
            <div 
              onClick={() => openPreviewModal(selectedImageIdx)}
              className="w-full aspect-[3/4] sm:aspect-[4/5] lg:h-[660px] xl:h-[720px] 2xl:h-[760px] overflow-hidden border border-brand-powder/50 rounded-sm shadow-sm bg-brand-cream/30 relative group cursor-zoom-in"
            >
              <img 
                src={displayImage} 
                alt={product.name} 
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Navigation Arrows on Main Image */}
              {activeGalleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIdx((prev) => (prev === 0 ? activeGalleryImages.length - 1 : prev - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-brand-navy shadow-md flex items-center justify-center transition-all opacity-70 hover:opacity-100 z-10 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIdx((prev) => (prev + 1) % activeGalleryImages.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-brand-navy shadow-md flex items-center justify-center transition-all opacity-70 hover:opacity-100 z-10 cursor-pointer"
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
                  toggleWishlist({
                    ...product,
                    image: displayImage,
                    colorName: currentColorName,
                    colorId: activeColor.id,
                  });
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
                  openPreviewModal(selectedImageIdx);
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
            {activeGalleryImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {activeGalleryImages.map((imgUrl, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)} 
                    className={`w-18 h-22 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden border bg-brand-cream/20 rounded-sm transition-all cursor-pointer ${
                      selectedImageIdx === idx ? 'border-brand-teal ring-2 ring-brand-teal/40' : 'border-brand-powder/60 opacity-70 hover:opacity-100 hover:border-brand-teal'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover object-top rounded-xs" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Info & Actions (6 Cols, Sticky) */}
          <div className="lg:col-span-6 xl:col-span-6 w-full">
            <div className="sticky top-[100px]">
              
              {/* Brand Header */}
              <div className="mb-2">
                <span className="font-sans text-[10px] text-brand-teal font-bold tracking-[0.25em] uppercase">
                  Suka Fashions
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] leading-tight text-brand-navy font-light mb-1.5">
                {product.name}
              </h1>

              {/* Tagline */}
              <p className="font-serif text-sm sm:text-base italic text-brand-navy/70 mb-3.5">
                "{product.tagline || product.shortDescription || product.description?.slice(0, 95) || 'Grace in every drape • Intricate handcrafted artistry'}..."
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 sm:gap-4 mb-3">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-brand-navy">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentMrp > currentPrice && (
                  <span className="font-sans text-sm sm:text-base text-brand-navy/40 line-through">
                    ₹{currentMrp.toLocaleString('en-IN')}
                  </span>
                )}
                {currentMrp > currentPrice && (
                  <span className="font-sans text-xs font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-xs">
                    {Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Rating & Review Count */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-brand-powder/60">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-brand-powder'} strokeWidth={1} />
                  ))}
                </div>
                <span className="font-sans text-xs text-brand-navy/60 font-medium">
                  {product.rating || 4.8} ({product.reviewsCount || reviewsList.length} reviews)
                </span>
              </div>

              {/* Color Selection (Desktop) */}
              {colorsList && colorsList.length > 0 && (
                <div className="mb-5">
                  <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-navy mb-2.5 block">
                    COLOR: <span className="font-bold text-brand-teal capitalize ml-1.5">{currentColorName}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {colorsList.map((colorObj) => {
                      const isWhite = colorObj.hex?.toUpperCase() === '#FFFFFF' || colorObj.hex?.toUpperCase() === '#FFFFF0';
                      const isSelected = activeColor.id === colorObj.id;
                      return (
                        <button
                          key={colorObj.id}
                          type="button"
                          onClick={() => handleColorSelect(colorObj)}
                          title={colorObj.name}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-brand-teal ring-offset-2 scale-105'
                              : 'ring-1 ring-slate-300 hover:ring-brand-teal'
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full shadow-xs ${
                              isWhite ? 'border-2 border-slate-300 bg-white' : 'border border-black/10'
                            }`}
                            style={{ backgroundColor: colorObj.hex || '#006B70' }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selection (Desktop) */}
              {activeSizes && activeSizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-navy">
                      Size
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {activeSizes.map((variant) => {
                      const isOutOfStock = Number(variant.stock) <= 0;
                      const isSelected = selectedSize === variant.size;
                      return (
                        <button
                          key={variant.size}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => setSelectedSize(variant.size)}
                          className={`min-w-[48px] h-10 px-3 flex items-center justify-center font-sans text-xs uppercase tracking-wider rounded-sm transition-all duration-200 border cursor-pointer ${
                            isOutOfStock
                              ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                              : isSelected
                              ? 'bg-brand-navy text-white border-brand-navy font-semibold shadow-md'
                              : 'bg-white text-brand-navy border-brand-powder hover:border-brand-teal hover:text-brand-teal'
                          }`}
                        >
                          {variant.size}
                        </button>
                      );
                    })}
                  </div>
                  {/* Stock Alert (Desktop): Only show when Out of Stock or Low Stock (<= 5) with prominent font */}
                  {currentStock === 0 && (
                    <div className="mt-3.5 flex items-center gap-2.5 text-red-700 bg-red-50 border border-red-200 px-3.5 py-2 rounded-md shadow-2xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                      <span className="font-sans text-xs sm:text-sm font-bold tracking-wide">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {currentStock > 0 && currentStock <= 5 && (
                    <div className="mt-3.5 flex items-center gap-2.5 text-amber-800 bg-amber-50/90 border border-amber-200 px-3.5 py-2 rounded-md shadow-2xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 animate-ping" />
                      <span className="font-sans text-xs sm:text-sm font-bold tracking-wide">
                        Hurry! Only {currentStock} left in stock — Order soon
                      </span>
                    </div>
                  )}
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
                      Order details and delivery address have been sent to WhatsApp!
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
                  <span className="font-sans text-[11px] text-brand-navy/70 tracking-wide">
                    {product.shippingInfo || 'Free Shipping within India on orders above ₹1999'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw size={15} className="text-brand-teal" />
                  <span className="font-sans text-[11px] text-brand-navy/70 tracking-wide">
                    {product.returnInfo || '7 Days easy returns and exchanges'}
                  </span>
                </div>
              </div>

              {/* Accordions */}
              <div className="border-t border-brand-powder/60">
                {[
                  { id: 'details', title: 'Product Description', content: product.description || 'Elevate your celebratory ensemble with this handcrafted creation.' },
                  { id: 'fabric', title: 'Material & Care', content: product.materialCare || (product.fabric ? `Fabric: ${product.fabric}. ${product.careInstructions || 'Dry clean only. Do not bleach. Iron on low heat.'}` : 'Fabric: Premium Blend. Dry clean only. Do not bleach. Iron on low heat.') },
                  { id: 'shipping', title: 'Shipping & Returns', content: product.shippingReturns || 'Dispatched within 24-48 hours. Delivered in 3-5 business days. 7-day hassle-free return policy.' },
                ].map((acc) => (
                  <div key={acc.id} className="border-b border-brand-powder/60">
                    <button 
                      onClick={() => toggleAccordion(acc.id)}
                      className="w-full flex items-center justify-between py-3.5 text-left group cursor-pointer"
                    >
                      <span className="font-sans text-[11px] uppercase tracking-[0.18em] font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                        {acc.title}
                      </span>
                      <ChevronDown size={14} className={`text-brand-navy/40 transition-transform duration-300 ${openAccordion === acc.id ? 'rotate-180 text-brand-teal' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordion === acc.id ? 'max-h-60 pb-3.5 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="font-sans text-xs text-brand-navy/70 leading-relaxed font-light whitespace-pre-line">
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
        <div id="customer-reviews-section" className="mt-2 sm:mt-8 pt-3 sm:pt-6 border-t border-brand-powder/60">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="font-sans text-[9px] sm:text-[10px] text-brand-teal font-semibold tracking-[0.25em] uppercase mb-0.5 block">
                Customer Feedback
              </span>
              <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl text-brand-navy font-light uppercase tracking-wider leading-tight">
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
              className="inline-flex items-center gap-1.5 bg-brand-navy hover:bg-brand-teal text-white font-sans text-[10px] sm:text-xs uppercase tracking-wider px-3 py-2 sm:px-5 sm:py-2.5 rounded-sm transition-colors shadow-xs flex-shrink-0 cursor-pointer"
            >
              <MessageSquare size={13} /> <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 bg-brand-powderLight/40 border border-brand-powder/60 p-3.5 sm:p-6 rounded-sm mb-3 sm:mb-4">
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-brand-powder/60 pb-3 md:pb-0 md:pr-6 text-center">
              <span className="font-serif text-4xl sm:text-6xl text-brand-navy font-light mb-1">{product.rating}</span>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} className={s <= Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'} />
                ))}
              </div>
              <p className="font-sans text-[11px] sm:text-xs text-brand-navy/60">
                Based on {product.reviewsCount || reviewsList.length} customer reviews
              </p>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center space-y-1.5 md:pl-4">
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
                <p className="font-sans text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-light mb-3">
                  {rev.content}
                </p>

                {/* Customer Uploaded Review Photo */}
                {rev.image && (
                  <div className="mb-4">
                    <img
                      src={rev.image}
                      alt="Customer review photo"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-md border border-brand-powder shadow-xs hover:opacity-90 transition-opacity cursor-zoom-in"
                      onClick={() => window.open(rev.image, '_blank')}
                      title="Click to view full image"
                    />
                  </div>
                )}

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
          <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-brand-powder/60 pb-2">
            <div className="flex items-end justify-between mb-3.5">
              <div>
                <span className="font-sans text-[9px] sm:text-[10px] text-brand-teal font-semibold tracking-[0.25em] uppercase mb-0.5 block">
                  Complete the Look
                </span>
                <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl text-brand-navy font-light uppercase tracking-wider">
                  You May Also Like
                </h2>
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (relatedScrollRef.current) {
                      relatedScrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
                    }
                  }}
                  className="p-1.5 sm:p-2 border border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white rounded-sm transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (relatedScrollRef.current) {
                      relatedScrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
                    }
                  }}
                  className="p-1.5 sm:p-2 border border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white rounded-sm transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Carousel Slider */}
            <div
              ref={relatedScrollRef}
              className="flex overflow-x-auto gap-3 sm:gap-6 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory"
            >
              {relatedProducts.map((rel) => (
                <div key={rel.id} className="flex-none w-[190px] sm:w-[250px] lg:w-[calc(25%-1.2rem)] snap-start flex flex-col h-full">
                  <ProductCard product={rel} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── FULL-SCREEN IMAGE LIGHTBOX MODAL ───────────────────────── */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-fade-in"
          onClick={() => setPreviewOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between z-10 text-white" onClick={e => e.stopPropagation()}>
            <div className="text-left">
              <h3 className="font-serif text-lg text-white font-light">{product.name}</h3>
              <p className="font-sans text-xs text-white/70">Photo {previewIndex + 1} of {activeGalleryImages.length}</p>
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
            {activeGalleryImages.length > 1 && (
              <button
                onClick={prevPreview}
                className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-brand-teal text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-lg cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div className="max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
              <img
                src={activeGalleryImages[previewIndex] || displayImage}
                alt={`${product.name} preview angle ${previewIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-sm shadow-2xl transition-all duration-300"
              />
            </div>

            {activeGalleryImages.length > 1 && (
              <button
                onClick={nextPreview}
                className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-brand-teal text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-lg cursor-pointer"
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
                      src={displayImage || product.image}
                      alt={product.name}
                      className="w-16 h-20 sm:w-18 sm:h-22 object-cover object-top rounded-xs border border-brand-powder bg-white flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-serif text-base sm:text-lg font-medium text-brand-navy line-clamp-1">{product.name}</h4>
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
                    <span className="font-sans text-lg sm:text-xl font-bold text-brand-navy">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Saved Addresses Quick Picker (When user has saved addresses) */}
              {savedAddresses.length > 0 && !isAddingNewAddress ? (
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

                  <div className="grid grid-cols-1 gap-2.5">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-sm border cursor-pointer transition-all ${
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
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-powder/50">
                          <span className="font-sans text-[11px] text-brand-navy/60">📱 {addr.phone}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddressForm({
                                name: addr.name || '',
                                phone: addr.phone || '',
                                email: addr.email || user?.email || '',
                                street: addr.street || '',
                                apartment: addr.apartment || '',
                                city: addr.city || '',
                                state: addr.state || '',
                                pincode: addr.pincode || '',
                                saveForFuture: true,
                              });
                              setAddressErrors({});
                              setIsAddingNewAddress(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-brand-teal/80 text-brand-teal hover:bg-brand-teal hover:text-white rounded-xs font-sans text-[11px] font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
                          >
                            <Eye size={12} />
                            <span>View & Edit</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Address Input Form (First time or when adding new address) */
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
                        Use Saved Address
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
              )}

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
                      (₹{(product.price * quantity).toLocaleString('en-IN')})
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

                {/* Upload Review Photo (Optional) */}
                <div>
                  <label className="font-sans text-xs font-semibold text-brand-navy block mb-1.5">
                    Add Product Photo <span className="font-normal text-slate-400 font-sans text-[11px]">(Optional)</span>
                  </label>

                  {reviewImagePreview ? (
                    <div className="relative inline-block border border-brand-teal/30 rounded-md p-1 bg-brand-cream/20">
                      <img
                        src={reviewImagePreview}
                        alt="Review upload preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-sm shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={removeReviewImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
                        title="Remove photo"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 border border-dashed border-brand-powder hover:border-brand-teal bg-brand-powderLight/30 hover:bg-brand-cream/20 rounded-sm py-3 px-4 cursor-pointer transition-colors group">
                      <Camera size={16} className="text-brand-teal group-hover:scale-110 transition-transform" />
                      <span className="font-sans text-xs font-semibold text-brand-teal">
                        Attach Product Photo
                      </span>
                      <span className="font-sans text-[10px] text-brand-navy/50">(JPG, PNG, WEBP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReviewImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {reviewErrors.image && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {reviewErrors.image}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white font-sans text-xs font-bold uppercase tracking-wider py-3.5 rounded-sm transition-colors shadow-md mt-4 cursor-pointer"
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
