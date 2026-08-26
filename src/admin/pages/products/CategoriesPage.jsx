// CategoriesPage — /admin/categories
import React, { useState } from 'react';
import { Plus, Edit, Eye, EyeOff, Trash2, GripVertical, ChevronDown, ChevronRight, X } from 'lucide-react';
import AdminPageHeader from '../../components/ui/AdminPageHeader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { adminCategories } from '../../data/adminProducts';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(adminCategories);
  const [expanded, setExpanded] = useState({});
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', subcategories: '', showOnHomepage: true, active: true });

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const toggleVisibility = (id) => setCategories(cats => cats.map(c => c.id === id ? { ...c, active: !c.active } : c));
  const toggleHomepage = (id) => setCategories(cats => cats.map(c => c.id === id ? { ...c, showOnHomepage: !c.showOnHomepage } : c));

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Categories" subtitle="Manage your product categories and subcategories.">
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={14} /> Add Category
        </button>
      </AdminPageHeader>

      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              cat.active ? 'border-slate-100' : 'border-slate-100 opacity-60'
            }`}
          >
            {/* Category row */}
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Drag handle */}
              <div className="text-slate-300 cursor-grab flex-shrink-0">
                <GripVertical size={16} />
              </div>

              {/* Order number */}
              <span className="text-xs font-bold text-slate-300 w-4 text-center flex-shrink-0">{cat.displayOrder}</span>

              {/* Image */}
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=80'}
                alt={cat.name}
                className="w-12 h-12 object-cover rounded-lg border border-slate-100 flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans font-bold text-slate-800 text-sm">{cat.name}</h3>
                  {!cat.active && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Hidden</span>
                  )}
                  {cat.showOnHomepage && (
                    <span className="text-[10px] font-bold text-brand-teal bg-brand-powder px-2 py-0.5 rounded-full uppercase">Homepage</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{cat.subcategories.length} subcategories</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleHomepage(cat.id)}
                  title={cat.showOnHomepage ? 'Remove from homepage' : 'Show on homepage'}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
                    cat.showOnHomepage
                      ? 'border-brand-teal/30 bg-brand-powder text-brand-teal hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                      : 'border-slate-200 text-slate-500 hover:bg-brand-powder hover:text-brand-teal'
                  }`}
                >
                  {cat.showOnHomepage ? 'On Homepage' : 'Add to Homepage'}
                </button>
                <button
                  onClick={() => toggleVisibility(cat.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                  title={cat.active ? 'Hide' : 'Show'}
                >
                  {cat.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => setEditModal(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => setDeleteModal(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  {expanded[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              </div>
            </div>

            {/* Subcategories */}
            {expanded[cat.id] && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Subcategories</p>
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories.map(sub => (
                    <div key={sub} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-slate-700 font-medium">{sub}</span>
                      <button className="text-slate-300 hover:text-red-400 transition-colors">
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 border border-dashed border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:border-brand-teal hover:text-brand-teal transition-all">
                    <Plus size={11} /> Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add category modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setAddModal(false)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-sans font-bold text-slate-800 text-base mb-4">Add Category</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Category Name *</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                  placeholder="e.g. Dupattas"
                  value={newCat.name}
                  onChange={e => setNewCat(n => ({ ...n, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Subcategories (comma separated)</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                  placeholder="Silk, Cotton, Chiffon"
                  value={newCat.subcategories}
                  onChange={e => setNewCat(n => ({ ...n, subcategories: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={newCat.active} onChange={e => setNewCat(n => ({ ...n, active: e.target.checked }))} className="accent-brand-teal" />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={newCat.showOnHomepage} onChange={e => setNewCat(n => ({ ...n, showOnHomepage: e.target.checked }))} className="accent-brand-teal" />
                  Show on Homepage
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setAddModal(false)} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => {
                  setCategories(cats => [...cats, {
                    id: newCat.name.toLowerCase().replace(/\s+/g, '-'),
                    name: newCat.name,
                    image: '',
                    displayOrder: cats.length + 1,
                    active: newCat.active,
                    showOnHomepage: newCat.showOnHomepage,
                    subcategories: newCat.subcategories.split(',').map(s => s.trim()).filter(Boolean),
                  }]);
                  setAddModal(false);
                  setNewCat({ name: '', subcategories: '', showOnHomepage: true, active: true });
                }}
                className="flex-1 bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={() => setCategories(c => c.filter(cat => cat.id !== deleteModal?.id))}
        title="Delete Category"
        message={`Delete "${deleteModal?.name}"? Products in this category will not be affected, but they'll need to be reassigned.`}
        confirmLabel="Delete Category"
        variant="danger"
      />
    </div>
  );
}

