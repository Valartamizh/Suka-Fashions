import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.jpg';
import SearchOverlay from './SearchOverlay';

const navItems = [
  { name: 'New Arrivals', path: '/products' },
  {
    name: 'Sarees',
    path: '/category/sarees',
    dropdown: [
      { label: 'Silk Sarees',       path: '/category/sarees' },
      { label: 'Organza Sarees',    path: '/category/sarees' },
      { label: 'Georgette Sarees',  path: '/category/sarees' },
      { label: 'Cotton Sarees',     path: '/category/sarees' },
      { label: 'Banarasi Sarees',   path: '/category/sarees' },
      { label: 'Party Wear Sarees', path: '/category/sarees' },
      { label: 'Wedding Sarees',    path: '/category/sarees' },
    ],
    megaImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
    megaTitle: 'The Saree Edit',
    megaLink: '/category/sarees'
  },
  {
    name: 'Kurtis',
    path: '/category/kurtis',
    dropdown: [
      { label: 'Kurti Sets',       path: '/category/kurtis' },
      { label: 'Anarkali Kurtis',  path: '/category/kurtis' },
      { label: 'Straight Kurtis',  path: '/category/kurtis' },
      { label: 'Printed Kurtis',   path: '/category/kurtis' },
      { label: 'Embroidered',      path: '/category/kurtis' },
      { label: 'Office Wear',      path: '/category/kurtis' },
    ],
    megaImage: 'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=400&auto=format&fit=crop',
    megaTitle: 'Everyday Elegance',
    megaLink: '/category/kurtis'
  },
  { name: 'Lehengas', path: '/category/lehengas' },
  { name: 'Dresses',  path: '/category/dresses'  },
  {
    name: 'Occasion',
    path: '/category/occasion',
    dropdown: [
      { label: 'Wedding',        path: '/category/occasion' },
      { label: 'Festive',        path: '/category/occasion' },
      { label: 'Party',          path: '/category/occasion' },
      { label: 'Casual',         path: '/category/occasion' },
      { label: 'Office',         path: '/category/occasion' },
      { label: 'Haldi / Mehendi', path: '/category/occasion' },
    ],
  },
  { name: 'Sale', path: '/category/sale', highlight: true },
];

const WISHLIST_COUNT = 2;
const CART_COUNT     = 3;

export default function Navbar() {
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled,       setScrolled]       = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  
  const location = useLocation();
  const dropdownTimer = useRef(null);

  /* Shadow after scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setSearchOpen(false);
  }, [location.pathname]);

  /* Lock body scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openDropdown  = (name) => { clearTimeout(dropdownTimer.current); setActiveDropdown(name); };
  const closeDropdown = ()     => { dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 120); };

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : 'shadow-none border-b border-brand-powder/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-[64px]' : 'h-[76px] lg:h-[84px]'}`}>

            {/* ── Logo ─────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src={logo}
                alt="Suka Fashions Logo"
                className={`rounded-full object-cover border border-brand-powder shadow-sm transition-all duration-300 ${scrolled ? 'h-10 w-10' : 'h-11 w-11 sm:h-13 sm:w-13'}`}
              />
              <div className="flex flex-col leading-none">
                <span className={`font-serif font-bold tracking-wider text-brand-navy transition-all duration-300 ${scrolled ? 'text-xl' : 'text-xl sm:text-2xl'}`}>
                  Suka
                </span>
                <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.3em] text-brand-teal font-semibold uppercase">
                  FASHIONS
                </span>
              </div>
            </Link>

            {/* ── Center Nav (Desktop) ──────────────────────── */}
            <div className="hidden lg:flex items-center gap-7 xl:gap-8 h-full">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.dropdown && openDropdown(item.name)}
                  onMouseLeave={() => item.dropdown && closeDropdown()}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-0.5 font-sans text-[11px] xl:text-xs uppercase tracking-[0.16em] font-medium transition-colors duration-200 ${
                      item.highlight
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-brand-navy hover:text-brand-teal'
                    }`}
                  >
                    <span className="nav-link-underline">{item.name}</span>
                    {item.dropdown && (
                      <ChevronDown
                        size={11}
                        strokeWidth={2}
                        className={`ml-0.5 transition-transform duration-250 ${
                          activeDropdown === item.name ? 'rotate-180 text-brand-teal' : 'text-brand-navy/40'
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mega Menu / Dropdown panel */}
                  {item.dropdown && (
                    <div
                      className={`absolute top-[100%] left-1/2 -translate-x-1/2 mt-0 bg-white border border-brand-powder/60 shadow-2xl rounded-b-sm z-50 transition-all duration-200 transform-gpu origin-top ${
                        activeDropdown === item.name
                          ? 'opacity-100 scale-y-100 pointer-events-auto'
                          : 'opacity-0 scale-y-95 pointer-events-none'
                      } ${item.megaImage ? 'w-[600px] flex' : 'w-56 py-3'}`}
                      onMouseEnter={() => openDropdown(item.name)}
                      onMouseLeave={() => closeDropdown()}
                    >
                      
                      {/* Left: Links */}
                      <div className={`flex-1 ${item.megaImage ? 'p-8' : ''}`}>
                        {item.megaImage && (
                          <h4 className="font-sans text-[9px] tracking-[0.2em] uppercase text-brand-teal font-semibold mb-5">
                            Shop {item.name}
                          </h4>
                        )}
                        <div className={item.megaImage ? 'grid grid-cols-2 gap-x-4 gap-y-3' : 'flex flex-col'}>
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.path}
                              className={`block font-sans text-[11px] tracking-wider text-brand-navy/75 hover:text-brand-teal transition-colors duration-150 ${
                                item.megaImage ? 'hover:translate-x-1' : 'px-5 py-2.5 hover:bg-brand-powderLight'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Right: Mega Image (if present) */}
                      {item.megaImage && (
                        <div className="w-[240px] bg-brand-cream relative p-2">
                          <Link to={item.megaLink} className="block w-full h-full relative group overflow-hidden rounded-sm">
                            <img src={item.megaImage} alt={item.megaTitle} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <span className="font-serif text-lg leading-tight block mb-1">{item.megaTitle}</span>
                              <span className="font-sans text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                Shop Now <span className="text-[14px] leading-none">→</span>
                              </span>
                            </div>
                          </Link>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Right Icons (Desktop) ─────────────────────── */}
            <div className="hidden lg:flex items-center gap-5">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="text-brand-navy hover:text-brand-teal transition-colors duration-200"
              >
                <Search size={19} strokeWidth={1.6} />
              </button>
              
              <Link to="/login" aria-label="My Account" className="text-brand-navy hover:text-brand-teal transition-colors duration-200">
                <User size={19} strokeWidth={1.6} />
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" aria-label="Wishlist" className="relative text-brand-navy hover:text-brand-teal transition-colors duration-200">
                <Heart size={19} strokeWidth={1.6} />
                {WISHLIST_COUNT > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-teal text-white text-[8px] font-sans font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {WISHLIST_COUNT}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" aria-label="Shopping bag" className="relative text-brand-navy hover:text-brand-teal transition-colors duration-200">
                <ShoppingBag size={19} strokeWidth={1.6} />
                {CART_COUNT > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-teal text-white text-[8px] font-sans font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {CART_COUNT}
                  </span>
                )}
              </Link>
            </div>

            {/* ── Mobile: right icons + hamburger ─────────── */}
            <div className="flex lg:hidden items-center gap-4">
              <button onClick={() => setSearchOpen(true)} aria-label="Search" className="text-brand-navy p-1">
                <Search size={20} strokeWidth={1.6} />
              </button>
              
              <Link to="/cart" aria-label="Shopping bag" className="relative text-brand-navy hidden sm:block">
                <ShoppingBag size={20} strokeWidth={1.6} />
                {CART_COUNT > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-teal text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {CART_COUNT}
                  </span>
                )}
              </Link>
              
              <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-brand-navy p-1">
                <Menu size={24} strokeWidth={1.6} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[70] bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 bottom-0 z-[80] w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-powder/50 bg-brand-cream/30">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-9 w-9 rounded-full object-cover border border-brand-powder" />
            <span className="font-serif text-lg font-bold tracking-wider text-brand-navy">Suka Fashions</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="text-brand-navy/70 hover:text-brand-navy p-1 bg-white rounded-full shadow-sm">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => (
            <div key={item.name} className="border-b border-brand-powder/40 last:border-0">
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-brand-powderLight/50"
                onClick={() => {
                  if (item.dropdown) {
                    setMobileExpanded(mobileExpanded === item.name ? null : item.name);
                  } else {
                    setMobileOpen(false);
                  }
                }}
              >
                <Link
                  to={item.path}
                  onClick={(e) => { if (item.dropdown) e.preventDefault(); else setMobileOpen(false); }}
                  className={`font-sans text-xs uppercase tracking-[0.15em] font-semibold ${
                    item.highlight ? 'text-red-500' : 'text-brand-navy'
                  }`}
                >
                  {item.name}
                </Link>
                {item.dropdown && (
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    className={`text-brand-navy/50 transition-transform duration-300 ${
                      mobileExpanded === item.name ? 'rotate-180 text-brand-teal' : ''
                    }`}
                  />
                )}
              </div>

              {/* Sub-items */}
              {item.dropdown && (
                <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-brand-powderLight/30 py-2 px-6 grid grid-cols-1 gap-1">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        onClick={() => setMobileOpen(false)}
                        className="py-2.5 font-sans text-[11px] tracking-wider text-brand-navy/70 hover:text-brand-teal transition-colors flex items-center gap-2"
                      >
                        <div className="w-1 h-1 rounded-full bg-brand-teal/30" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-brand-powder/50 bg-brand-cream/30 space-y-4">
          <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em] text-brand-navy font-semibold hover:text-brand-teal">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-brand-powder shadow-sm">
              <User size={15} strokeWidth={2} />
            </div>
            Sign In / Register
          </Link>
          <div className="pt-2">
            <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-brand-teal font-bold opacity-80">
              Women Based • Women Empowered
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
