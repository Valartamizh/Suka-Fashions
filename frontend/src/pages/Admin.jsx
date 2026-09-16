import React from 'react';
import { products } from '../data/products';
import { DollarSign, ShoppingBag, Eye, Users } from 'lucide-react';

export default function Admin() {
  const stats = [
    { name: 'Total Revenue', value: '₹12,48,500', icon: DollarSign, change: '+12% from last month' },
    { name: 'Orders Fulfilled', value: '412', icon: ShoppingBag, change: '+8% this week' },
    { name: 'Catalog Products', value: products.length, icon: Eye, change: 'Active listings' },
    { name: 'Active Members', value: '10,480', icon: Users, change: 'Loved by women' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-5xl font-light text-brand-navy tracking-wider uppercase">
            Admin Dashboard
          </h1>
          <p className="font-sans text-xs text-brand-navy/60 font-light mt-1 tracking-widest uppercase">
            Suka Fashions Operations Hub
          </p>
        </div>
        <button className="bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-sans font-semibold tracking-wider uppercase py-3.5 px-6 rounded-sm transition-colors duration-200">
          + ADD NEW PRODUCT
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="border border-brand-powder/50 bg-brand-cream/25 rounded-sm p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-sans text-xs text-brand-navy/50 uppercase tracking-widest font-semibold">
                    {stat.name}
                  </span>
                  <h3 className="font-sans text-2xl sm:text-3xl font-bold text-brand-navy mt-2">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-2 bg-brand-powder rounded-full text-brand-teal">
                  <Icon size={18} />
                </div>
              </div>
              <p className="font-sans text-[11px] text-brand-teal font-medium mt-4">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Catalog Table */}
      <div className="border border-brand-powder/50 rounded-sm overflow-hidden bg-white">
        <div className="bg-brand-cream/40 p-4 border-b border-brand-powder/50">
          <h2 className="font-serif text-lg font-semibold text-brand-navy uppercase tracking-wider">
            Product Inventory
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-brand-powder/40 text-brand-navy/60 uppercase tracking-widest bg-brand-cream/10">
                <th className="p-4 font-semibold">Product Details</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-brand-powder/20 hover:bg-brand-powderLight/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-xs border border-brand-powder/20" />
                    <div>
                      <span className="font-semibold text-brand-navy block">{p.name}</span>
                      <span className="text-[10px] text-brand-navy/40 uppercase tracking-widest block mt-0.5">{p.id}</span>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-brand-navy/70">{p.category}</td>
                  <td className="p-4 font-semibold text-brand-navy">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-brand-navy/70">{p.rating} / 5.0</td>
                  <td className="p-4 text-right">
                    <button className="text-brand-teal hover:underline uppercase tracking-wider font-semibold mr-4">Edit</button>
                    <button className="text-red-500 hover:underline uppercase tracking-wider font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
