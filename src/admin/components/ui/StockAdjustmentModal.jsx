// StockAdjustmentModal — for inventory management
import React, { useState } from 'react';
import { X, Package } from 'lucide-react';

const REASONS = ['New Purchase', 'Customer Return', 'Damaged', 'Manual Correction', 'Lost', 'Other'];
const ADJUSTMENT_TYPES = [
  { value: 'add', label: 'Add Stock', color: 'text-green-600' },
  { value: 'remove', label: 'Remove Stock', color: 'text-red-600' },
  { value: 'set', label: 'Set Exact Stock', color: 'text-blue-600' },
];

export default function StockAdjustmentModal({ isOpen, onClose, onSubmit, item }) {
  const [type, setType] = useState('add');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('New Purchase');
  const [notes, setNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = parseInt(qty, 10);
    if (!quantity || quantity <= 0) return;
    onSubmit({ type, quantity, reason, notes, item });
    setQty('');
    setNotes('');
    setType('add');
    setReason('New Purchase');
    onClose();
  };

  const previewStock = () => {
    const q = parseInt(qty, 10) || 0;
    if (type === 'add') return item.available + q;
    if (type === 'remove') return Math.max(0, item.available - q);
    if (type === 'set') return q;
    return item.available;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-[fadeInUp_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-powder rounded-lg flex items-center justify-center text-brand-teal">
              <Package size={18} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-slate-800 text-base">Adjust Stock</h3>
              <p className="text-xs text-slate-400">{item.productName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* SKU and current stock */}
        <div className="bg-slate-50 rounded-lg p-3 mb-5 flex items-center justify-between text-sm">
          <div>
            <span className="text-slate-400 text-xs">SKU</span>
            <p className="font-mono font-semibold text-slate-700 text-xs mt-0.5">{item.sku}</p>
          </div>
          <div>
            <span className="text-slate-400 text-xs">Variant</span>
            <p className="font-semibold text-slate-700 text-xs mt-0.5">{item.variant}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-xs">Current Stock</span>
            <p className="font-bold text-brand-teal text-xl mt-0.5">{item.available}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Adjustment type */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Adjustment Type</label>
            <div className="grid grid-cols-3 gap-2">
              {ADJUSTMENT_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    type === t.value
                      ? 'border-brand-teal bg-brand-powder text-brand-teal'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quantity</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(e.target.value)}
              placeholder="Enter quantity"
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all"
            />
            {qty && (
              <p className="text-xs text-slate-400 mt-1">
                New stock will be: <span className="font-bold text-brand-teal">{previewStock()}</span>
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reason</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all bg-white"
            >
              {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-brand-teal text-white text-sm font-semibold hover:bg-brand-tealDark transition-colors"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
