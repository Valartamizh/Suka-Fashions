import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  Palette,
  Tag,
  DollarSign,
  ArrowUpDown,
  Scissors,
  Calendar,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../../components/ui/AdminPageHeader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useFilterCatalog } from '../../../context/FilterContext';

const TABS = [
  { id: 'fabrics', label: 'Fabric Materials', icon: Layers, countKey: 'fabrics' },
  { id: 'occasions', label: 'Occasions', icon: Calendar, countKey: 'occasions' },
  { id: 'crafts', label: 'Work / Craft', icon: Scissors, countKey: 'crafts' },
  { id: 'colors', label: 'Colors & Swatches', icon: Palette, countKey: 'colors' },
  { id: 'sizes', label: 'Sizes', icon: Tag, countKey: 'sizes' },
  { id: 'priceRanges', label: 'Price Ranges', icon: DollarSign, countKey: 'priceRanges' },
  { id: 'highlights', label: 'Highlights & Badges', icon: Sparkles, countKey: 'highlights' },
  { id: 'sortOptions', label: 'Sort Options', icon: ArrowUpDown, countKey: 'sortOptions' },
];

export default function FilterCatalogPage() {
  const {
    filters,
    addItem,
    updateItem,
    deleteItem,
    toggleItemActive,
    moveItem,
    resetFilters
  } = useFilterCatalog();

  const [activeTab, setActiveTab] = useState('fabrics');
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);

  // New item form state
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    label: '',
    hex: '#006B70',
    min: '',
    max: '',
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleToggle = (section, id, name) => {
    toggleItemActive(section, id);
    showToast(`Updated visibility for "${name}"`);
  };

  const promptDelete = (section, id, name) => {
    setConfirmModal({
      title: 'Delete Filter Option',
      message: `Are you sure you want to remove "${name}" from the ${section} filter?`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        deleteItem(section, id);
        showToast(`Removed "${name}" from catalog.`);
      }
    });
  };

  const promptReset = () => {
    setConfirmModal({
      title: 'Reset Filter Catalog',
      message: 'Are you sure you want to reset all filter facets, options, and swatches to default values?',
      confirmLabel: 'Reset All',
      variant: 'danger',
      onConfirm: () => {
        resetFilters();
        showToast('All filters reset to initial catalog defaults.');
      }
    });
  };

  const handleAddItem = (e) => {
    if (e) e.preventDefault();
    if (activeTab === 'colors') {
      if (!newItemForm.name.trim()) return;
      addItem('colors', {
        name: newItemForm.name.trim(),
        hex: newItemForm.hex || '#006B70',
      });
    } else if (activeTab === 'priceRanges') {
      if (!newItemForm.label.trim()) return;
      addItem('priceRanges', {
        label: newItemForm.label.trim(),
        min: parseInt(newItemForm.min) || 0,
        max: parseInt(newItemForm.max) || 999999,
      });
    } else if (activeTab === 'highlights' || activeTab === 'sortOptions') {
      if (!newItemForm.label.trim()) return;
      addItem(activeTab, {
        label: newItemForm.label.trim(),
      });
    } else {
      if (!newItemForm.name.trim()) return;
      addItem(activeTab, {
        name: newItemForm.name.trim(),
      });
    }

    setAddModal(false);
    setNewItemForm({ name: '', label: '', hex: '#006B70', min: '', max: '' });
    showToast('New filter option added successfully!');
  };

  const handleSaveEdit = (e) => {
    if (e) e.preventDefault();
    if (!editModal) return;
    updateItem(activeTab, editModal.id, editModal);
    setEditModal(null);
    showToast('Filter option updated.');
  };

  const currentList = filters[activeTab] || [];

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        title="Filter Catalog Management"
        subtitle="Manage storefront filter facets, color swatches, fabrics, crafts, sizes, and price tiers."
      >
        <div className="flex items-center gap-2">
          <Link
            to="/products"
            target="_blank"
            className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors shadow-2xs"
          >
            <ExternalLink size={13} /> View Store Catalog
          </Link>

          <button
            onClick={promptReset}
            title="Reset to default filters"
            className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus size={14} /> Add {TABS.find(t => t.id === activeTab)?.label.slice(0, -1) || 'Option'}
          </button>
        </div>
      </AdminPageHeader>

      {/* Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-xs flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = (filters[tab.countKey] || []).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content: Left Manageable List + Right Real-time Filter Sidebar Preview */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Editable List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm">
                  {TABS.find(t => t.id === activeTab)?.label} Options ({currentList.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Toggle active status, edit labels, reorder, or delete facets for this filter
                </p>
              </div>
              <button
                onClick={() => setAddModal(true)}
                className="px-3 py-1.5 bg-brand-powder/40 hover:bg-brand-powder border border-dashed border-brand-teal/40 text-brand-teal text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Add New
              </button>
            </div>

            {/* List */}
            {currentList.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <SlidersHorizontal size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No items configured yet in this filter section.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentList.map((item, index) => {
                  const displayName = item.label || item.name || item.id;
                  return (
                    <div
                      key={item.id || index}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        item.active
                          ? 'bg-white border-slate-200/90 shadow-2xs hover:border-brand-teal/40'
                          : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                      }`}
                    >
                      {/* Left: Reorder + Icon/Color + Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex flex-col gap-0.5 text-slate-300">
                          <button
                            disabled={index === 0}
                            onClick={() => moveItem(activeTab, item.id, 'up')}
                            className="hover:text-brand-teal disabled:opacity-20 transition-colors cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp size={13} />
                          </button>
                          <button
                            disabled={index === currentList.length - 1}
                            onClick={() => moveItem(activeTab, item.id, 'down')}
                            className="hover:text-brand-teal disabled:opacity-20 transition-colors cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown size={13} />
                          </button>
                        </div>

                        {/* Color swatch icon if color tab */}
                        {item.hex && (
                          <span
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs flex-shrink-0"
                            style={{ backgroundColor: item.hex }}
                          />
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{displayName}</span>
                            {!item.active && (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-200/80 px-1.5 py-0.2 rounded uppercase">
                                Inactive
                              </span>
                            )}
                          </div>
                          {item.min !== undefined && item.max !== undefined && (
                            <p className="text-[10px] text-slate-400 font-mono">
                              Range: ₹{item.min} – {item.max >= 999999 ? 'No limit' : `₹${item.max}`}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggle(activeTab, item.id, displayName)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            item.active
                              ? 'bg-brand-powder/60 text-brand-teal hover:bg-brand-powder'
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                          }`}
                        >
                          {item.active ? <Eye size={12} /> : <EyeOff size={12} />}
                          <span className="hidden sm:inline">{item.active ? 'Active' : 'Hidden'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditModal({ ...item })}
                          className="p-1.5 text-slate-400 hover:text-brand-teal rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Option"
                        >
                          <Edit2 size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => promptDelete(activeTab, item.id, displayName)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Option"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Real-time Live Storefront Filter Sidebar Preview */}
        <div className="space-y-4 sticky top-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">Storefront Preview</span>
              </div>
              <span className="text-[10px] font-bold text-brand-teal bg-brand-powder px-2 py-0.5 rounded-md uppercase">
                Live Sidebar
              </span>
            </div>

            {/* Filter Preview Sidebar Box */}
            <div className="bg-slate-50/50 border border-brand-powder/50 rounded-xl p-4 space-y-4 max-h-[620px] overflow-y-auto text-xs">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-powder/60 pb-2">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-brand-navy flex items-center gap-1.5">
                  <SlidersHorizontal size={12} className="text-brand-teal" /> Filter Catalog
                </span>
                <span className="text-[9px] uppercase font-bold text-brand-teal">Reset</span>
              </div>

              {/* Price Preview */}
              <div className="space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-brand-navy tracking-wider">Price</p>
                <div className="space-y-1">
                  {(filters.priceRanges || []).filter(p => p.active).map(pr => (
                    <div key={pr.id} className="flex items-center gap-2 text-[11px] text-brand-navy/80">
                      <input type="radio" name="preview_price" readOnly className="text-brand-teal" />
                      <span>{pr.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights Preview */}
              <div className="border-t border-brand-powder/40 pt-3 space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-brand-navy tracking-wider flex items-center gap-1">
                  <Sparkles size={10} className="text-amber-500" /> Highlights
                </p>
                <div className="space-y-1">
                  {(filters.highlights || []).filter(h => h.active).map(h => (
                    <div key={h.id} className="px-2.5 py-1 bg-white border border-brand-powder text-brand-navy text-[10px] rounded">
                      {h.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes Preview */}
              <div className="border-t border-brand-powder/40 pt-3 space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-brand-navy tracking-wider">Size</p>
                <div className="flex flex-wrap gap-1">
                  {(filters.sizes || []).filter(s => s.active).map(s => (
                    <span key={s.id} className="px-2 py-0.5 bg-white border border-brand-powder text-brand-navy text-[10px] rounded">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors Preview */}
              <div className="border-t border-brand-powder/40 pt-3 space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-brand-navy tracking-wider">Colors</p>
                <div className="flex flex-wrap gap-1.5">
                  {(filters.colors || []).filter(c => c.active).map(c => (
                    <span
                      key={c.id}
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs inline-block"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Fabrics Preview */}
              <div className="border-t border-brand-powder/40 pt-3 space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-brand-navy tracking-wider">Fabric</p>
                <div className="flex flex-wrap gap-1">
                  {(filters.fabrics || []).filter(f => f.active).slice(0, 6).map(f => (
                    <span key={f.id} className="px-2 py-0.5 bg-white border border-brand-powder text-brand-navy text-[10px] rounded">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Occasions Preview */}
              <div className="border-t border-brand-powder/40 pt-3 space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-brand-navy tracking-wider">Occasion</p>
                <div className="flex flex-wrap gap-1">
                  {(filters.occasions || []).filter(o => o.active).slice(0, 5).map(o => (
                    <span key={o.id} className="px-2 py-0.5 bg-white border border-brand-powder text-brand-navy text-[10px] rounded">
                      {o.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work / Craft Preview */}
              <div className="border-t border-brand-powder/40 pt-3 space-y-1.5">
                <p className="text-[9px] uppercase font-bold text-brand-navy tracking-wider">Work / Craft</p>
                <div className="flex flex-wrap gap-1">
                  {(filters.crafts || []).filter(c => c.active).slice(0, 6).map(c => (
                    <span key={c.id} className="px-2 py-0.5 bg-white border border-brand-powder text-brand-navy text-[10px] rounded">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-bold text-slate-800 text-base">
                Add New {TABS.find(t => t.id === activeTab)?.label}
              </h3>
              <button onClick={() => setAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              {activeTab === 'colors' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Color Name *</label>
                    <input
                      required
                      placeholder="e.g. Royal Indigo"
                      value={newItemForm.name}
                      onChange={e => setNewItemForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Color Hex Code *</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={newItemForm.hex}
                        onChange={e => setNewItemForm(f => ({ ...f, hex: e.target.value }))}
                        className="w-10 h-10 rounded-xl border border-slate-200 p-0.5 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newItemForm.hex}
                        onChange={e => setNewItemForm(f => ({ ...f, hex: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-brand-teal focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : activeTab === 'priceRanges' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Display Label *</label>
                    <input
                      required
                      placeholder="e.g. ₹5000 - ₹10,000"
                      value={newItemForm.label}
                      onChange={e => setNewItemForm(f => ({ ...f, label: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Min Price (₹)</label>
                      <input
                        type="number"
                        placeholder="5000"
                        value={newItemForm.min}
                        onChange={e => setNewItemForm(f => ({ ...f, min: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Max Price (₹)</label>
                      <input
                        type="number"
                        placeholder="10000"
                        value={newItemForm.max}
                        onChange={e => setNewItemForm(f => ({ ...f, max: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              ) : activeTab === 'highlights' || activeTab === 'sortOptions' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Label *</label>
                  <input
                    required
                    placeholder="e.g. Festive Special 🔥"
                    value={newItemForm.label}
                    onChange={e => setNewItemForm(f => ({ ...f, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {TABS.find(t => t.id === activeTab)?.label} Name *
                  </label>
                  <input
                    required
                    placeholder={`e.g. Pure Georgette`}
                    value={newItemForm.name}
                    onChange={e => setNewItemForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  Add Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-bold text-slate-800 text-base">Edit Filter Option</h3>
              <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editModal.hex !== undefined && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Color Name</label>
                    <input
                      value={editModal.name || ''}
                      onChange={e => setEditModal(m => ({ ...m, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Hex Code</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={editModal.hex}
                        onChange={e => setEditModal(m => ({ ...m, hex: e.target.value }))}
                        className="w-10 h-10 rounded-xl border border-slate-200 p-0.5 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editModal.hex}
                        onChange={e => setEditModal(m => ({ ...m, hex: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-brand-teal focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {editModal.label !== undefined && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Label</label>
                  <input
                    value={editModal.label}
                    onChange={e => setEditModal(m => ({ ...m, label: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                  />
                </div>
              )}

              {editModal.name !== undefined && editModal.hex === undefined && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Name</label>
                  <input
                    value={editModal.name}
                    onChange={e => setEditModal(m => ({ ...m, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:border-brand-teal focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          variant={confirmModal.variant}
        />
      )}
    </div>
  );
}
