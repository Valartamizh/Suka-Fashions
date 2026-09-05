import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ChevronRight, X, Truck, CheckCircle2, Plus, Edit2, Trash2 as TrashIcon, Check, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { products } from '../data/products';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

const DEFAULT_SAVED_ADDRESSES = [
  {
    id: 1,
    name: 'Pooja',
    street: '123 Fashion Street, Apt 4B',
    apartment: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '+91 98765 43210',
    isDefault: true,
  },
];

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser, logout } = useAuth();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Protect route: redirect to login if logged out
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    type: 'danger',
    onConfirm: () => {},
  });

  // Profile Form State initialized from live user
  const [profileForm, setProfileForm] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'Pooja',
    lastName: user?.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '',
    email: user?.email || 'pooja@example.com',
    phone: user?.phone || '+91 98765 43210',
  });

  // Keep form in sync if user state updates
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      setProfileForm({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Profile Save Feedback State
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address Management States
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('suka_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_ADDRESSES;
    } catch (e) {
      return DEFAULT_SAVED_ADDRESSES;
    }
  });

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
  });

  // Save addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('suka_addresses', JSON.stringify(addresses));
    } catch (e) {
      console.error('Error saving addresses', e);
    }
  }, [addresses]);

  // Profile Form Validation State
  const [profileErrors, setProfileErrors] = useState({});
  // Address Form Validation State
  const [addressErrors, setAddressErrors] = useState({});

  const validateProfileForm = () => {
    const errs = {};
    if (!profileForm.firstName.trim() || profileForm.firstName.trim().length < 2) {
      errs.firstName = 'First Name is required (min 2 letters)';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileForm.email.trim() || !emailRegex.test(profileForm.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    const rawDigits = (profileForm.phone || '').replace(/\D/g, '');
    const phoneDigits = rawDigits.slice(-10);
    if (!phoneDigits || phoneDigits.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateAddressForm = () => {
    const errs = {};
    if (!addressForm.name.trim() || addressForm.name.trim().length < 2) {
      errs.name = 'Full Name is required (min 2 characters)';
    }
    if (!addressForm.street.trim() || addressForm.street.trim().length < 5) {
      errs.street = 'Street address is required (min 5 characters)';
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
    const rawDigits = (addressForm.phone || '').replace(/\D/g, '');
    const phoneDigits = rawDigits.slice(-10);
    if (!phoneDigits || phoneDigits.length !== 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressErrors({});
    setAddressForm({
      name: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: addresses.length === 0,
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressErrors({});
    setAddressForm({
      name: addr.name || '',
      street: addr.street || '',
      apartment: addr.apartment || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      phone: addr.phone || '',
      isDefault: Boolean(addr.isDefault),
    });
    setAddressModalOpen(true);
  };

  const requestDeleteAddress = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Saved Address?',
      message: `Are you sure you want to delete the address for "${name || 'this contact'}"?`,
      confirmText: 'Delete Address',
      type: 'danger',
      onConfirm: () => {
        setAddresses((prev) => {
          const updated = prev.filter((a) => a.id !== id);
          if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
            updated[0].isDefault = true;
          }
          return updated;
        });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleSaveAddressSubmit = (e) => {
    e.preventDefault();
    if (!validateAddressForm()) {
      return;
    }

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingAddressId) {
            return { ...a, ...addressForm };
          }
          return addressForm.isDefault ? { ...a, isDefault: false } : a;
        })
      );
    } else {
      const newAddress = {
        id: Date.now(),
        ...addressForm,
      };
      setAddresses((prev) => {
        const resetPrevious = addressForm.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [...resetPrevious, newAddress];
      });
    }

    setAddressModalOpen(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!validateProfileForm()) {
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Save Profile Changes?',
      message: 'Are you sure you want to update your personal profile details?',
      confirmText: 'Save Changes',
      type: 'warning',
      onConfirm: () => {
        const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim();
        updateUser({
          name: fullName || 'Pooja',
          email: profileForm.email,
          phone: profileForm.phone,
        });
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3500);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSignOutRequest = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Sign Out?',
      message: 'Are you sure you want to sign out of your Suka Fashions account?',
      confirmText: 'Sign Out',
      type: 'danger',
      onConfirm: () => {
        logout();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        navigate('/');
      },
    });
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'address', label: 'Saved Addresses', icon: MapPin },
  ];

  if (!isLoggedIn) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-14 2xl:px-16 pt-12 pb-20 text-center">
        <div className="max-w-md mx-auto bg-white border border-brand-powder/60 p-8 sm:p-10 rounded-sm shadow-md">
          <div className="w-14 h-14 rounded-full bg-brand-powderLight flex items-center justify-center text-brand-teal mx-auto mb-4">
            <Lock size={26} strokeWidth={1.5} />
          </div>
          <p className="font-sans text-[10px] tracking-[0.25em] text-brand-teal uppercase font-semibold mb-2">
            PLEASE LOGIN TO CONTINUE
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-navy font-light mb-3 uppercase tracking-wider">
            Access Your Account
          </h2>
          <p className="font-sans text-xs text-brand-navy/60 leading-relaxed font-light mb-6">
            Please log in to your Suka Fashions account to view your order history, profile details, and saved addresses.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-brand-teal hover:bg-brand-tealDark text-white px-8 py-3.5 font-sans text-[10px] uppercase tracking-[0.2em] font-bold transition-all rounded-sm shadow-md"
          >
            <LogIn size={15} /> Login / Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream/20 min-h-[85vh] pt-4 sm:pt-8 pb-8 sm:pb-12 lg:pb-16 text-left">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-3.5 sm:mb-6 pb-3 sm:pb-4 border-b border-brand-powder/60">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-brand-navy tracking-wider uppercase mb-0.5 sm:mb-1">
              My Account
            </h1>
            <p className="font-sans text-xs sm:text-sm text-brand-navy/60 font-medium">
              Welcome back, <span className="text-brand-teal font-bold">{user?.name || 'Pooja'}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOutRequest}
            className="lg:hidden flex items-center gap-1.5 text-brand-navy/60 hover:text-red-500 font-sans text-[10px] uppercase tracking-wider font-semibold py-1.5 px-3 rounded-sm border border-brand-powder/70 bg-white shadow-2xs cursor-pointer transition-colors"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="flex lg:hidden gap-1.5 p-1 bg-brand-powder/30 rounded-sm mb-3.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xs transition-all duration-200 text-center ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs font-bold'
                    : 'bg-white/80 text-brand-navy/70 hover:text-brand-teal font-medium'
                }`}
              >
                <Icon size={14} strokeWidth={isActive ? 2 : 1.5} />
                <span className="font-sans text-[10px] uppercase tracking-wider whitespace-nowrap">{tab.label.replace('My ', '')}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-200 ${
                      isActive 
                        ? 'bg-brand-teal text-white shadow-md' 
                        : 'bg-transparent text-brand-navy/70 hover:bg-brand-powderLight hover:text-brand-teal'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                      <span className="font-sans text-xs uppercase tracking-widest font-semibold">{tab.label}</span>
                    </div>
                    {isActive && <ChevronRight size={16} />}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleSignOutRequest}
                className="flex items-center gap-3 px-4 py-3 mt-2 text-brand-navy/50 hover:text-red-500 transition-colors w-full text-left cursor-pointer"
              >
                <LogOut size={18} strokeWidth={1.5} />
                <span className="font-sans text-xs uppercase tracking-widest font-semibold">Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white border border-brand-powder/50 rounded-sm p-4 sm:p-6 lg:p-10 shadow-sm min-h-0 lg:min-h-[500px]">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-serif text-2xl text-brand-navy mb-6 pb-4 border-b border-brand-powder/60">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-brand-powderLight text-brand-teal flex items-center justify-center mx-auto mb-4 border border-brand-powder/60">
                      <Package size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-brand-navy font-light mb-2">No Orders Placed Yet</h3>
                    <p className="font-sans text-xs text-brand-navy/60 max-w-sm mx-auto leading-relaxed mb-6 font-light">
                      You haven't placed any orders with Suka Fashions yet. Explore our handcrafted sarees, kurtis, & lehengas to place your first order!
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white px-7 py-3 font-sans text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm shadow-md transition-all"
                    >
                      Explore New Arrivals
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-brand-powder/60 rounded-sm overflow-hidden hover:border-brand-teal/40 transition-colors">
                      
                      {/* Header summary bar */}
                      <div className="bg-brand-cream/30 p-4 border-b border-brand-powder/60 flex flex-wrap gap-4 justify-between items-center">
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Order Placed</span>
                          <span className="font-sans text-xs font-semibold text-brand-navy">{order.date}</span>
                        </div>
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Total</span>
                          <span className="font-sans text-xs font-semibold text-brand-navy">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Order ID</span>
                          <span className="font-sans text-xs font-semibold text-brand-navy">{order.id}</span>
                        </div>
                        
                        {/* Interactive View Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="font-sans text-[10px] uppercase tracking-widest text-brand-teal font-bold hover:bg-brand-teal hover:text-white border border-brand-teal px-4 py-2 rounded-sm transition-all duration-200 shadow-xs cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>

                      {/* Items Preview */}
                      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                        <div className="w-20 h-24 bg-brand-cream border border-brand-powder/40 flex-shrink-0 rounded-xs overflow-hidden">
                          <img src={order.items[0].image} alt={order.items[0].name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-serif text-lg text-brand-navy mb-1">{order.items[0].name}</h3>
                            <p className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 mb-2">
                              Size: {order.items[0].selectedSize} | Qty: {order.items[0].quantity}
                              {order.items[0].selectedColor ? ` | Color: ${order.items[0].selectedColor}` : ''}
                            </p>
                          </div>
                          
                          <div>
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-600' : 'bg-brand-teal'}`} />
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-serif text-xl sm:text-2xl text-brand-navy mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-brand-powder/60">Personal Information</h2>
                
                {profileSuccess && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-sans font-semibold flex items-center gap-2 animate-in fade-in">
                    <Check size={16} className="text-emerald-600" /> Your profile details have been saved successfully!
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="max-w-xl space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2 font-semibold">First Name *</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => {
                          setProfileForm({ ...profileForm, firstName: e.target.value });
                          if (profileErrors.firstName) setProfileErrors({ ...profileErrors, firstName: '' });
                        }}
                        className={`w-full border-b bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none font-medium ${
                          profileErrors.firstName ? 'border-red-500' : 'border-brand-powder/60'
                        }`}
                      />
                      {profileErrors.firstName && (
                        <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {profileErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2 font-semibold">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full border-b border-brand-powder/60 bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => {
                        setProfileForm({ ...profileForm, email: e.target.value });
                        if (profileErrors.email) setProfileErrors({ ...profileErrors, email: '' });
                      }}
                      className={`w-full border-b bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none font-medium ${
                        profileErrors.email ? 'border-red-500' : 'border-brand-powder/60'
                      }`}
                    />
                    {profileErrors.email && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {profileErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2 font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => {
                        setProfileForm({ ...profileForm, phone: e.target.value });
                        if (profileErrors.phone) setProfileErrors({ ...profileErrors, phone: '' });
                      }}
                      className={`w-full border-b bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none font-medium ${
                        profileErrors.phone ? 'border-red-500' : 'border-brand-powder/60'
                      }`}
                    />
                    {profileErrors.phone && (
                      <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {profileErrors.phone}</p>
                    )}
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="bg-brand-navy text-white px-6 py-3 font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-brand-teal transition-colors rounded-sm shadow-sm cursor-pointer">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-powder/60">
                  <div>
                    <h2 className="font-serif text-2xl text-brand-navy">Saved Addresses</h2>
                    <p className="font-sans text-xs text-brand-navy/60">Manage your shipping addresses for fast checkout</p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest text-brand-teal font-bold hover:bg-brand-teal hover:text-white border border-brand-teal px-4 py-2 rounded-sm transition-all shadow-2xs cursor-pointer"
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="p-8 text-center bg-brand-cream/20 border border-brand-powder/50 rounded-sm">
                    <MapPin size={32} className="mx-auto text-brand-navy/30 mb-2" />
                    <p className="font-serif text-base text-brand-navy font-medium mb-1">No Saved Addresses</p>
                    <p className="font-sans text-xs text-brand-navy/60 mb-4">Click "+ Add New Address" above to save your first address.</p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="bg-brand-teal text-white px-5 py-2.5 font-sans text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-sm"
                    >
                      + Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={`p-5 rounded-sm relative border transition-all ${
                          addr.isDefault 
                            ? 'border-brand-teal bg-brand-powderLight/40 shadow-xs' 
                            : 'border-brand-powder/70 bg-white hover:border-brand-teal/50'
                        }`}
                      >
                        {addr.isDefault && (
                          <div className="absolute top-0 right-0 bg-brand-teal text-white px-2.5 py-1 text-[8px] uppercase tracking-widest font-extrabold rounded-bl-sm">
                            Default Address
                          </div>
                        )}

                        <h3 className="font-sans text-sm font-bold text-brand-navy mb-2.5 flex items-center gap-2">
                          {addr.name}
                        </h3>

                        <p className="font-sans text-xs text-brand-navy/75 leading-relaxed mb-4">
                          {addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.pincode}<br />
                          Phone: <span className="font-semibold text-brand-teal">{addr.phone}</span>
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-brand-powder/40">
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleOpenEditAddress(addr)}
                              className="text-[10px] uppercase tracking-widest text-brand-teal font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => requestDeleteAddress(addr.id, addr.name)}
                              className="text-[10px] uppercase tracking-widest text-red-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <TrashIcon size={12} /> Delete
                            </button>
                          </div>

                          {!addr.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[9px] uppercase tracking-wider text-brand-navy/60 hover:text-brand-teal font-semibold cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ── ORDER DETAILS MODAL ────────────────────────────────────── */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="relative bg-white rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-left border border-brand-powder/60"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-powder/60">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-teal font-extrabold block mb-1">
                  ORDER DETAILS & TRACKING
                </span>
                <h2 className="font-serif text-2xl text-brand-navy font-normal flex items-center gap-3">
                  {selectedOrder.id}
                  <span className={`font-sans text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${
                    selectedOrder.status === 'Delivered' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </h2>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tracking Progress Timeline */}
            <div className="bg-brand-cream/30 border border-brand-powder/50 rounded-sm p-5 mb-6">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-4">
                Shipment Status Timeline
              </h3>
              <div className="space-y-4">
                {selectedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                      step.done ? 'bg-brand-teal text-white shadow-xs' : 'bg-slate-200 text-slate-400 border border-slate-300'
                    }`}>
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 flex justify-between items-baseline border-b border-brand-powder/30 pb-2">
                      <span className={`font-sans text-xs ${step.done ? 'font-semibold text-brand-navy' : 'text-brand-navy/50'}`}>
                        {step.label}
                      </span>
                      <span className="font-sans text-[10px] text-brand-navy/50 font-medium">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items List */}
            <div className="mb-6">
              <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-3">
                Items Purchased
              </h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-brand-cream/20 border border-brand-powder/40 rounded-sm">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xs border border-brand-powder/40 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-serif text-base text-brand-navy font-medium">{item.name}</h4>
                      <p className="font-sans text-[10px] text-brand-navy/60 uppercase tracking-wider mt-0.5">
                        Size: {item.selectedSize || 'Free Size'} | Qty: {item.quantity}
                        {item.selectedColor ? ` | Color: ${item.selectedColor}` : ''}
                      </p>
                      <p className="font-sans text-xs font-bold text-brand-navy mt-1">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white border border-brand-powder/50 rounded-sm">
                <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-2">Delivery Address</h4>
                <p className="font-sans text-xs text-brand-navy/75 leading-relaxed">
                  <strong>{selectedOrder.address.name}</strong><br />
                  {selectedOrder.address.street}<br />
                  {selectedOrder.address.locality}, {selectedOrder.address.city}<br />
                  {selectedOrder.address.state} - {selectedOrder.address.pincode}<br />
                  Phone: <span className="font-semibold text-brand-teal">{selectedOrder.address.phone}</span>
                </p>
              </div>

              <div className="p-4 bg-white border border-brand-powder/50 rounded-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy mb-2">Payment Breakdown</h4>
                  <div className="space-y-1.5 font-sans text-xs text-brand-navy/70">
                    <div className="flex justify-between"><span>Subtotal:</span><span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>Shipping:</span><span>{selectedOrder.shipping === 0 ? 'Free' : `₹${selectedOrder.shipping}`}</span></div>
                    <div className="flex justify-between font-bold text-brand-navy border-t border-brand-powder/50 pt-2 mt-2"><span>Total Paid:</span><span>₹{selectedOrder.total.toLocaleString('en-IN')}</span></div>
                  </div>
                </div>
                <p className="font-sans text-[10px] text-brand-navy/50 mt-3">Payment Choice: <strong className="text-brand-navy">{selectedOrder.paymentMethod}</strong></p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-powder/60">
              <button
                onClick={() => {
                  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Suka Fashions, I need live updates or support for my Order ID: ${selectedOrder.id}`)}`, '_blank');
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 font-sans text-[10px] font-bold uppercase tracking-[0.18em] rounded-sm transition-all shadow-sm"
              >
                <Truck size={15} /> WhatsApp Courier Support
              </button>
              
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-3.5 border border-brand-powder hover:border-brand-navy text-brand-navy font-sans text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── ADD / EDIT ADDRESS MODAL ────────────────────────────────── */}
      {addressModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setAddressModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-md shadow-2xl w-full max-w-lg p-6 sm:p-8 text-left border border-brand-powder/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-powder/60">
              <div>
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-teal font-extrabold block mb-1">
                  SAVED ADDRESSES
                </span>
                <h2 className="font-serif text-2xl text-brand-navy font-normal">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h2>
              </div>
              <button 
                onClick={() => setAddressModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-4">
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1.5 font-bold">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(e) => {
                    setAddressForm({ ...addressForm, name: e.target.value });
                    if (addressErrors.name) setAddressErrors({ ...addressErrors, name: '' });
                  }}
                  placeholder="e.g. Aditi Sharma"
                  className={`w-full border px-3.5 py-2.5 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                    addressErrors.name ? 'border-red-500' : 'border-brand-powder'
                  }`}
                />
                {addressErrors.name && (
                  <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1.5 font-bold">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => {
                    setAddressForm({ ...addressForm, street: e.target.value });
                    if (addressErrors.street) setAddressErrors({ ...addressErrors, street: '' });
                  }}
                  placeholder="House no, street name"
                  className={`w-full border px-3.5 py-2.5 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                    addressErrors.street ? 'border-red-500' : 'border-brand-powder'
                  }`}
                />
                {addressErrors.street && (
                  <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.street}</p>
                )}
              </div>

              <div>
                <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1.5 font-bold">
                  Apartment, Suite, Locality
                </label>
                <input
                  type="text"
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  placeholder="Landmark or area"
                  className="w-full border border-brand-powder px-3.5 py-2.5 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1.5 font-bold">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, city: e.target.value });
                      if (addressErrors.city) setAddressErrors({ ...addressErrors, city: '' });
                    }}
                    placeholder="e.g. Mumbai"
                    className={`w-full border px-3.5 py-2.5 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.city ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.city && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1.5 font-bold">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, state: e.target.value });
                      if (addressErrors.state) setAddressErrors({ ...addressErrors, state: '' });
                    }}
                    placeholder="e.g. Maharashtra"
                    className={`w-full border px-3.5 py-2.5 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.state ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.state && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1.5 font-bold">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') });
                      if (addressErrors.pincode) setAddressErrors({ ...addressErrors, pincode: '' });
                    }}
                    placeholder="e.g. 400050"
                    className={`w-full border px-3.5 py-2.5 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.pincode ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.pincode && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.pincode}</p>
                  )}
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-1.5 font-bold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={addressForm.phone}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') });
                      if (addressErrors.phone) setAddressErrors({ ...addressErrors, phone: '' });
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full border px-3.5 py-2.5 font-sans text-xs text-brand-navy focus:border-brand-teal outline-none rounded-sm ${
                      addressErrors.phone ? 'border-red-500' : 'border-brand-powder'
                    }`}
                  />
                  {addressErrors.phone && (
                    <p className="font-sans text-[10px] text-red-500 mt-1 font-semibold">⚠️ {addressErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-brand-navy select-none">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="w-4 h-4 text-brand-teal rounded border-brand-powder focus:ring-brand-teal"
                  />
                  <span>Set as Default Shipping Address</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-powder/60">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-5 py-2.5 border border-brand-powder text-brand-navy font-sans text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-teal text-white font-sans text-[10px] uppercase tracking-widest font-bold rounded-sm shadow-md hover:bg-brand-tealDark transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
