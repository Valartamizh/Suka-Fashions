import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { products } from '../data/products';

export default function Account() {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'address', label: 'Saved Addresses', icon: MapPin },
  ];

  return (
    <div className="bg-brand-cream/20 min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-brand-powder/60">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-brand-navy tracking-wider uppercase mb-2">
            My Account
          </h1>
          <p className="font-sans text-sm text-brand-navy/60">
            Welcome back, Aditi Sharma
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
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
              
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3 mt-4 text-brand-navy/50 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} strokeWidth={1.5} />
                <span className="font-sans text-xs uppercase tracking-widest font-semibold">Sign Out</span>
              </Link>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white border border-brand-powder/50 rounded-sm p-6 sm:p-10 shadow-sm min-h-[500px]">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-serif text-2xl text-brand-navy mb-6 pb-4 border-b border-brand-powder/60">Order History</h2>
                
                <div className="space-y-6">
                  {/* Mock Order 1 */}
                  <div className="border border-brand-powder/60 rounded-sm overflow-hidden">
                    <div className="bg-brand-cream/30 p-4 border-b border-brand-powder/60 flex flex-wrap gap-4 justify-between items-center">
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Order Placed</span>
                        <span className="font-sans text-xs font-semibold text-brand-navy">August 25, 2026</span>
                      </div>
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Total</span>
                        <span className="font-sans text-xs font-semibold text-brand-navy">₹9,498</span>
                      </div>
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Order ID</span>
                        <span className="font-sans text-xs font-semibold text-brand-navy">ORD-728194</span>
                      </div>
                      <Link to="#" className="font-sans text-[10px] uppercase tracking-widest text-brand-teal font-semibold hover:underline border border-brand-teal px-4 py-1.5 rounded-sm">
                        View Details
                      </Link>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-20 h-24 bg-brand-cream border border-brand-powder/40 flex-shrink-0">
                        <img src={products[0].image} alt={products[0].name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-brand-navy mb-1">{products[0].name}</h3>
                        <p className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 mb-2">Size: Free Size | Qty: 1</p>
                        <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-3 py-1 rounded-full border border-brand-teal/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                          <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Processing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Order 2 (Delivered) */}
                  <div className="border border-brand-powder/60 rounded-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                    <div className="bg-brand-cream/30 p-4 border-b border-brand-powder/60 flex flex-wrap gap-4 justify-between items-center">
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Order Placed</span>
                        <span className="font-sans text-xs font-semibold text-brand-navy">July 12, 2026</span>
                      </div>
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Total</span>
                        <span className="font-sans text-xs font-semibold text-brand-navy">₹4,299</span>
                      </div>
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-wider text-brand-navy/50 block mb-1">Order ID</span>
                        <span className="font-sans text-xs font-semibold text-brand-navy">ORD-193482</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-20 h-24 bg-brand-cream border border-brand-powder/40 flex-shrink-0">
                        <img src={products[2].image} alt={products[2].name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-brand-navy mb-1">{products[2].name}</h3>
                        <p className="font-sans text-[10px] uppercase tracking-wider text-brand-navy/60 mb-2">Size: Free Size | Qty: 1</p>
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="font-sans text-[10px] uppercase tracking-widest font-bold">Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-serif text-2xl text-brand-navy mb-6 pb-4 border-b border-brand-powder/60">Personal Information</h2>
                <div className="max-w-xl space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">First Name</label>
                      <input type="text" defaultValue="Aditi" className="w-full border-b border-brand-powder/60 bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none" />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Last Name</label>
                      <input type="text" defaultValue="Sharma" className="w-full border-b border-brand-powder/60 bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Email Address</label>
                    <input type="email" defaultValue="aditi.sharma@example.com" className="w-full border-b border-brand-powder/60 bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none" />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wider text-brand-navy/70 mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full border-b border-brand-powder/60 bg-brand-cream/10 px-3 py-2.5 font-sans text-sm text-brand-navy focus:border-brand-teal outline-none" />
                  </div>
                  <div className="pt-4">
                    <button className="bg-brand-navy text-white px-6 py-3 font-sans text-[10px] uppercase tracking-widest font-semibold hover:bg-brand-teal transition-colors rounded-sm">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === 'address' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-powder/60">
                  <h2 className="font-serif text-2xl text-brand-navy">Saved Addresses</h2>
                  <button className="font-sans text-[10px] uppercase tracking-widest text-brand-teal font-semibold hover:underline">
                    + Add New
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="border border-brand-teal bg-brand-powderLight p-5 rounded-sm relative">
                    <div className="absolute top-0 right-0 bg-brand-teal text-white px-2 py-1 text-[8px] uppercase tracking-widest font-bold">Default</div>
                    <h3 className="font-sans text-sm font-semibold text-brand-navy mb-2">Aditi Sharma</h3>
                    <p className="font-sans text-xs text-brand-navy/70 leading-relaxed mb-4">
                      123 Fashion Street, Apt 4B<br/>
                      Bandra West<br/>
                      Mumbai, Maharashtra 400050<br/>
                      India
                    </p>
                    <div className="flex gap-3">
                      <button className="text-[10px] uppercase tracking-widest text-brand-teal font-semibold hover:underline">Edit</button>
                      <button className="text-[10px] uppercase tracking-widest text-red-500 font-semibold hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
