// CategoriesPage — /admin/categories
import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  X,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../../components/ui/AdminPageHeader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useCategories } from '../../../context/CategoryContext';

export default function CategoriesPage() {
  const {
    categories,
    toggleHomepage,
    toggleVisibility,
    addCategory,
    editCategory,
    deleteCategory,
    moveCategory,
    addSubcategory,
    removeSubcategory,
    resetCategories
  } = useCategories();

  const [expanded, setExpanded] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  const [newCat, setNewCat] = useState({
    name: '',
    subcategories: '',
    image: '',
    showOnHomepage: true,
    active: true
  });

  const [newSubInput, setNewSubInput] = useState({});

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  // Confirmation Prompts for Actions
  const promptToggleHomepage = (cat) => {
    const willShow = !cat.showOnHomepage;
    setConfirmModal({
      title: willShow ? 'Show on Homepage' : 'Remove from Homepage',
      message: `Are you sure you want to ${willShow ? 'add' : 'remove'} "${cat.name}" ${willShow ? 'to' : 'from'} the storefront homepage?`,
      confirmLabel: willShow ? 'Add to Homepage' : 'Remove from Homepage',
      variant: 'brand',
      onConfirm: () => {
        toggleHomepage(cat.id);
        showToast(`"${cat.name}" updated! Changes are live on the landing page.`);
      }
    });
  };

  const promptToggleVisibility = (cat) => {
    const willActive = !cat.active;
    setConfirmModal({
      title: willActive ? 'Make Category Visible' : 'Hide Category',
      message: `Are you sure you want to ${willActive ? 'show' : 'hide'} "${cat.name}" in your store?`,
      confirmLabel: willActive ? 'Make Visible' : 'Hide Category',
      variant: 'brand',
      onConfirm: () => {
        toggleVisibility(cat.id);
        showToast(`"${cat.name}" visibility set to ${willActive ? 'Visible' : 'Hidden'}.`);
      }
    });
  };

  const promptMove = (cat, direction) => {
    setConfirmModal({
      title: `Move Category ${direction === 'up' ? 'Up' : 'Down'}`,
      message: `Are you sure you want to move "${cat.name}" ${direction === 'up' ? 'up' : 'down'} in position?`,
      confirmLabel: 'Confirm Move',
      variant: 'brand',
      onConfirm: () => {
        moveCategory(cat.id, direction);
        showToast(`Moved "${cat.name}" ${direction}. Category order updated.`);
      }
    });
  };

  const promptDelete = (cat) => {
    setConfirmModal({
      title: 'Delete Category',
      message: `Are you sure you want to delete category "${cat.name}"? Products in this category will not be affected.`,
      confirmLabel: 'Delete Category',
      variant: 'danger',
      onConfirm: () => {
        deleteCategory(cat.id);
        showToast(`Category "${cat.name}" deleted.`);
      }
    });
  };

  const promptAddCategory = () => {
    if (!newCat.name.trim()) return;
    setConfirmModal({
      title: 'Create New Category',
      message: `Are you sure you want to create the new category "${newCat.name}"?`,
      confirmLabel: 'Create Category',
      variant: 'brand',
      onConfirm: () => {
        addCategory(newCat);
        setAddModal(false);
        showToast(`Category "${newCat.name}" created and synced with the landing page!`);
        setNewCat({ name: '', subcategories: '', image: '', showOnHomepage: true, active: true });
      }
    });
  };

  const promptEditCategory = () => {
    if (!editModal || !editModal.name.trim()) return;
    setConfirmModal({
      title: 'Save Category Changes',
      message: `Are you sure you want to update category "${editModal.name}"?`,
      confirmLabel: 'Save Changes',
      variant: 'brand',
      onConfirm: () => {
        editCategory(editModal.id, editModal);
        setEditModal(null);
        showToast(`Category "${editModal.name}" updated successfully!`);
      }
    });
  };

  const promptRemoveSubcategory = (cat, sub) => {
    setConfirmModal({
      title: 'Remove Subcategory',
      message: `Are you sure you want to remove "${sub}" from "${cat.name}"?`,
      confirmLabel: 'Remove Subcategory',
      variant: 'danger',
      onConfirm: () => {
        removeSubcategory(cat.id, sub);
        showToast(`Subcategory "${sub}" removed.`);
      }
    });
  };

  const promptAddSubcategory = (cat) => {
    const val = newSubInput[cat.id];
    if (!val || !val.trim()) return;
    setConfirmModal({
      title: 'Add Subcategory',
      message: `Are you sure you want to add subcategory "${val.trim()}" to "${cat.name}"?`,
      confirmLabel: 'Add Subcategory',
      variant: 'brand',
      onConfirm: () => {
        addSubcategory(cat.id, val.trim());
        setNewSubInput(prev => ({ ...prev, [cat.id]: '' }));
        showToast(`Subcategory "${val.trim()}" added to "${cat.name}".`);
      }
    });
  };

  const promptReset = () => {
    setConfirmModal({
      title: 'Reset to Default Categories',
      message: 'Are you sure you want to reset all categories to their default initial state?',
      confirmLabel: 'Reset Categories',
      variant: 'danger',
      onConfirm: () => {
        resetCategories();
        showToast('Categories reset to initial defaults.');
      }
    });
  };

  return (
    <div className="space-y-5 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-[fadeInUp_0.25s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <AdminPageHeader title="Categories" subtitle="Manage your product categories, homepage displays, and subcategories.">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <ExternalLink size={13} /> View Landing Page
          </Link>

          <button
            onClick={promptReset}
            title="Reset to default categories"
            className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={14} /> Add Category
          </button>
        </div>
      </AdminPageHeader>

      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              cat.active ? 'border-slate-100' : 'border-slate-100 opacity-60 bg-slate-50/50'
            }`}
          >
            {/* Category row */}
            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4">
              {/* Up/Down order controls */}
              <div className="flex flex-col items-center justify-center gap-0.5 text-slate-400 flex-shrink-0">
                <button
                  disabled={index === 0}
                  onClick={() => promptMove(cat, 'up')}
                  className="hover:text-brand-teal disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                  title="Move Up"
                >
                  <ChevronUp size={14} />
                </button>
                <span className="text-[11px] font-bold text-slate-400 w-4 text-center leading-none">
                  {index + 1}
                </span>
                <button
                  disabled={index === categories.length - 1}
                  onClick={() => promptMove(cat, 'down')}
                  className="hover:text-brand-teal disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                  title="Move Down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Image */}
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=80'}
                alt={cat.name}
                className="w-12 h-12 object-cover rounded-lg border border-slate-100 flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-sans font-bold text-slate-800 text-sm">{cat.name}</h3>
                  {!cat.active && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Hidden</span>
                  )}
                  {cat.showOnHomepage && (
                    <span className="text-[10px] font-bold text-brand-teal bg-brand-powder px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Sparkles size={10} /> Homepage
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(cat.subcategories || []).length} subcategories
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => promptToggleHomepage(cat)}
                  title={cat.showOnHomepage ? 'Click to remove from homepage' : 'Click to display on homepage'}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
                    cat.showOnHomepage
                      ? 'border-brand-teal/40 bg-brand-powder text-brand-teal hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                      : 'border-slate-200 text-slate-500 hover:bg-brand-powder hover:border-brand-teal hover:text-brand-teal'
                  }`}
                >
                  {cat.showOnHomepage ? 'On Homepage' : 'Add to Homepage'}
                </button>

                <button
                  onClick={() => promptToggleVisibility(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                  title={cat.active ? 'Hide Category' : 'Show Category'}
                >
                  {cat.active ? <Eye size={14} /> : <EyeOff size={14} className="text-slate-300" />}
                </button>

                <button
                  onClick={() => setEditModal(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                  title="Edit Category"
                >
                  <Edit size={14} />
                </button>

                <button
                  onClick={() => promptDelete(cat)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 size={14} />
                </button>

                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                  title="Toggle Subcategories"
                >
                  {expanded[cat.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              </div>
            </div>

            {/* Subcategories drawer */}
            {expanded[cat.id] && (
              <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subcategories</p>
                
                <div className="flex flex-wrap items-center gap-2">
                  {(cat.subcategories || []).map(sub => (
                    <div key={sub} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs">
                      <span className="text-xs text-slate-700 font-medium">{sub}</span>
                      <button
                        onClick={() => promptRemoveSubcategory(cat, sub)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title="Remove subcategory"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Add subcategory inline input */}
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
                    <input
                      type="text"
                      placeholder="New subcategory..."
                      className="text-xs outline-none w-32 px-1 text-slate-700 placeholder:text-slate-300"
                      value={newSubInput[cat.id] || ''}
                      onChange={e => setNewSubInput(prev => ({ ...prev, [cat.id]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') promptAddSubcategory(cat);
                      }}
                    />
                    <button
                      onClick={() => promptAddSubcategory(cat)}
                      className="text-xs bg-brand-teal hover:bg-brand-tealDark text-white px-2 py-0.5 rounded font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus size={11} /> Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
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
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Image URL (optional)</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                  placeholder="https://..."
                  value={newCat.image}
                  onChange={e => setNewCat(n => ({ ...n, image: e.target.value }))}
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
              <div className="flex items-center gap-4 pt-1">
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
                onClick={promptAddCategory}
                disabled={!newCat.name.trim()}
                className="flex-1 bg-brand-teal hover:bg-brand-tealDark disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-sans font-bold text-slate-800 text-base mb-4">Edit Category</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Category Name *</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                  value={editModal.name}
                  onChange={e => setEditModal(n => ({ ...n, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Image URL</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                  value={editModal.image || ''}
                  onChange={e => setEditModal(n => ({ ...n, image: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Subcategories (comma separated)</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-teal"
                  value={Array.isArray(editModal.subcategories) ? editModal.subcategories.join(', ') : editModal.subcategories || ''}
                  onChange={e => setEditModal(n => ({ ...n, subcategories: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={editModal.active} onChange={e => setEditModal(n => ({ ...n, active: e.target.checked }))} className="accent-brand-teal" />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={editModal.showOnHomepage} onChange={e => setEditModal(n => ({ ...n, showOnHomepage: e.target.checked }))} className="accent-brand-teal" />
                  Show on Homepage
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditModal(null)} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button
                onClick={promptEditCategory}
                disabled={!editModal.name.trim()}
                className="flex-1 bg-brand-teal hover:bg-brand-tealDark disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
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
