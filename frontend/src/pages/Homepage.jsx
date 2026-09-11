import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, ExternalLink, ArrowRight, X, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import NewArrivals from '../components/NewArrivals';
import BestSellers from '../components/BestSellers';
import FourPillars from '../components/FourPillars';
import BenefitsSection from '../components/BenefitsSection';
import TrendingNow from '../components/TrendingNow';
import PromoBanner from '../components/PromoBanner';
import OccasionSection from '../components/OccasionSection';
import CuratedCollections from '../components/CuratedCollections';
import BrandStory from '../components/BrandStory';
import Craftsmanship from '../components/Craftsmanship';
import Testimonials from '../components/Testimonials';
import InstagramGallery from '../components/InstagramGallery';
import Newsletter from '../components/Newsletter';
import { useContent } from '../context/ContentContext';

export default function Homepage() {
  const { sections, isPreviewMode, setIsPreviewMode, status } = useContent();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle URL query ?preview=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('preview') === 'true') {
      setIsPreviewMode(true);
    }
  }, [location.search, setIsPreviewMode]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleExitPreview = () => {
    setIsPreviewMode(false);
    navigate('/', { replace: true });
  };

  const renderSection = (sec) => {
    switch (sec.id) {
      case 'hero':
        return <Hero key="hero" />;
      case 'categories':
        return <CategorySection key="categories" />;
      case 'new-arrivals':
        return <NewArrivals key="new-arrivals" />;
      case 'best-sellers':
        return <BestSellers key="best-sellers" />;
      case 'promo-banners':
        return <PromoBanner key="promo-banners" />;
      case 'trending':
        return <TrendingNow key="trending" />;
      case 'occasion':
        return <OccasionSection key="occasion" />;
      case 'collections':
        return <CuratedCollections key="collections" />;
      case 'brand-story':
        return <BrandStory key="brand-story" />;
      case 'craftsmanship':
        return <Craftsmanship key="craftsmanship" />;
      case 'testimonials':
        return <Testimonials key="testimonials" />;
      case 'instagram':
        return <InstagramGallery key="instagram" />;
      case 'four-pillars':
      case 'benefits':
        return <FourPillars key="four-pillars" />;
      case 'newsletter':
        return <Newsletter key="newsletter" />;
      default:
        return null;
    }
  };

  // Filter out announcement bar (rendered in MainLayout) and hidden sections, then sort by order
  const visibleSections = [...sections]
    .filter(s => (s.enabled !== false && s.active !== false) && s.id !== 'announcement' && s.id !== 'footer')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="w-full flex flex-col">
      {/* ─── Floating Store Preview Banner (Shown only when in Preview Mode) ─── */}
      {isPreviewMode && (
        <aside
          aria-label="Store Preview Mode Banner"
          className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] flex items-center justify-between gap-3 text-xs font-semibold border-t border-amber-600/30 animate-[fadeInUp_0.2s_ease-out]"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950" />
            </span>
            <span className="uppercase tracking-wider font-bold">Store Preview Mode</span>
            <span className="hidden sm:inline text-slate-900 font-normal">
              — Displaying current unpublished draft content.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/content"
              className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded-md text-[11px] font-bold tracking-wide transition-colors"
            >
              Return to CMS
            </Link>
            <button
              onClick={handleExitPreview}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/40 hover:bg-white/60 text-slate-950 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
            >
              <X size={13} /> Exit Preview
            </button>
          </div>
        </aside>
      )}

      {/* ─── Dynamic Homepage Sections in Configured Order ─── */}
      {visibleSections.map(sec => renderSection(sec))}
    </div>
  );
}
