// SettingsPage — /admin/settings
import React, { useState } from 'react';
import {
  Store, CreditCard, Truck, ShoppingBag, Package, Bell, Search, Shield,
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';

const TABS = [
  { label: 'Store', icon: Store },
  { label: 'Payments', icon: CreditCard },
  { label: 'Shipping', icon: Truck },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Inventory', icon: Package },
  { label: 'Notifications', icon: Bell },
  { label: 'SEO', icon: Search },
  { label: 'Security', icon: Shield },
];

function SettingField({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-5 border-b border-slate-100 last:border-0">
      <div className="sm:w-56 flex-shrink-0">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1 max-w-md">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? 'bg-brand-teal' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  );
}

const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Store');

  const [store, setStore] = useState({
    storeName: 'Suka Fashions',
    supportEmail: 'support@sukafashions.com',
    supportPhone: '+91 98765 00000',
    address: '42, Commercial Street, Bengaluru, Karnataka 560001',
    gst: '29ABCDE1234F1Z5',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [shipping, setShipping] = useState({
    freeShippingMin: 1999,
    standardCharge: 99,
    deliveryDays: '3-7 working days',
    codEnabled: true,
  });

  const [inventory, setInventory] = useState({
    lowStockThreshold: 10,
    allowOrderWhenOutOfStock: false,
    trackInventory: true,
    lowStockAlerts: true,
  });

  const [orders, setOrders] = useState({
    autoConfirmPrepaid: true,
    codConfirmation: false,
    returnWindowDays: 7,
    cancellationWindow: '24 hours',
  });

  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    outOfStock: true,
    returnRequest: true,
    newReview: false,
    paymentFailure: true,
  });

  const s = (obj, setter, key, val) => setter({ ...obj, [key]: val });

  const tabContent = {
    Store: (
      <div>
        <SettingField label="Store Name">
          <input className={inputClass} value={store.storeName} onChange={e => s(store, setStore, 'storeName', e.target.value)} />
        </SettingField>
        <SettingField label="Support Email">
          <input type="email" className={inputClass} value={store.supportEmail} onChange={e => s(store, setStore, 'supportEmail', e.target.value)} />
        </SettingField>
        <SettingField label="Support Phone">
          <input className={inputClass} value={store.supportPhone} onChange={e => s(store, setStore, 'supportPhone', e.target.value)} />
        </SettingField>
        <SettingField label="Business Address">
          <textarea className={`${inputClass} resize-none`} rows={2} value={store.address} onChange={e => s(store, setStore, 'address', e.target.value)} />
        </SettingField>
        <SettingField label="GST Number">
          <input className={inputClass} value={store.gst} onChange={e => s(store, setStore, 'gst', e.target.value)} />
        </SettingField>
        <SettingField label="Currency">
          <select className={`${inputClass} bg-white`} value={store.currency} onChange={e => s(store, setStore, 'currency', e.target.value)}>
            <option value="INR">INR — Indian Rupee (₹)</option>
            <option value="USD">USD — US Dollar ($)</option>
          </select>
        </SettingField>
        <SettingField label="Timezone">
          <select className={`${inputClass} bg-white`} value={store.timezone} onChange={e => s(store, setStore, 'timezone', e.target.value)}>
            <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
          </select>
        </SettingField>
      </div>
    ),

    Shipping: (
      <div>
        <SettingField label="Free Shipping Minimum" hint="Orders above this amount get free shipping">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
            <input type="number" className={`${inputClass} pl-8`} value={shipping.freeShippingMin} onChange={e => s(shipping, setShipping, 'freeShippingMin', e.target.value)} />
          </div>
        </SettingField>
        <SettingField label="Standard Shipping Charge">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
            <input type="number" className={`${inputClass} pl-8`} value={shipping.standardCharge} onChange={e => s(shipping, setShipping, 'standardCharge', e.target.value)} />
          </div>
        </SettingField>
        <SettingField label="Delivery Estimate">
          <input className={inputClass} value={shipping.deliveryDays} onChange={e => s(shipping, setShipping, 'deliveryDays', e.target.value)} />
        </SettingField>
        <SettingField label="Cash on Delivery" hint="Allow COD payments">
          <Toggle checked={shipping.codEnabled} onChange={v => s(shipping, setShipping, 'codEnabled', v)} />
        </SettingField>
      </div>
    ),

    Inventory: (
      <div>
        <SettingField label="Default Low Stock Threshold" hint="Products with stock at or below this are marked Low Stock">
          <input type="number" className={inputClass} value={inventory.lowStockThreshold} onChange={e => s(inventory, setInventory, 'lowStockThreshold', parseInt(e.target.value, 10))} />
        </SettingField>
        <SettingField label="Allow orders when out of stock" hint="NOT recommended — customers can order even if stock is 0">
          <div className="flex items-center gap-3">
            <Toggle checked={inventory.allowOrderWhenOutOfStock} onChange={v => s(inventory, setInventory, 'allowOrderWhenOutOfStock', v)} />
            {inventory.allowOrderWhenOutOfStock && (
              <span className="text-xs text-red-600 font-semibold">⚠ Not recommended</span>
            )}
          </div>
        </SettingField>
        <SettingField label="Track Inventory">
          <Toggle checked={inventory.trackInventory} onChange={v => s(inventory, setInventory, 'trackInventory', v)} />
        </SettingField>
        <SettingField label="Low Stock Alerts">
          <Toggle checked={inventory.lowStockAlerts} onChange={v => s(inventory, setInventory, 'lowStockAlerts', v)} />
        </SettingField>
      </div>
    ),

    Orders: (
      <div>
        <SettingField label="Auto-confirm prepaid orders" hint="Automatically confirm orders paid online">
          <Toggle checked={orders.autoConfirmPrepaid} onChange={v => s(orders, setOrders, 'autoConfirmPrepaid', v)} />
        </SettingField>
        <SettingField label="Manual COD confirmation" hint="Require manual confirmation for COD orders">
          <Toggle checked={orders.codConfirmation} onChange={v => s(orders, setOrders, 'codConfirmation', v)} />
        </SettingField>
        <SettingField label="Return Window (days)">
          <input type="number" className={inputClass} value={orders.returnWindowDays} onChange={e => s(orders, setOrders, 'returnWindowDays', parseInt(e.target.value, 10))} />
        </SettingField>
        <SettingField label="Cancellation Window">
          <select className={`${inputClass} bg-white`} value={orders.cancellationWindow} onChange={e => s(orders, setOrders, 'cancellationWindow', e.target.value)}>
            <option>1 hour</option>
            <option>24 hours</option>
            <option>48 hours</option>
            <option>Before shipping</option>
          </select>
        </SettingField>
      </div>
    ),

    Notifications: (
      <div>
        {Object.entries(notifications).map(([key, val]) => (
          <SettingField
            key={key}
            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
          >
            <Toggle checked={val} onChange={v => setNotifications(n => ({ ...n, [key]: v }))} />
          </SettingField>
        ))}
      </div>
    ),

    Payments: (
      <div className="py-8 text-center text-sm text-slate-400">
        <CreditCard size={28} className="mx-auto mb-3 text-slate-300" />
        <p className="font-semibold text-slate-600 mb-1">Payment Gateway Settings</p>
        <p>Connect to Razorpay, PayU or Stripe via the Spring Boot backend configuration.</p>
      </div>
    ),

    SEO: (
      <div className="py-8 text-center text-sm text-slate-400">
        <Search size={28} className="mx-auto mb-3 text-slate-300" />
        <p className="font-semibold text-slate-600 mb-1">SEO Settings</p>
        <p>Global meta tags, sitemap, and structured data will be configured here.</p>
      </div>
    ),

    Security: (
      <div>
        <SettingField label="Two-Factor Authentication" hint="Require 2FA for all admin logins">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold">
              Configure via backend — Spring Security
            </span>
          </div>
        </SettingField>
        <SettingField label="Active Admin Sessions">
          <div className="space-y-2">
            {[
              { device: 'Chrome on Windows', location: 'Bengaluru, IN', time: 'Now (this session)' },
              { device: 'Safari on iPhone', location: 'Bengaluru, IN', time: '2 hours ago' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-slate-700">{s.device}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.location} · {s.time}</p>
                </div>
                {i > 0 && (
                  <button className="text-xs font-semibold text-red-500 hover:underline">Revoke</button>
                )}
              </div>
            ))}
          </div>
        </SettingField>
        <SettingField label="Login History">
          <button className="text-xs font-semibold text-brand-teal hover:underline">View login history →</button>
        </SettingField>
        <SettingField label="Logout All Devices">
          <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg border border-red-200 transition-colors">
            Logout All Admin Sessions
          </button>
        </SettingField>
      </div>
    ),
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Settings" subtitle="Configure your store, payments, shipping, and preferences." />

      <div className="flex gap-5">
        {/* Settings tabs sidebar */}
        <div className="w-44 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-2 space-y-0.5">
            {TABS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === label
                    ? 'bg-brand-powder text-brand-teal'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-6 py-4">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-800 text-base">{activeTab} Settings</h3>
              <button className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
            {tabContent[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
}
