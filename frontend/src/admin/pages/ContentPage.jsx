// ContentPage — /admin/content
import React, { useState } from 'react';
import {
  LayoutTemplate, ImagePlay, Grid3x3, Sparkles, TrendingUp,
  Image, ShoppingBag, Palette, BookOpen, Scissors, Star,
  Instagram, Gift, Mail, Edit, ToggleLeft, ToggleRight,
  ExternalLink, X, Save, Check, RotateCcw, AlertCircle
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useContent } from '../../context/ContentContext';

const ICON_MAP = {
  announcement: LayoutTemplate,
  hero: ImagePlay,
  categories: Grid3x3,
  'new-arrivals': Sparkles,
  'best-sellers': TrendingUp,
  'promo-banners': Image,
  trending: TrendingUp,
  occasion: ShoppingBag,
  collections: Palette,
  'brand-story': BookOpen,
  craftsmanship: Scissors,
  testimonials: Star,
  instagram: Instagram,
  benefits: Gift,
  newsletter: Mail,
};

export default function ContentPage() {
  const { sections, toggleSection, updateSectionContent, resetContent } = useContent();

  const [editSection, setEditSection] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenEdit = (section) => {
    setEditSection(section);
    setEditForm(section.content || {});
  };

  const promptToggleSection = (section) => {
    const willActive = !section.active;
    setConfirmModal({
      title: willActive ? 'Enable Section' : 'Disable Section',
      message: `Are you sure you want to ${willActive ? 'enable and display' : 'hide'} "${section.label}" on the storefront homepage?`,
      confirmLabel: willActive ? 'Enable Section' : 'Disable Section',
      variant: 'brand',
      onConfirm: () => {
        toggleSection(section.id);
        showToast(`"${section.label}" ${willActive ? 'enabled' : 'hidden'}. Changes are live on homepage.`);
      },
    });
  };

  const promptSaveEdit = () => {
    if (!editSection) return;
    setConfirmModal({
      title: `Save ${editSection.label} Changes`,
      message: `Are you sure you want to save changes to "${editSection.label}"?`,
      confirmLabel: 'Save Changes',
      variant: 'brand',
      onConfirm: () => {
        updateSectionContent(editSection.id, editForm);
        showToast(`"${editSection.label}" content updated successfully!`);
        setEditSection(null);
      },
    });
  };

  const promptReset = () => {
    setConfirmModal({
      title: 'Reset Content Settings',
      message: 'Are you sure you want to reset all homepage content settings to default?',
      confirmLabel: 'Reset Settings',
      variant: 'danger',
      onConfirm: () => {
        resetContent();
        showToast('Homepage content settings reset to defaults.');
      },
    });
  };

  return (
    <div className="space-y-5 relative">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-[fadeInUp_0.25s_ease-out]">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check size={14} />
          </div>
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      <AdminPageHeader title="Content Management" subtitle="Edit homepage sections without changing code.">
        <div className="flex items-center gap-2">
          <button
            onClick={promptReset}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-slate-200 text-xs font-semibold text-slate-500 hover:text-red-600 hover:border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal hover:bg-brand-tealDark text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <ExternalLink size={13} /> Preview Homepage
          </a>
        </div>
      </AdminPageHeader>

      {/* Info banner */}
      <div className="bg-brand-powder border border-brand-teal/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-tealDark mb-0.5">Live Homepage Content Editor</p>
          <p className="text-xs text-brand-tealDark/80">
            Toggle sections on/off, edit section headlines and content, and confirm changes. All edits immediately reflect live on the storefront homepage!
          </p>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const IconComponent = ICON_MAP[section.id] || LayoutTemplate;
          return (
            <div
              key={section.id}
              className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                section.active ? 'border-slate-100' : 'border-slate-100 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        section.active ? 'bg-brand-powder text-brand-teal' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-slate-800 text-sm leading-tight">{section.label}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">{section.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => promptToggleSection(section)}
                    className={`flex-shrink-0 mt-0.5 transition-colors ${
                      section.active ? 'text-brand-teal' : 'text-slate-300 hover:text-slate-400'
                    }`}
                    title={section.active ? 'Click to disable section' : 'Click to enable section'}
                  >
                    {section.active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400">Updated {section.updated}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        section.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {section.active ? 'Active' : 'Hidden'}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(section)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-powder hover:bg-brand-teal text-brand-teal hover:text-white text-xs font-semibold rounded-lg transition-all"
                    >
                      <Edit size={11} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditSection(null)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-powder rounded-lg flex items-center justify-center text-brand-teal">
                  {React.createElement(ICON_MAP[editSection.id] || LayoutTemplate, { size: 16 })}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-slate-800 text-sm">Edit {editSection.label}</h3>
                  <p className="text-[10px] text-slate-400">Customize live content for this section</p>
                </div>
              </div>
              <button onClick={() => setEditSection(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {editSection.id === 'announcement' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Edit announcement bar message items:</p>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message 1</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.item1 || ''}
                      onChange={(e) => setEditForm({ ...editForm, item1: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message 2</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.item2 || ''}
                      onChange={(e) => setEditForm({ ...editForm, item2: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Message 3</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.item3 || ''}
                      onChange={(e) => setEditForm({ ...editForm, item3: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {editSection.id === 'newsletter' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Headline</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal resize-none"
                      value={editForm.subtitle || ''}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Button Label</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.buttonText || ''}
                      onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {editSection.id === 'brand-story' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tag / Eyebrow</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.eyebrow || ''}
                      onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Heading</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paragraph</label>
                    <textarea
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal resize-none"
                      value={editForm.paragraph || ''}
                      onChange={(e) => setEditForm({ ...editForm, paragraph: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {editSection.id === 'instagram' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Instagram Handle</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.handle || ''}
                      onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Section Title</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {['categories', 'new-arrivals', 'best-sellers', 'trending', 'occasion', 'collections', 'craftsmanship', 'testimonials', 'benefits', 'promo-banners'].includes(editSection.id) && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Eyebrow / Tagline</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.eyebrow || ''}
                      onChange={(e) => setEditForm({ ...editForm, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Section Title</label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-brand-teal"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setEditSection(null)}
                className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={promptSaveEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
              >
                <Save size={14} /> Save Changes
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
