// CategoriesPage — /admin/categories
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  FolderPlus,
  ExternalLink
} from 'lucide-react';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useCategories } from '../../../context/CategoryContext';
import { useProducts } from '../../../context/ProductContext';
import sareeGolden from '../../../assets/saree_golden.jpg';

export default function CategoriesPage() {
  const {
    categories,
    toggleHomepage,
    toggleVisibility,
    addCategory,
    editCategory,
    deleteCategory,
    addSubcategory,
    removeSubcategory,
  } = useCategories();

  const { products } = useProducts();

  const [search, setSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [editCategoryModal, setEditCategoryModal] = useState(null);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [addSubModal, setAddSubModal] = useState(null); // { catId, catName } or null
  const [editSubModal, setEditSubModal] = useState(null); // { catId, catName, oldName, newName }
  const [toast, setToast] = useState(null);

  // New Category Form State
  const [newCat, setNewCat] = useState({
    name: '',
    description: '',
    image: '',
    showOnHomepage: true,
    active: true
  });

  // New Subcategory Input inside AddSubModal
  const [subNameInput, setSubNameInput] = useState('');
  const [selectedCatIdForSub, setSelectedCatIdForSub] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Total Subcategories across all categories
  const totalSubcategories = useMemo(() => {
    return categories.reduce((total, cat) => total + (cat.subcategories ? cat.subcategories.length : 0), 0);
  }, [categories]);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase().trim();
    return categories.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.subcategories || []).some(s => s.toLowerCase().includes(q))
    );
  }, [categories, search]);

  // Handlers for Add Main Category
  const handleSaveAddCategory = () => {
    if (!newCat.name.trim()) return;
    addCategory({
      name: newCat.name.trim(),
      image: newCat.image.trim() || sareeGolden,
      description: newCat.description.trim() || 'Luxury collection & celebratory ethnic silhouettes',
      subcategories: [],
      showOnHomepage: newCat.showOnHomepage,
      active: newCat.active,
    });
    setAddCategoryModal(false);
    setNewCat({ name: '', description: '', image: '', showOnHomepage: true, active: true });
    showToast(`Category "${newCat.name}" created successfully!`);
  };

  // Handlers for Edit Main Category
  const handleSaveEditCategory = () => {
    if (!editCategoryModal || !editCategoryModal.name.trim()) return;
    editCategory(editCategoryModal.id, {
      ...editCategoryModal,
      name: editCategoryModal.name.trim(),
      image: editCategoryModal.image || sareeGolden,
    });
    setEditCategoryModal(null);
    showToast(`Category "${editCategoryModal.name}" updated successfully!`);
  };

  // Handlers for Add Subcategory
  const handleSaveAddSubcategory = () => {
    const targetCatId = selectedCatIdForSub || addSubModal?.catId || categories[0]?.id;
    if (!targetCatId || !subNameInput.trim()) return;

    addSubcategory(targetCatId, subNameInput.trim());
    const matched = categories.find(c => c.id === targetCatId);
    showToast(`Subcategory "${subNameInput.trim()}" added to "${matched?.name || 'Category'}".`);
    setAddSubModal(null);
    setSubNameInput('');
  };

  // Handlers for Edit Subcategory
  const handleSaveEditSubcategory = () => {
    if (!editSubModal || !editSubModal.newName.trim()) return;
    const { catId, oldName, newName } = editSubModal;
    const targetCat = categories.find(c => c.id === catId);
    if (!targetCat) return;

    const updatedSubs = (targetCat.subcategories || []).map(s => s === oldName ? newName.trim() : s);
    editCategory(catId, { ...targetCat, subcategories: updatedSubs });
    setEditSubModal(null);
    showToast(`Subcategory renamed to "${newName.trim()}".`);
  };

  // Delete Subcategory
  const promptDeleteSubcategory = (cat, sub) => {
    setConfirmModal({
      title: 'Delete Subcategory',
      message: `Are you sure you want to remove subcategory "${sub}" from "${cat.name}"? Products assigned to it will retain their category.`,
      confirmLabel: 'Delete Subcategory',
      variant: 'danger',
      onConfirm: () => {
        removeSubcategory(cat.id, sub);
        showToast(`Subcategory "${sub}" removed.`);
      }
    });
  };

  // Delete Category
  const promptDeleteCategory = (cat) => {
    setConfirmModal({
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${cat.name}" and all its subcategories? Products will not be deleted.`,
      confirmLabel: 'Delete Category',
      variant: 'danger',
      onConfirm: () => {
        deleteCategory(cat.id);
        showToast(`Category "${cat.name}" deleted.`);
      }
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      
      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* ── 1. TOP HEADER & ACTION BUTTONS ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-bold text-slate-900">Category & Subcategory Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {categories.length} Main Categories • {totalSubcategories} Subcategories
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* + Add Subcategory Button (Light Purple / Indigo tint) */}
          <button
            type="button"
            onClick={() => {
              setSelectedCatIdForSub(categories[0]?.id || '');
              setSubNameInput('');
              setAddSubModal({ catId: categories[0]?.id, catName: categories[0]?.name });
            }}
            className="flex items-center gap-1.5 border border-indigo-200 bg-[#ede9fe]/70 hover:bg-[#ede9fe] text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Subcategory</span>
          </button>

          {/* + Add Main Category Button (Deep Navy Solid) */}
          <button
            type="button"
            onClick={() => {
              setNewCat({ name: '', description: '', image: '', showOnHomepage: true, active: true });
              setAddCategoryModal(true);
            }}
            className="flex items-center gap-1.5 bg-[#0b1b4f] hover:bg-[#07133a] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Main Category</span>
          </button>
        </div>
      </div>

      {/* ── 2. SEARCH BAR ── */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search main categories & subcategories..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs"
        />
      </div>

      {/* ── 3. MAIN CATEGORY CARDS LIST ── */}
      <div className="space-y-5">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            No categories match your search.
          </div>
        ) : filteredCategories.map((cat) => {
          const catProducts = (products || []).filter(p => {
            const pc = (p.category || '').toLowerCase();
            return pc === cat.name.toLowerCase() || pc === cat.id.toLowerCase() || pc.replace(/[^a-z0-9]+/g, '-') === cat.id.toLowerCase();
          });
          const totalCatProductsCount = catProducts.length;
          const subcategoriesList = cat.subcategories || [];

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4"
            >
              {/* Main Category Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                
                {/* Left: Thumbnail, Name, Status Badge & Tagline */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={cat.image || sareeGolden}
                    alt={cat.name}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = sareeGolden;
                    }}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shadow-2xs flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-sans font-bold text-base text-slate-900 truncate">{cat.name}</h2>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        cat.active !== false
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {cat.active !== false ? 'Active' : 'Inactive'}
                      </span>
                      {cat.showOnHomepage && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                          On Homepage
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {cat.description || 'Luxury ethnic collection & handcrafted weaves'} • <span className="font-semibold text-slate-700">{totalCatProductsCount} {totalCatProductsCount === 1 ? 'product' : 'products'}</span>
                    </p>
                  </div>
                </div>

                {/* Right Actions: View in Store, + Add Subcategory, Edit, Delete */}
                <div className="flex items-center gap-2">
                  <Link
                    to={cat.link || `/category/${cat.id}`}
                    target="_blank"
                    className="flex items-center gap-1 border border-teal-200 bg-teal-50/70 hover:bg-teal-50 text-teal-700 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="View category on storefront"
                  >
                    <ExternalLink size={12} strokeWidth={2} />
                    <span>View Store</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCatIdForSub(cat.id);
                      setSubNameInput('');
                      setAddSubModal({ catId: cat.id, catName: cat.name });
                    }}
                    className="flex items-center gap-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    <span>Add Subcategory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditCategoryModal(cat)}
                    className="p-1.5 border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="Edit Main Category"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => promptDeleteCategory(cat)}
                    className="p-1.5 border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="Delete Main Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Subcategories Grid Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  SUBCATEGORIES ({subcategoriesList.length})
                </div>

                {subcategoriesList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No subcategories added yet. Click "+ Add Subcategory" above to add one.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {subcategoriesList.map((sub) => {
                      const subProductCount = catProducts.filter(p => {
                        const ps = (p.subcategory || '').toLowerCase();
                        const pn = (p.name || '').toLowerCase();
                        return ps === sub.toLowerCase() || pn.includes(sub.toLowerCase());
                      }).length;

                      return (
                        <div
                          key={sub}
                          className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-2 shadow-2xs transition-all"
                        >
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/products?category=${encodeURIComponent(cat.id)}&sub=${encodeURIComponent(sub)}`}
                              target="_blank"
                              className="text-xs font-bold text-slate-800 hover:text-brand-teal truncate flex items-center gap-1 group"
                              title="View subcategory in store"
                            >
                              <span className="truncate">{sub}</span>
                              <ExternalLink size={10} className="text-slate-400 group-hover:text-brand-teal flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subProductCount} {subProductCount === 1 ? 'product' : 'products'}</p>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditSubModal({ catId: cat.id, catName: cat.name, oldName: sub, newName: sub })}
                              className="p-1 text-amber-600 hover:text-amber-700 bg-white border border-slate-200/90 rounded-md transition-colors shadow-2xs cursor-pointer"
                              title="Edit subcategory name"
                            >
                              <Edit size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => promptDeleteSubcategory(cat, sub)}
                              className="p-1 text-red-500 hover:text-red-700 bg-white border border-slate-200/90 rounded-md transition-colors shadow-2xs cursor-pointer"
                              title="Delete subcategory"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── 4. ADD MAIN CATEGORY MODAL ── */}
      {addCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setAddCategoryModal(false)}>
          <div className="bg-white rounded-2xl w-[calc(100vw-32px)] max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-900 text-base">Add Main Category</h3>
              <button onClick={() => setAddCategoryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sarees, Kurtis & Suits, Lehengas"
                  value={newCat.name}
                  onChange={e => setNewCat(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tagline / Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted pure silk & organza sarees"
                  value={newCat.description}
                  onChange={e => setNewCat(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Thumbnail Image URL (optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newCat.image}
                  onChange={e => setNewCat(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCat.active}
                    onChange={e => setNewCat(prev => ({ ...prev, active: e.target.checked }))}
                    className="accent-[#0b1b4f]"
                  />
                  Active in Store
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCat.showOnHomepage}
                    onChange={e => setNewCat(prev => ({ ...prev, showOnHomepage: e.target.checked }))}
                    className="accent-[#0b1b4f]"
                  />
                  Show on Homepage
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddCategoryModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAddCategory}
                disabled={!newCat.name.trim()}
                className="px-5 py-2 bg-[#0b1b4f] hover:bg-[#07133a] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. EDIT MAIN CATEGORY MODAL ── */}
      {editCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setEditCategoryModal(null)}>
          <div className="bg-white rounded-2xl w-[calc(100vw-32px)] max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-900 text-base">Edit Category</h3>
              <button onClick={() => setEditCategoryModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  value={editCategoryModal.name}
                  onChange={e => setEditCategoryModal(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tagline / Short Description</label>
                <input
                  type="text"
                  value={editCategoryModal.description || ''}
                  onChange={e => setEditCategoryModal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editCategoryModal.image || ''}
                  onChange={e => setEditCategoryModal(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCategoryModal.active !== false}
                    onChange={e => setEditCategoryModal(prev => ({ ...prev, active: e.target.checked }))}
                    className="accent-[#0b1b4f]"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCategoryModal.showOnHomepage !== false}
                    onChange={e => setEditCategoryModal(prev => ({ ...prev, showOnHomepage: e.target.checked }))}
                    className="accent-[#0b1b4f]"
                  />
                  Show on Homepage
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditCategoryModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditCategory}
                disabled={!editCategoryModal.name.trim()}
                className="px-5 py-2 bg-[#0b1b4f] hover:bg-[#07133a] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. ADD SUBCATEGORY MODAL ── */}
      {addSubModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setAddSubModal(null)}>
          <div className="bg-white rounded-2xl w-[calc(100vw-32px)] max-w-sm max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-900 text-base">Add Subcategory</h3>
              <button onClick={() => setAddSubModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Category *</label>
                <select
                  value={selectedCatIdForSub || addSubModal.catId}
                  onChange={e => setSelectedCatIdForSub(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-brand-teal"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Organza, Bridal, Cotton, Straight"
                  value={subNameInput}
                  onChange={e => setSubNameInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveAddSubcategory();
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddSubModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAddSubcategory}
                disabled={!subNameInput.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Add Subcategory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. EDIT SUBCATEGORY MODAL ── */}
      {editSubModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setEditSubModal(null)}>
          <div className="bg-white rounded-2xl w-[calc(100vw-32px)] max-w-sm max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-900 text-base">Edit Subcategory</h3>
              <button onClick={() => setEditSubModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  autoFocus
                  value={editSubModal.newName}
                  onChange={e => setEditSubModal(prev => ({ ...prev, newName: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveEditSubcategory();
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-teal"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditSubModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditSubcategory}
                disabled={!editSubModal.newName.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. CONFIRMATION MODAL ── */}
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
