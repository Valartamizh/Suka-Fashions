// ContentPage — /admin/content
import React, { useState } from 'react';
import {
  LayoutTemplate, ImagePlay, Grid3x3, Sparkles, TrendingUp,
  Image, ShoppingBag, Palette, BookOpen, Scissors, Star,
  Instagram, Gift, Mail, ChevronRight, Eye, Edit, ToggleLeft, ToggleRight,
  ExternalLink, X, Save,
} from 'lucide-react';
import AdminPageHeader from '../components/ui/AdminPageHeader';

const SECTIONS = [
  { id: 'announcement', icon: LayoutTemplate, label: 'Announcement Bar', desc: 'Free shipping & offer bar', slides: null, active: true, updated: '2026-08-25' },
  { id: 'hero', icon: ImagePlay, label: 'Hero Slider', desc: '3 slides configured', slides: 3, active: true, updated: '2026-08-25' },
  { id: 'categories', icon: Grid3x3, label: 'Shop By Category', desc: '7 categories shown', slides: null, active: true, updated: '2026-08-20' },
  { id: 'new-arrivals', icon: Sparkles, label: 'New Arrivals', desc: 'Auto from isNew flag', slides: null, active: true, updated: '2026-08-22' },
  { id: 'best-sellers', icon: TrendingUp, label: 'Best Sellers', desc: 'Auto from sales data', slides: null, active: true, updated: '2026-08-22' },
  { id: 'promo-banners', icon: Image, label: 'Promotional Banners', desc: '2 banners active', slides: 2, active: true, updated: '2026-08-18' },
  { id: 'trending', icon: TrendingUp, label: 'Trending Now', desc: 'Manually curated', slides: null, active: true, updated: '2026-08-24' },
  { id: 'occasion', icon: ShoppingBag, label: 'Shop By Occasion', desc: '6 occasions shown', slides: null, active: true, updated: '2026-08-10' },
  { id: 'collections', icon: Palette, label: 'Curated Collections', desc: '3 collections', slides: 3, active: true, updated: '2026-08-15' },
  { id: 'brand-story', icon: BookOpen, label: 'Brand Story', desc: 'Heritage & values section', slides: null, active: true, updated: '2026-08-01' },
  { id: 'craftsmanship', icon: Scissors, label: 'Craftsmanship', desc: 'Quality storytelling', slides: null, active: true, updated: '2026-08-01' },
  { id: 'testimonials', icon: Star, label: 'Testimonials', desc: '3 featured reviews', slides: null, active: true, updated: '2026-08-20' },
  { id: 'instagram', icon: Instagram, label: 'Instagram Section', desc: 'Marquee gallery + handle', slides: null, active: true, updated: '2026-08-12' },
  { id: 'benefits', icon: Gift, label: 'Benefits Strip', desc: '4 benefits shown', slides: null, active: false, updated: '2026-08-05' },
  { id: 'newsletter', icon: Mail, label: 'Newsletter', desc: 'Email capture section', slides: null, active: true, updated: '2026-08-01' },
];

// Edit modal content for different section types
function HeroEditModal({ section, onClose }) {
  const [slides, setSlides] = useState([
    {
      id: 1,
      eyebrow: 'New Collection 2026',
      heading: 'Grace in Every Thread',
      description: 'Discover our exclusive festive collection crafted for the modern Indian woman.',
      ctaText: 'Shop the Collection',
      ctaLink: '/products',
      active: true,
    },
    {
      id: 2,
      eyebrow: 'Bridal Season',
      heading: 'Your Dream Bridal Look',
      description: 'Exquisite lehengas and sarees for your most special day.',
      ctaText: 'Explore Bridal',
      ctaLink: '/category/lehengas',
      active: true,
    },
    {
      id: 3,
      eyebrow: 'Sale — Up to 50% Off',
      heading: 'Festive Sale is Here',
      description: 'Stock up on premium ethnic wear at unbeatable prices.',
      ctaText: 'Shop Sale',
      ctaLink: '/category/sale',
      active: false,
    },
  ]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400 mb-4">Manage hero slider content. Changes will reflect on the storefront homepage.</p>
      {slides.map((slide, i) => (
        <div key={slide.id} className={`border rounded-xl p-4 ${slide.active ? 'border-brand-teal/30 bg-brand-powder/20' : 'border-slate-200 bg-slate-50/50 opacity-60'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600">Slide {i + 1}</span>
            <button
              onClick={() => setSlides(ss => ss.map((s, j) => j === i ? { ...s, active: !s.active } : s))}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${slide.active ? 'bg-brand-teal text-white' : 'bg-slate-200 text-slate-500'}`}
            >
              {slide.active ? 'Active' : 'Inactive'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Eyebrow', 'eyebrow'],
              ['Heading', 'heading'],
              ['CTA Text', 'ctaText'],
              ['CTA Link', 'ctaLink'],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{label}</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-teal"
                  value={slide[key]}
                  onChange={e => setSlides(ss => ss.map((s, j) => j === i ? { ...s, [key]: e.target.value } : s))}
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
              <textarea
                className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-brand-teal resize-none"
                rows={2}
                value={slide.description}
                onChange={e => setSlides(ss => ss.map((s, j) => j === i ? { ...s, description: e.target.value } : s))}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GenericEditModal({ section }) {
  return (
    <div className="py-4 text-center text-sm text-slate-400">
      <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
        <section.icon size={20} className="text-slate-400" />
      </div>
      <p className="font-semibold text-slate-600 mb-1">Edit {section.label}</p>
      <p className="text-xs">Full editor available in connected backend mode.</p>
    </div>
  );
}

export default function ContentPage() {
  const [sections, setSections] = useState(SECTIONS);
  const [editSection, setEditSection] = useState(null);

  const toggleSection = (id) => {
    setSections(ss => ss.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader title="Content Management" subtitle="Edit homepage sections without changing code.">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ExternalLink size={13} /> Preview Homepage
        </a>
      </AdminPageHeader>

      {/* Info banner */}
      <div className="bg-brand-powder border border-brand-teal/20 rounded-xl p-4">
        <p className="text-sm font-semibold text-brand-tealDark mb-1">📝 Visual Content Editor</p>
        <p className="text-xs text-brand-tealDark/70">
          Edit and manage every section of your homepage from here. Toggle sections on/off, edit content, and reorder as needed.
          Changes will be reflected on the storefront when connected to the backend.
        </p>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => (
          <div
            key={section.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
              section.active ? 'border-slate-100' : 'border-slate-100 opacity-70'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    section.active ? 'bg-brand-powder text-brand-teal' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <section.icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-800 text-sm leading-tight">{section.label}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{section.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`flex-shrink-0 mt-0.5 ${section.active ? 'text-brand-teal' : 'text-slate-300'}`}
                  title={section.active ? 'Disable section' : 'Enable section'}
                >
                  {section.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400">Updated {section.updated}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    section.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {section.active ? 'Active' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => setEditSection(section)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-powder hover:bg-brand-teal text-brand-teal hover:text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    <Edit size={11} /> Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditSection(null)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-powder rounded-lg flex items-center justify-center text-brand-teal">
                  <editSection.icon size={16} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-slate-800 text-sm">Edit {editSection.label}</h3>
                  <p className="text-[10px] text-slate-400">Homepage section content editor</p>
                </div>
              </div>
              <button onClick={() => setEditSection(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {editSection.id === 'hero' ? (
                <HeroEditModal section={editSection} onClose={() => setEditSection(null)} />
              ) : (
                <GenericEditModal section={editSection} />
              )}
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={() => setEditSection(null)} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => setEditSection(null)}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-tealDark text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
