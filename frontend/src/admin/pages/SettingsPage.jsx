// SettingsPage — /admin/settings
import React, { useState, useEffect } from 'react';
import {
  Store, CreditCard, Truck, ShoppingBag, Package, Bell, Shield, Check, RotateCcw,
  Terminal, Lock, RefreshCw, Server
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useSettings } from '../../context/SettingsContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const TABS = [
  { label: 'Store', icon: Store },
  { label: 'Payments', icon: CreditCard },
  { label: 'Shipping', icon: Truck },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Inventory', icon: Package },
  { label: 'Notifications', icon: Bell },
  { label: 'Security', icon: Shield },
  { label: 'System', icon: Terminal, superAdminOnly: true },
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
  const { settings, saveSettings } = useSettings();
  const { isSuperAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('Store');
  const [savedToast, setSavedToast] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(null);

  const [store, setStore] = useState(settings.store);
  const [shipping, setShipping] = useState(settings.shipping);
  const [inventory, setInventory] = useState(settings.inventory);
  const [orders, setOrders] = useState(settings.orders);
  const [notifications, setNotifications] = useState(settings.notifications);

  useEffect(() => {
    if (settings) {
      setStore(settings.store);
      setShipping(settings.shipping);
      setInventory(settings.inventory);
      setOrders(settings.orders);
      setNotifications(settings.notifications);
    }
  }, [settings]);

  // Execute Save after Confirmation
  const executeSave = () => {
    // Record snapshot of current settings for undo
    setLastSavedSnapshot({
      store: { ...settings.store },
      shipping: { ...settings.shipping },
      inventory: { ...settings.inventory },
      orders: { ...settings.orders },
      notifications: { ...settings.notifications },
    });

    saveSettings({
      store,
      shipping,
      inventory,
      orders,
      notifications,
    });

    setSavedToast('Settings saved successfully! Main storefront updated.');
    setTimeout(() => setSavedToast(null), 4500);
  };

  // Handle Undo / Revert
  const handleUndo = () => {
    if (lastSavedSnapshot) {
      saveSettings(lastSavedSnapshot);
      setStore(lastSavedSnapshot.store);
      setShipping(lastSavedSnapshot.shipping);
      setInventory(lastSavedSnapshot.inventory);
      setOrders(lastSavedSnapshot.orders);
      setNotifications(lastSavedSnapshot.notifications);
      setLastSavedSnapshot(null);
      setSavedToast('Settings changes undone. Reverted to previous settings.');
    } else {
      // Revert current form inputs back to active settings
      setStore(settings.store);
      setShipping(settings.shipping);
      setInventory(settings.inventory);
      setOrders(settings.orders);
      setNotifications(settings.notifications);
      setSavedToast('Form changes discarded. Reverted to current settings.');
    }
    setTimeout(() => setSavedToast(null), 3500);
  };

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
        <SettingField label="Support Phone" hint="General customer support phone number">
          <input className={inputClass} value={store.supportPhone} onChange={e => s(store, setStore, 'supportPhone', e.target.value)} />
        </SettingField>
        <SettingField label="WhatsApp Order Number" hint="Phone number receiving customer WhatsApp orders & direct messages">
          <input className={inputClass} placeholder="+91 9488463850" value={store.whatsappNumber !== undefined ? store.whatsappNumber : store.supportPhone} onChange={e => s(store, setStore, 'whatsappNumber', e.target.value)} />
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

    System: !isSuperAdmin ? (
      <div className="py-12 px-6 text-center max-w-lg mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <Lock size={26} />
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100/70 border border-amber-200 px-3 py-1 rounded-full">
            Restricted Configuration
          </span>
          <h4 className="font-serif text-xl font-bold text-slate-800 mt-2">Technical / System Settings</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            System infrastructure, server endpoints, and environment variables are managed exclusively by the Super Admin.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 text-left">
          <p className="font-semibold text-slate-700 mb-1">Admin Access:</p>
          <p className="text-[11px] text-slate-500">
            As Admin, you can freely manage Store info, Shipping rules, Low-stock alerts, Order policies, and Notifications.
          </p>
        </div>
      </div>
    ) : (
      <div>
        <div className="mb-5 p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server size={18} className="text-purple-600" />
            <div>
              <p className="font-bold">Super Admin System Console</p>
              <p className="text-[11px] text-purple-700">Full technical controls & Spring Boot backend readiness</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-purple-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Super Admin Access
          </span>
        </div>

        <SettingField label="Backend Environment" hint="Target Spring Boot environment">
          <select className={`${inputClass} bg-white`}>
            <option>Production (AWS Cloud / Spring Boot 3)</option>
            <option>Staging (Testing Sandbox)</option>
            <option>Development (Localhost 8080)</option>
          </select>
        </SettingField>

        <SettingField label="API Endpoint URL" hint="Base REST endpoint for store services">
          <input className={inputClass} defaultValue="https://api.sukafashions.com/v1" />
        </SettingField>

        <SettingField label="Cache & Index Flush" hint="Invalidate product search and storefront redis cache">
          <button
            type="button"
            onClick={() => {
              setSavedToast('Cache invalidated and storefront search re-indexed.');
              setTimeout(() => setSavedToast(null), 3500);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Flush Cache Now</span>
          </button>
        </SettingField>

        <SettingField label="Maintenance Lockdown" hint="Emergency lockdown restricting customer access">
          <Toggle checked={false} onChange={() => {}} />
        </SettingField>
      </div>
    ),
  };

  return (
    <div className="space-y-5 relative">
      {/* Toast Alert with Undo Action */}
      {savedToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-[fadeInUp_0.25s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{savedToast}</span>
          {lastSavedSnapshot && (
            <button
              onClick={handleUndo}
              className="ml-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-brand-powder hover:text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} /> Undo
            </button>
          )}
        </div>
      )}

      <AdminPageHeader title="Settings" subtitle="Configure your store, payments, shipping, and preferences." />

      <div className="flex flex-col md:flex-row gap-4 sm:gap-5">
        {/* Settings tabs sidebar / mobile pills bar */}
        <div className="w-full md:w-44 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-1.5 sm:p-2 flex md:flex-col overflow-x-auto no-scrollbar gap-1 sm:gap-0.5">
            {TABS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs font-semibold transition-all text-left whitespace-nowrap flex-shrink-0 md:w-full cursor-pointer ${
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
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-800 text-base">{activeTab} Settings</h3>
              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs"
                  title="Undo / Revert settings"
                >
                  <RotateCcw size={13} className="text-slate-500" />
                  <span>Undo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
            {tabContent[activeTab]}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeSave}
        title="Save Settings Changes?"
        message="Are you sure you want to save and apply these changes to your store settings? The changes will immediately reflect on the customer storefront."
        confirmLabel="Save Changes"
        variant="brand"
      />
    </div>
  );
}
