import React, { useEffect } from 'react';
import Hero               from '../components/Hero';
import CategorySection    from '../components/CategorySection';
import NewArrivals        from '../components/NewArrivals';
import BestSellers        from '../components/BestSellers';
import FourPillars        from '../components/FourPillars';
import TrendingNow        from '../components/TrendingNow';
import PromoBanner        from '../components/PromoBanner';
import OccasionSection    from '../components/OccasionSection';
import CuratedCollections from '../components/CuratedCollections';
import BrandStory         from '../components/BrandStory';
import Testimonials       from '../components/Testimonials';
import InstagramGallery   from '../components/InstagramGallery';
import Newsletter         from '../components/Newsletter';
import { useContent }     from '../context/ContentContext';

export default function Homepage() {
  const { sections } = useContent();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const renderSection = (id) => {
    switch (id) {
      case 'hero':
        return <Hero key="hero" />;
      case 'categories':
        return <CategorySection key="categories" />;
      case 'new-arrivals':
        return <NewArrivals key="new-arrivals" />;
      case 'best-sellers':
        return <BestSellers key="best-sellers" />;
      case 'four-pillars':
        return <FourPillars key="four-pillars" />;
      case 'promo-banners':
        return <PromoBanner key="promo-banners" />;
      case 'trending':
        return <TrendingNow key="trending" />;
      case 'occasion':
        return <OccasionSection key="occasion" />;
      case 'collections':
        return <CuratedCollections key="collections" />;
      case 'testimonials':
        return <Testimonials key="testimonials" />;
      case 'instagram':
        return <InstagramGallery key="instagram" />;
      case 'brand-story':
        return <BrandStory key="brand-story" />;
      case 'newsletter':
        return <Newsletter key="newsletter" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col">
      {sections
        .filter(s => s.active && s.id !== 'announcement')
        .map(s => renderSection(s.id))}
    </div>
  );
}

