import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';

// Customer Components
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Customer Pages
import Homepage     from './pages/Homepage';
import ProductList  from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Wishlist     from './pages/Wishlist';
import Cart         from './pages/Cart';
import Checkout     from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login        from './pages/Login';
import Account      from './pages/Account';
import NotFound     from './pages/NotFound';
import About        from './pages/About';
import Contact      from './pages/Contact';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsExchanges from './pages/ReturnsExchanges';
import FAQs         from './pages/FAQs';
import TrackOrder   from './pages/TrackOrder';
import Careers      from './pages/Careers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

// ─── Admin System ────────────────────────────────────────────────────────────
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminLayout from './admin/components/layout/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import ProductsPage from './admin/pages/products/ProductsPage';
import AddProductPage from './admin/pages/products/AddProductPage';
import CategoriesPage from './admin/pages/products/CategoriesPage';
import FilterCatalogPage from './admin/pages/products/FilterCatalogPage';
import InventoryPage from './admin/pages/InventoryPage';
import OrdersPage from './admin/pages/OrdersPage';
import OrderDetailPage from './admin/pages/OrderDetailPage';
import CustomersPage from './admin/pages/CustomersPage';
import CustomerDetailPage from './admin/pages/CustomerDetailPage';
import ReviewsPage from './admin/pages/ReviewsPage';
import ContentPage from './admin/pages/ContentPage';
import UsersPage from './admin/pages/UsersPage';
import SettingsPage from './admin/pages/SettingsPage';

import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { FilterProvider } from './context/FilterContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { CustomerProvider } from './context/CustomerContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

function MobileBottomNav() {
  const location = useLocation();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  const tabs = [
    { to: '/',         Icon: Home,        label: 'Home'    },
    { isSearch: true,  Icon: Search,      label: 'Search'  },
    { to: '/wishlist', Icon: Heart,       label: 'Wishlist', badge: wishlistCount },
    { to: '/cart',     Icon: ShoppingBag, label: 'Bag',      badge: cartCount    },
    { to: '/account',  Icon: User,        label: 'Account'  },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brand-powder/60 shadow-[0_-2px_16px_rgba(0,0,0,0.06)] lg:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2 pb-2">
        {tabs.map(({ to, Icon, label, badge, isSearch }) => {
          if (isSearch) {
            return (
              <button
                key="search-btn"
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-search-overlay'))}
                className="relative flex flex-col items-center gap-1 flex-1 py-1 transition-colors duration-200 text-brand-navy/55 hover:text-brand-teal active:scale-95 cursor-pointer"
                aria-label="Search Catalog"
              >
                <Icon size={20} strokeWidth={1.7} />
                <span className="font-sans text-[9px] uppercase tracking-[0.12em] font-semibold">{label}</span>
              </button>
            );
          }

          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-1 flex-1 py-1 transition-colors duration-200 ${
                isActive ? 'text-brand-teal' : 'text-brand-navy/55 hover:text-brand-navy'
              }`}
              aria-label={label}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.7} />
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
  const { isSectionActive } = useContent();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!hideNavFooter && isSectionActive('announcement') && <AnnouncementBar />}
      {!hideNavFooter && <Navbar />}

      {/* Page content */}
      <main className="flex-grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/"                       element={<Homepage />}         />
            <Route path="/products"               element={<ProductList />}      />
            <Route path="/category/:categoryName" element={<ProductList />}      />
            <Route path="/product/:id"            element={<ProductDetail />}    />
            <Route path="/wishlist"               element={<Wishlist />}         />
            <Route path="/cart"                   element={<Cart />}             />
            <Route path="/checkout"               element={<Checkout />}         />
            <Route path="/order-success"          element={<OrderSuccess />}     />
            <Route path="/login"                  element={<Login />}            />
            <Route path="/account/*"              element={<Account />}          />
            <Route path="/about"                  element={<About />}            />
            <Route path="/contact"                element={<Contact />}          />
            <Route path="/shipping"               element={<ShippingPolicy />}    />
            <Route path="/returns"                element={<ReturnsExchanges />} />
            <Route path="/faqs"                   element={<FAQs />}             />
            <Route path="/track-order"            element={<TrackOrder />}       />
            <Route path="/careers"                element={<Careers />}          />
            <Route path="/privacy"                element={<PrivacyPolicy />}    />
            <Route path="/terms"                  element={<TermsConditions />}   />
            <Route path="*"                       element={<NotFound />}         />
          </Routes>
        </ErrorBoundary>
      </main>

      {!hideNavFooter && <Footer />}
      {!hideNavFooter && <MobileBottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <ProductProvider>
            <CategoryProvider>
              <FilterProvider>
                <ContentProvider>
                  <CustomerProvider>
                    <Router>
                      <WishlistProvider>
                        <CartProvider>
                          <OrderProvider>
                            <Routes>
                              {/* ─── Admin Routes (standalone, no customer nav/footer) ───── */}
                              <Route path="/admin/login" element={<AdminLogin />} />
                              <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="products" element={<ProductsPage />} />
                                <Route path="products/view/:id" element={<ProductsPage />} />
                                <Route path="products/add" element={<AddProductPage />} />
                                <Route path="products/edit/:id" element={<AddProductPage />} />
                                <Route path="categories" element={<CategoriesPage />} />
                                <Route path="filters" element={<FilterCatalogPage />} />
                                <Route path="inventory" element={<InventoryPage />} />
                                <Route path="orders" element={<OrdersPage />} />
                                <Route path="orders/:id" element={<OrderDetailPage />} />
                                <Route path="customers" element={<CustomersPage />} />
                                <Route path="customers/:id" element={<CustomerDetailPage />} />
                                <Route path="reviews" element={<ReviewsPage />} />
                                <Route path="content" element={<ContentPage />} />
                                <Route path="users" element={<UsersPage />} />
                                <Route path="settings" element={<SettingsPage />} />
                              </Route>

                              {/* ─── Customer Storefront ────────────────────────────────── */}
                              <Route path="/*" element={<MainLayout />} />
                            </Routes>
                          </OrderProvider>
                        </CartProvider>
                      </WishlistProvider>
                    </Router>
                  </CustomerProvider>
                </ContentProvider>
              </FilterProvider>
            </CategoryProvider>
          </ProductProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
