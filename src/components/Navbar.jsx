import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingBag, ChevronDown, LogOut, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.jpg';
import SearchOverlay from './SearchOverlay';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import ConfirmationModal from './ConfirmationModal';

// Import local assets for mega menu cards
import sareeGolden from '../assets/saree_golden.jpg';
import kurtiPurplePrinted from '../assets/kurti_purple_printed.jpg';
import lehengaRed from '../assets/lehenga_red.jpg';
import dressNavy from '../assets/dress_navy.jpg';

const navItems = [
  { name: 'New Arrivals', path: '/products?sort=newest' },
  {
    name: 'Sarees',
    path: '/category/sarees',
    dropdown: [
      { label: 'Silk Sarees',       path: '/products?category=sarees&fabric=Silk' },
      { label: 'Organza Sarees',    path: '/products?category=sarees&fabric=Organza' },
      { label: 'Georgette Sarees',  path: '/products?category=sarees&fabric=Georgette' },
      { label: 'Cotton Sarees',     path: '/products?category=sarees&fabric=Cotton' },
      { label: 'Banarasi Sarees',   path: '/products?category=sarees&fabric=Banarasi' },
      { label: 'Party Wear Sarees', path: '/products?category=sarees&occasion=Party' },
      { label: 'Wedding Sarees',    path: '/products?category=sarees&occasion=Wedding' },
    ],
    megaImage: sareeGolden,
    megaTitle: 'The Saree Edit',
    megaLink: '/category/sarees'
  },
  {
    name: 'Kurtis',
    path: '/category/kurtis',
    dropdown: [
      { label: 'Cotton Kurti Sets',  path: '/products?category=kurtis&fabric=Cotton' },
      { label: 'Anarkali Kurtis',    path: '/products?category=kurtis&sub=Anarkali' },
      { label: 'Printed Kurtis',     path: '/products?category=kurtis&sub=Printed' },
      { label: 'Silk Kurta Sets',    path: '/products?category=kurtis&fabric=Silk' },
      { label: 'Office Wear Kurtis', path: '/products?category=kurtis&occasion=Office' },
    ],
    megaImage: kurtiPurplePrinted,
    megaTitle: 'Everyday Elegance',
    megaLink: '/category/kurtis'
  },
  {
    name: 'Lehengas',
    path: '/category/lehengas',
    dropdown: [
      { label: 'Bridal Lehengas',   path: '/products?category=lehengas&occasion=Wedding' },
      { label: 'Organza Lehengas',  path: '/products?category=lehengas&fabric=Organza' },
      { label: 'Haldi Lehengas',     path: '/products?category=lehengas&occasion=Haldi' },
      { label: 'Net Lehengas',       path: '/products?category=lehengas&fabric=Net' },
      { label: 'Sequin Lehengas',    path: '/products?category=lehengas&sub=Sequin' },
    ],
    megaImage: lehengaRed,
    megaTitle: 'Heritage Lehengas',
    megaLink: '/category/lehengas'
  },
  {
    name: 'Dresses',
    path: '/category/dresses',
    dropdown: [
      { label: 'Anarkali Dresses', path: '/products?category=dresses&sub=Anarkali' },
      { label: 'Maxi Dresses',     path: '/products?category=dresses&sub=Maxi' },
      { label: 'Evening Gowns',    path: '/products?category=dresses&sub=Gown' },
      { label: 'Tunic Dresses',    path: '/products?category=dresses&sub=Tunic' },
    ],
    megaImage: dressNavy,
    megaTitle: 'Contemporary Silhouettes',
    megaLink: '/category/dresses'
  },
  {
    name: 'Occasion',
    path: '/category/occasion',
    dropdown: [
      { label: 'Wedding',         path: '/products?occasion=Wedding' },
      { label: 'Festive',         path: '/products?occasion=Festive' },
      { label: 'Party',           path: '/products?occasion=Party' },
      { label: 'Casual',          path: '/products?occasion=Casual' },
      { label: 'Office',          path: '/products?occasion=Office' },
      { label: 'Haldi / Mehendi',  path: '/products?occasion=Haldi' },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled]               = useState(false);
  const [searchOpen, setSearchOpen]           = useState(false);
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [activeDropdown, setActiveDropdown]   = useState(null);
  const [mobileExpanded, setMobileExpanded]   = useState(null);
  const [accountDropdown, setAccountDropdown] = useState(false);

  // Live Header Search States
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchFocused, setSearchFocused]     = useState(false);
  const searchRef                             = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownTimerRef = useRef(null);
  const accountRef       = useRef(null);

  const { user, isLoggedIn, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: () => {},
  });

  const handleLogoutRequest = () => {
    setAccountDropdown(false);
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Sign Out?',
      message: 'Are you sure you want to sign out of your account?',
      confirmText: 'Sign Out',
      onConfirm: () => {
        logout();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        navigate('/');
      },
    });
  };

  // Scroll listener for sticky compact navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for open search overlay events (e.g. from Mobile Bottom Nav)
  useEffect(() => {
    const handleOpenSearch = () => setSearchOpen(true);
    window.addEventListener('open-search-overlay', handleOpenSearch);
    return () => window.removeEventListener('open-search-overlay', handleOpenSearch);
  }, []);

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setAccountDropdown(false);
    setSearchFocused(false);
  }, [location.pathname]);

  // Close account dropdown & search popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.fabric && p.fabric.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.occasion && p.occasion.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMouseEnter = (name) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const isNavActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          scrolled
            ? 'shadow-[0_4px_24px_rgba(0,0,0,0.07)] border-b border-brand-powder/60'
            : 'border-b border-brand-powder/40'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          
          {/* Mobile Product Page Header with Back Button */}
          {isProductPage && (
            <div className="lg:hidden flex items-center justify-between h-14 w-full">
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/products');
                  }
                }}
                className="flex items-center gap-1.5 p-1.5 -ml-1 text-brand-navy hover:text-brand-teal transition-colors rounded-full active:bg-brand-cream/50 cursor-pointer"
                aria-label="Go back to products"
              >
                <ArrowLeft size={20} strokeWidth={2} />
                <span className="font-sans text-xs font-bold uppercase tracking-wider">Back</span>
              </button>

              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Suka Fashions Logo" className="w-7 h-7 rounded-full object-cover border border-brand-powder shadow-2xs" />
                <span className="font-serif text-base font-bold text-brand-navy tracking-wide">Suka</span>
              </Link>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-brand-navy hover:text-brand-teal transition-colors rounded-full"
                  aria-label="Search catalog"
                >
                  <Search size={20} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          )}

          {/* Standard Navigation Bar (Hidden on Mobile Product Pages) */}
          <div className={`${isProductPage ? 'hidden lg:flex' : 'flex'} items-center justify-between transition-all duration-300 ${scrolled ? 'h-[76px]' : 'h-[94px] lg:h-[102px]'}`}>

            {/* ── Logo ─────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-3.5 flex-shrink-0">
              <img
                src={logo}
                alt="Suka Fashions Logo"
                className={`rounded-full object-cover border border-brand-powder shadow-sm transition-all duration-300 ${scrolled ? 'h-11 w-11' : 'h-12 w-12 sm:h-13 sm:w-13 lg:h-14 lg:w-14'}`}
              />
              <div className="flex flex-col leading-none">
                <span className={`font-serif font-bold tracking-wider text-brand-navy transition-all duration-300 ${scrolled ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl'}`}>
                  Suka
                </span>
                <span className="font-sans text-[8px] sm:text-[9.5px] tracking-[0.3em] text-brand-teal font-semibold uppercase mt-0.5">
                  FASHIONS
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation Links ───────────────────── */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
              {navItems.map((item) => {
                const hasDropdown = Boolean(item.dropdown);
                const isActive = isNavActive(item.path);

                return (
                  <div
                    key={item.name}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => hasDropdown && handleMouseEnter(item.name)}
                    onMouseLeave={hasDropdown ? handleMouseLeave : undefined}
                  >
                    <Link
                      to={item.path}
                      className={`relative font-sans text-[11px] xl:text-[12px] uppercase tracking-[0.2em] font-semibold transition-colors duration-200 px-3 xl:px-4 py-2 flex items-center gap-1 ${
                        item.highlight
                          ? 'text-red-500 hover:text-red-600 font-bold'
                          : isActive
                          ? 'text-brand-teal font-bold'
                          : 'text-brand-navy hover:text-brand-teal'
                      }`}
                    >
                      {item.name}
                      {hasDropdown && (
                        <ChevronDown
                          size={13}
                          strokeWidth={2}
                          className={`transition-transform duration-200 ${
                            activeDropdown === item.name ? 'rotate-180 text-brand-teal' : 'opacity-60'
                          }`}
                        />
                      )}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-teal rounded-full" />
                      )}
                    </Link>

                    {/* Dropdown / Mega Menu */}
                    {hasDropdown && activeDropdown === item.name && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-brand-powder/60 shadow-2xl rounded-sm p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-200"
                        style={{ minWidth: item.megaImage ? '370px' : '220px', maxWidth: '420px' }}
                      >
                        <div className="flex gap-4 sm:gap-5 items-stretch">
                          <div className="flex-1 min-w-[150px] flex flex-col gap-1.5 justify-start">
                            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-brand-teal font-bold border-b border-brand-powder pb-1.5 mb-1 whitespace-nowrap">
                              Explore {item.name}
                            </span>
                            {item.dropdown.map((drop) => (
                              <Link
                                key={drop.label}
                                to={drop.path}
                                className="font-sans text-xs tracking-wider text-brand-navy/80 hover:text-brand-teal hover:pl-1 transition-all py-1 whitespace-nowrap font-medium"
                              >
                                {drop.label}
                              </Link>
                            ))}
                          </div>

                          {item.megaImage && (
                            <Link
                              to={item.megaLink}
                              className="w-36 sm:w-40 flex-shrink-0 relative overflow-hidden rounded-md group block aspect-[3/4] bg-brand-cream border border-brand-powder/50 self-center"
                            >
                              <img
                                src={item.megaImage}
                                alt={item.megaTitle}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                                <span className="font-serif text-xs sm:text-sm font-medium text-white leading-tight">
                                  {item.megaTitle}
                                </span>
                                <span className="font-sans text-[9px] uppercase tracking-widest text-brand-powder group-hover:text-white mt-0.5 font-semibold">
                                  Shop Now →
                                </span>
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ── Right Section: Integrated Live Search & Account Icons ── */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">

              {/* Desktop & Tablet Live Search Input */}
              <div className="relative hidden md:block w-48 lg:w-64 xl:w-72" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search sarees, kurtis, lehengas..."
                    className="w-full bg-brand-cream/40 hover:bg-brand-cream/80 focus:bg-white border border-brand-powder/70 focus:border-brand-teal rounded-full py-2 pl-9 pr-8 font-sans text-xs text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all duration-300 shadow-2xs"
                  />
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/50" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand-navy p-1"
                    >
                      <X size={13} />
                    </button>
                  )}
                </form>

                {/* Live Results Popover Dropdown */}
                {searchFocused && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-brand-powder/70 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 text-left w-[360px] sm:w-[400px]">
                    
                    {searchQuery.trim() === '' ? (
                      /* Initial state: Popular Searches & Quick Categories */
                      <div className="p-4 space-y-4">
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-extrabold text-brand-teal block mb-2.5">
                            🔥 POPULAR SEARCHES
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Silk Sarees', 'Organza Saree', 'Banarasi', 'Bridal Lehenga', 'Kurti Sets', 'Anarkali'].map(term => (
                              <button
                                key={term}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(term);
                                  setSearchFocused(true);
                                }}
                                className="font-sans text-[10.5px] text-brand-navy bg-brand-cream/50 hover:bg-brand-teal hover:text-white border border-brand-powder/60 px-3 py-1 rounded-full transition-all cursor-pointer"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-brand-powder/50 pt-3">
                          <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-extrabold text-brand-teal block mb-2">
                            ✨ QUICK CATEGORIES
                          </span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { name: 'Sarees', path: '/category/sarees' },
                              { name: 'Kurtis', path: '/category/kurtis' },
                              { name: 'Lehengas', path: '/category/lehengas' },
                              { name: 'Dresses', path: '/category/dresses' },
                            ].map(cat => (
                              <Link
                                key={cat.name}
                                to={cat.path}
                                onClick={() => setSearchFocused(false)}
                                className="font-sans text-xs text-brand-navy hover:text-brand-teal py-1 px-2.5 rounded-md hover:bg-brand-powderLight transition-colors flex items-center justify-between"
                              >
                                <span>{cat.name}</span>
                                <span className="text-[10px] text-brand-navy/30">→</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      /* Instant Live Results */
                      <div>
                        <div className="px-4 py-2 bg-brand-cream/30 border-b border-brand-powder/50 flex justify-between items-center">
                          <span className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-brand-teal">
                            MATCHING PRODUCTS ({searchResults.length})
                          </span>
                          <span className="font-sans text-[9px] text-brand-navy/40">Press Enter for all</span>
                        </div>

                        <div className="divide-y divide-brand-powder/40 max-h-[320px] overflow-y-auto">
                          {searchResults.map(item => (
                            <Link
                              key={item.id}
                              to={`/product/${item.slug || item.id}`}
                              onClick={() => setSearchFocused(false)}
                              className="flex items-center gap-3 p-3 hover:bg-brand-powderLight/60 transition-colors group"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-14 object-cover rounded-xs border border-brand-powder/50 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-sans text-[8px] uppercase tracking-wider font-semibold text-brand-teal block">
                                  {item.category}
                                </span>
                                <h4 className="font-serif text-xs text-brand-navy font-medium truncate group-hover:text-brand-teal transition-colors">
                                  {item.name}
                                </h4>
                                <p className="font-sans text-xs font-bold text-brand-navy mt-0.5">
                                  ₹{item.price.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full py-2.5 bg-brand-teal text-white font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-center hover:bg-brand-tealDark transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          View All Results for "{searchQuery}" →
                        </button>
                      </div>
                    ) : (
                      /* No Results State */
                      <div className="p-6 text-center">
                        <p className="font-serif text-sm text-brand-navy mb-1">No products found</p>
                        <p className="font-sans text-xs text-brand-navy/50">Try searching for 'Saree', 'Lehenga', or 'Silk'</p>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Mobile Quick Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 md:hidden text-brand-navy hover:text-brand-teal transition-colors rounded-full hover:bg-brand-powderLight"
                aria-label="Search catalog"
              >
                <Search size={20} strokeWidth={1.7} />
              </button>

              {/* Account Dropdown */}
              <div className="relative hidden sm:block" ref={accountRef}>
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="p-1 text-brand-navy hover:text-brand-teal transition-colors rounded-full flex items-center justify-center gap-1 cursor-pointer"
                  aria-label="Account menu"
                >
                  {isLoggedIn && user?.name ? (
                    <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-xs shadow-sm uppercase tracking-wider ring-2 ring-brand-teal/20">
                      {user.name.trim().charAt(0)}
                    </div>
                  ) : (
                    <div className="p-1 text-brand-navy hover:text-brand-teal">
                      <User size={20} strokeWidth={1.7} />
                    </div>
                  )}
                </button>

                    {accountDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-brand-powder/60 shadow-xl rounded-sm py-2 z-50 animate-in fade-in zoom-in-95">
                        {isLoggedIn ? (
                          <>
                            <div className="px-4 py-2 border-b border-brand-powder/40">
                              <p className="font-sans text-xs font-semibold text-brand-navy truncate">{user?.name || 'Customer'}</p>
                              <p className="font-sans text-[10px] text-brand-navy/50 truncate">{user?.email}</p>
                            </div>
                            <Link to="/account" className="block px-4 py-2 font-sans text-xs text-brand-navy hover:text-brand-teal hover:bg-brand-powderLight">My Profile & Orders</Link>
                            <Link to="/wishlist" className="block px-4 py-2 font-sans text-xs text-brand-navy hover:text-brand-teal hover:bg-brand-powderLight">Wishlist</Link>
                            <button onClick={handleLogoutRequest} className="w-full text-left px-4 py-2 font-sans text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-brand-powder/40 mt-1 cursor-pointer">
                              <LogOut size={13} /> Logout
                            </button>
                          </>
                        ) : (
                          <>
                            <Link to="/login" className="block px-4 py-2.5 font-sans text-xs font-semibold text-brand-teal hover:bg-brand-powderLight">Login / Register</Link>
                          </>
                        )}
                      </div>
                    )}
              </div>

              {/* Wishlist (Desktop / Tablet) */}
              <Link
                to="/wishlist"
                className="hidden sm:inline-flex relative p-2 text-brand-navy hover:text-brand-teal transition-colors rounded-full hover:bg-brand-powderLight"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.7} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-teal text-white font-sans text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart (Desktop / Tablet) */}
              <Link
                to="/cart"
                className="hidden sm:inline-flex relative p-2 text-brand-navy hover:text-brand-teal transition-colors rounded-full hover:bg-brand-powderLight"
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={20} strokeWidth={1.7} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-navy text-white font-sans text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 lg:hidden text-brand-navy hover:text-brand-teal transition-colors rounded-lg"
                aria-label="Open navigation menu"
              >
                <Menu size={24} strokeWidth={1.8} />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* ── Search Overlay ────────────────────────────────────── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Mobile Navigation Drawer ─────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col z-50">
            <div className="flex items-center justify-between p-5 border-b border-brand-powder">
              <span className="font-serif text-lg font-bold text-brand-navy">Suka Fashions</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-brand-navy/50 hover:text-brand-navy"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {navItems.map(item => (
                <div key={item.name} className="border-b border-brand-powder/40 pb-3">
                  <div className="flex items-center justify-between">
                    <Link to={item.path} className="font-sans text-sm uppercase tracking-wider font-semibold text-brand-navy">{item.name}</Link>
                    {item.dropdown && (
                      <button onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)} className="p-1 text-brand-teal">
                        <ChevronDown size={16} className={mobileExpanded === item.name ? 'rotate-180' : ''} />
                      </button>
                    )}
                  </div>
                  {item.dropdown && mobileExpanded === item.name && (
                    <div className="pl-4 pt-2 space-y-2">
                      {item.dropdown.map(d => (
                        <Link key={d.label} to={d.path} className="block font-sans text-xs text-brand-navy/70 py-1">{d.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-brand-powder bg-brand-cream/30">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 pb-2 border-b border-brand-powder/50">
                    <div className="w-9 h-9 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-xs shadow-xs uppercase ring-2 ring-brand-teal/20 flex-shrink-0">
                      {user?.name?.trim()?.charAt(0) || 'U'}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="font-sans text-xs font-bold text-brand-navy truncate">{user?.name || 'Customer'}</p>
                      <p className="font-sans text-[10px] text-brand-navy/60 truncate">{user?.email || user?.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/account"
                      onClick={() => setMobileOpen(false)}
                      className="text-center bg-white border border-brand-powder/80 text-brand-navy hover:text-brand-teal hover:border-brand-teal py-2 rounded-xs font-sans text-[11px] font-bold uppercase tracking-wider shadow-2xs"
                    >
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogoutRequest();
                      }}
                      className="text-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-xs font-sans text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-brand-teal text-white py-3 font-sans text-xs uppercase tracking-widest font-bold rounded-sm shadow-sm hover:bg-brand-tealDark transition-colors"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
