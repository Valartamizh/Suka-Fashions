// CustomerDetailPage — /admin/customers/:id
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, ShoppingBag, Heart, Eye } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { adminCustomers } from '../data/adminCustomers';
import { adminOrders } from '../data/adminOrders';

const TABS = ['Profile', 'Orders', 'Cart', 'Wishlist'];

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = adminCustomers.find(c => c.id === id);
  const [tab, setTab] = useState('Profile');

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Customer not found.</p>
        <Link to="/admin/customers" className="text-brand-teal font-semibold mt-2 block">Back to Customers</Link>
      </div>
    );
  }

  const customerOrders = adminOrders.filter(o => o.customer.id === customer.id);

  return (
    <div className="space-y-5">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/customers')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="font-sans font-bold text-slate-800 text-lg">{customer.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{customer.id}</p>
        </div>
        <StatusBadge status={customer.status} size="md" />
      </div>

      {/* Profile card */}
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-brand-powder rounded-full flex items-center justify-center text-brand-teal font-bold text-xl mb-3">
            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
          </div>
          <h3 className="font-bold text-slate-800">{customer.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">{customer.id}</p>
          <div className="mt-3 space-y-1.5 text-xs text-slate-600 w-full">
            <div className="flex items-center gap-2 justify-center"><Phone size={11} className="text-slate-400" /> {customer.phone}</div>
            <div className="flex items-center gap-2 justify-center"><Mail size={11} className="text-slate-400" /> {customer.email}</div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-100 pt-3 w-full">Joined {customer.joinedAt}</p>
        </div>

        {[
          { label: 'Total Orders', value: customer.totalOrders, icon: ShoppingBag, color: 'text-brand-teal', bg: 'bg-brand-powder' },
          { label: 'Total Spent', value: `₹${customer.totalSpent.toLocaleString('en-IN')}`, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Last Order', value: customer.lastOrderDate, icon: ShoppingBag, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="font-bold text-slate-800 text-lg font-sans mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t
                ? 'text-brand-teal border-brand-teal'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            {t}
            {t === 'Cart' && customer.cartItems.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                {customer.cartItems.length}
              </span>
            )}
            {t === 'Wishlist' && customer.wishlistItems.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold">
                {customer.wishlistItems.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Profile' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-sans font-bold text-slate-800 text-sm mb-4">Customer Information</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              ['Customer ID', customer.id],
              ['Full Name', customer.name],
              ['Phone', customer.phone],
              ['Email', customer.email],
              ['Member Since', customer.joinedAt],
              ['Account Status', customer.status.charAt(0).toUpperCase() + customer.status.slice(1)],
              ['Total Orders', customer.totalOrders],
              ['Total Spent', `₹${customer.totalSpent.toLocaleString('en-IN')}`],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{k}</span>
                <span className="font-semibold text-slate-700">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Orders' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {customerOrders.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {['Order ID', 'Items', 'Amount', 'Payment', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left font-semibold text-slate-400 uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {customerOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-brand-teal">#{order.id}</td>
                      <td className="px-4 py-3.5 text-slate-600">{order.items.length} items</td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">₹{order.total.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={order.paymentStatus} /></td>
                      <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3.5 text-slate-400">{order.date}</td>
                      <td className="px-4 py-3.5">
                        <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-1 text-brand-teal font-semibold hover:underline text-xs">
                          <Eye size={11} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'Cart' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <ShoppingBag size={15} className="text-slate-400" />
            <h3 className="font-sans font-bold text-slate-800 text-sm">Current Cart ({customer.cartItems.length} items)</h3>
            <span className="text-xs text-amber-600 font-semibold ml-auto">View only — cannot edit customer cart</span>
          </div>
          {customer.cartItems.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">Cart is empty.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {customer.cartItems.map((item, i) => (
                <div key={i} className="flex gap-4 px-5 py-4">
                  <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg border border-slate-100" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.variant} · Qty: {item.qty}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Added {item.addedAt}</p>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'Wishlist' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Heart size={15} className="text-slate-400" />
            <h3 className="font-sans font-bold text-slate-800 text-sm">Wishlist ({customer.wishlistItems.length} items)</h3>
          </div>
          {customer.wishlistItems.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">Wishlist is empty.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {customer.wishlistItems.map((item, i) => (
                <div key={i} className="flex gap-4 px-5 py-4">
                  <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg border border-slate-100" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Added {item.addedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                    <StatusBadge status={item.stock === 'In Stock' ? 'in-stock' : 'low-stock'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
