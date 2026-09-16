// QuickStockModal.jsx — In-place & Bulk Stock Management Modal
import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Plus, Minus, Package, Check, Zap, Search, CheckCircle2, RotateCcw
} from 'lucide-react';

export default function QuickStockModal({
  isOpen,
  onClose,
  product,
  onSave
}) {
  // Flat variant rows: [{ colorId, colorName, colorHex, size, stock, threshold, sku }]
  const [rows, setRows] = useState([]);
  const [history, setHistory] = useState([]);
  const [bulkVal, setBulkVal] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!product) return;

    const initialRows = [];

    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      product.colors.forEach(c => {
        if (c.variants && Array.isArray(c.variants) && c.variants.length > 0) {
          c.variants.forEach(v => {
            initialRows.push({
              colorId: c.id || c.name,
              colorName: c.name || 'Standard',
              colorHex: c.hex || '#006B70',
              size: v.size || 'Free Size',
              stock: typeof v.stock === 'number' ? v.stock : (parseInt(v.stock, 10) || 0),
              threshold: typeof v.threshold === 'number' ? v.threshold : 2,
              sku: v.sku || `${product.sku || product.id}-${c.name}-${v.size}`,
              sellingPrice: v.sellingPrice || product.price,
              mrp: v.mrp || product.mrp,
            });
          });
        } else {
          initialRows.push({
            colorId: c.id || c.name,
            colorName: c.name || 'Standard',
            colorHex: c.hex || '#006B70',
            size: 'Free Size',
            stock: product.stock || 0,
            threshold: 2,
            sku: `${product.sku || product.id}-${c.name}`,
            sellingPrice: product.price,
            mrp: product.mrp,
          });
        }
      });
    } else if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
      const perSizeStock = Math.max(0, Math.floor((product.stock || 0) / product.sizes.length));
      const remainder = (product.stock || 0) % product.sizes.length;

      product.sizes.forEach((sz, idx) => {
        initialRows.push({
          colorId: 'default',
          colorName: product.color || 'Standard',
          colorHex: '#006B70',
          size: sz,
          stock: perSizeStock + (idx === 0 ? remainder : 0),
          threshold: 2,
          sku: `${product.sku || product.id}-${sz}`,
          sellingPrice: product.price,
          mrp: product.mrp,
        });
      });
    } else {
      initialRows.push({
        colorId: 'default',
        colorName: 'Standard',
        colorHex: '#006B70',
        size: 'Free Size',
        stock: product.stock || 0,
        threshold: 2,
        sku: product.sku || product.id,
        sellingPrice: product.price,
        mrp: product.mrp,
      });
    }

    setRows(initialRows);
    setHistory([]);
    setSearchQuery('');
    setBulkVal(25);
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // History & Undo helpers
  const saveHistory = () => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(rows))].slice(-15));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setRows(lastState);
  };

  // Stepper handlers
  const handleStepStock = (index, delta) => {
    saveHistory();
    setRows(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          stock: Math.max(0, (parseInt(next[index].stock, 10) || 0) + delta)
        };
      }
      return next;
    });
  };

  const handleSetStock = (index, value) => {
    saveHistory();
    const num = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
    setRows(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          stock: num
        };
      }
      return next;
    });
  };

  const handleSetThreshold = (index, value) => {
    saveHistory();
    const num = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
    setRows(prev => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          threshold: num
        };
      }
      return next;
    });
  };

  // Bulk set all stock quantities
  const handleBulkSetAll = (val) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 0) return;
    saveHistory();
    setRows(prev => prev.map(r => ({ ...r, stock: parsed })));
  };

  // Filtered rows for in-modal search
  const filteredRows = rows.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.size.toLowerCase().includes(q) ||
      r.colorName.toLowerCase().includes(q) ||
      (r.sku && r.sku.toLowerCase().includes(q)) ||
      (product.category && product.category.toLowerCase().includes(q))
    );
  });

  // Calculate total stock
  const totalStock = rows.reduce((acc, r) => acc + (parseInt(r.stock, 10) || 0), 0);

  // Save changes
  const handleSave = () => {
    // Group rows back into colors and variants
    let updatedColors = [];

    if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      updatedColors = product.colors.map(c => {
        const matchingRows = rows.filter(r => r.colorId === (c.id || c.name));
        const updatedVariants = (c.variants || []).map(v => {
          const row = matchingRows.find(r => r.size === v.size);
          return {
            ...v,
            stock: row ? (parseInt(row.stock, 10) || 0) : v.stock,
            threshold: row ? (parseInt(row.threshold, 10) || 2) : 2,
          };
        });

        return {
          ...c,
          variants: updatedVariants.length > 0 ? updatedVariants : matchingRows.map(mr => ({
            size: mr.size,
            stock: parseInt(mr.stock, 10) || 0,
            threshold: parseInt(mr.threshold, 10) || 2,
            sku: mr.sku,
            sellingPrice: mr.sellingPrice,
            mrp: mr.mrp,
          })),
        };
      });
    }

    const updatedProduct = {
      ...product,
      stock: totalStock,
      colors: updatedColors.length > 0 ? updatedColors : product.colors,
      status: totalStock === 0 ? 'OUT_OF_STOCK' : (product.status === 'ARCHIVED' ? 'ARCHIVED' : 'ACTIVE'),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* ── 1. MODAL HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center shadow-2xs">
              <Package size={18} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-slate-900 text-base">Manage Product Stock</h3>
              <p className="text-xs text-slate-500 font-medium">
                {product.name} — <span className="font-mono uppercase">{product.id || product.sku}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── 2. SCROLLABLE BODY CONTENT ── */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* ── BULK SET & PRESETS BANNER ── */}
          <div className="bg-[#f0fdf4] border border-emerald-100 rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Bulk Set All Input */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <span>Bulk Set All:</span>
              </div>
              <input
                type="number"
                min="0"
                value={bulkVal}
                onChange={e => setBulkVal(e.target.value)}
                className="w-14 bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-900 text-center focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => handleBulkSetAll(bulkVal)}
                className="bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Apply to All
              </button>
            </div>

            {/* Right: Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-950">Presets:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: '0 (Out)', val: 0 },
                  { label: '10 (Low)', val: 10 },
                  { label: '25 (Default)', val: 25 },
                  { label: '50 (High)', val: 50 },
                ].map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setBulkVal(preset.val);
                      handleBulkSetAll(preset.val);
                    }}
                    className="bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── SEARCH BAR & UNDO ROW ── */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dimension / size, variant color..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs"
              />
            </div>

            {/* Undo Button */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs flex-shrink-0 ${
                history.length > 0
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/20 active:scale-95'
                  : 'bg-white text-slate-300 border-slate-200 opacity-50 cursor-not-allowed'
              }`}
              title={
                history.length > 0
                  ? `Undo last stock change (${history.length} step${history.length > 1 ? 's' : ''} available)`
                  : 'No recent stock edits to undo'
              }
            >
              <RotateCcw size={13} className={history.length > 0 ? "text-amber-600" : "text-slate-300"} />
              <span>Undo</span>
            </button>
          </div>

          {/* ── VARIANTS / STOCK MATRIX TABLE ── */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">DIMENSION / SIZE</th>
                    <th className="py-3 px-4">VARIANT</th>
                    <th className="py-3 px-4 text-center">STOCK QUANTITY</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-center">THRESHOLD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No matching size or variant found.
                      </td>
                    </tr>
                  ) : filteredRows.map((r, rowIdx) => {
                    const originalIdx = rows.indexOf(r);
                    const stockNum = parseInt(r.stock, 10) || 0;
                    const thresholdNum = parseInt(r.threshold, 10) || 2;

                    // Status Pill
                    const statusPill = (() => {
                      if (stockNum === 0) {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Out of Stock
                          </span>
                        );
                      }
                      if (stockNum <= thresholdNum) {
                        return (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Low Stock
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      );
                    })();

                    return (
                      <tr key={rowIdx} className="hover:bg-slate-50/60 transition-colors">
                        {/* CATEGORY */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="bg-blue-50 text-blue-600 border border-blue-200/60 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {product.category || 'SINGLE'}
                          </span>
                        </td>

                        {/* DIMENSION / SIZE */}
                        <td className="py-3 px-4 font-bold text-xs text-slate-800 whitespace-nowrap">
                          {r.size}
                        </td>

                        {/* VARIANT */}
                        <td className="py-3 px-4 font-bold text-xs text-blue-600 uppercase whitespace-nowrap">
                          {r.colorName}
                        </td>

                        {/* STOCK QUANTITY (Interactive Stepper Controls) */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStepStock(originalIdx, -5)}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-bold transition-colors cursor-pointer"
                              title="Subtract 5 units"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStepStock(originalIdx, -1)}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-bold transition-colors cursor-pointer"
                              title="Subtract 1 unit"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={r.stock}
                              onChange={e => handleSetStock(originalIdx, e.target.value)}
                              className="w-14 text-center py-1 text-xs font-extrabold text-slate-900 border border-amber-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-2xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleStepStock(originalIdx, 1)}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-bold transition-colors cursor-pointer"
                              title="Add 1 unit"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStepStock(originalIdx, 5)}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-bold transition-colors cursor-pointer"
                              title="Add 5 units"
                            >
                              +5
                            </button>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {statusPill}
                        </td>

                        {/* THRESHOLD */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            value={r.threshold}
                            onChange={e => handleSetThreshold(originalIdx, e.target.value)}
                            className="w-12 text-center py-1 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-400 shadow-2xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── 3. MODAL FOOTER ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#00875a] hover:bg-[#00704a] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check size={15} strokeWidth={2.5} />
            <span>Save Stock Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
}
