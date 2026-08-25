import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';

// Components
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Homepage     from './pages/Homepage';
import ProductList  from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Wishlist     from './pages/Wishlist';
import Cart         from './pages/Cart';
import Checkout     from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login        from './pages/Login';
import Account      from './pages/Account';
import Admin        from './pages/Admin';
import NotFound     from './pages/NotFound';

// Dummy counts (replace with context/state later)
const WISHLIST_COUNT = 2;
const CART_COUNT     = 3;

function MobileBottomNav() {
  const location = useLocation();

  const tabs = [
    { to: '/',         Icon: Home,        label: 'Home'    },
    { to: '/products', Icon: Search,      label: 'Search'  },
    { to: '/wishlist', Icon: Heart,       label: 'Wishlist', badge: WISHLIST_COUNT },
    { to: '/cart',     Icon: ShoppingBag, label: 'Bag',      badge: CART_COUNT    },
    { to: '/account',  Icon: User,        label: 'Account'  },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-powder/60 shadow-[0_-2px_16px_rgba(0,0,0,0.06)] lg:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2 pb-2">
        {tabs.map(({ to, Icon, label, badge }) => {
          const isActive = location.pathname === to || (to === '/products' && location.pathname.includes('/category/'));
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-1 flex-1 py-1 transition-colors duration-200 ${
                isActive ? 'text-brand-teal' : 'text-brand-navy/45 hover:text-brand-navy'
              }`}
              aria-label={label}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="font-sans text-[9px] uppercase tracking-[0.12em] font-semibold">{label}</span>
              {badge > 0 && (
                <span className="absolute top-0 right-[calc(50%-18px)] bg-brand-teal text-white text-[7px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  // Hide Navbar/Footer on specific pages for cleaner flow
  const hideNavFooter = ['/checkout', '/order-success', '/login'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {!hideNavFooter && <AnnouncementBar />}
      {!hideNavFooter && <Navbar />}

      {/* Page content */}
      <main className="flex-grow pb-16 lg:pb-0">
        <Routes>
          <Route path="/"                       element={<Homepage />}      />
          <Route path="/products"               element={<ProductList />}   />
          <Route path="/category/:categoryName" element={<ProductList />}   />
          <Route path="/product/:id"            element={<ProductDetail />} />
          <Route path="/wishlist"               element={<Wishlist />}      />
          <Route path="/cart"                   element={<Cart />}          />
          <Route path="/checkout"               element={<Checkout />}      />
          <Route path="/order-success"          element={<OrderSuccess />}  />
          <Route path="/login"                  element={<Login />}         />
          <Route path="/account/*"              element={<Account />}       />
          <Route path="/admin"                  element={<Admin />}         />
          <Route path="*"                       element={<NotFound />}      />
        </Routes>
      </main>

      {!hideNavFooter && <Footer />}
      {!hideNavFooter && <MobileBottomNav />}
      
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
