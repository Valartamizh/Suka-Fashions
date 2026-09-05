import React, { useEffect } from 'react';
import Hero               from '../components/Hero';
import CategorySection    from '../components/CategorySection';
import NewArrivals        from '../components/NewArrivals';
import BestSellers        from '../components/BestSellers';
import FourPillars        from '../components/FourPillars';
import TrendingNow        from '../components/TrendingNow';
import PromoBanner        from '../components/PromoBanner';
import OccasionSection    from '../components/OccasionSection';
import Testimonials       from '../components/Testimonials';
import InstagramGallery   from '../components/InstagramGallery';
import { useContent }     from '../context/ContentContext';

export default function Homepage() {
  const { isSectionActive } = useContent();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full flex flex-col">
      {isSectionActive('hero') && <Hero />}
      {isSectionActive('categories') && <CategorySection />}
      {isSectionActive('new-arrivals') && <NewArrivals />}
      {isSectionActive('best-sellers') && <BestSellers />}
      {isSectionActive('four-pillars') && <FourPillars />}
      {isSectionActive('promo-banners') && <PromoBanner />}
      {isSectionActive('trending') && <TrendingNow />}
      {isSectionActive('occasion') && <OccasionSection />}
      {isSectionActive('testimonials') && <Testimonials />}
      {isSectionActive('instagram') && <InstagramGallery />}
    </div>
  );
}

