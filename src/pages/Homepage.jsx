import React, { useEffect } from 'react';
import Hero               from '../components/Hero';
import CategorySection    from '../components/CategorySection';
import NewArrivals        from '../components/NewArrivals';
import BestSellers        from '../components/BestSellers';
import TrendingNow        from '../components/TrendingNow';
import PromoBanner        from '../components/PromoBanner';
import CuratedCollections from '../components/CuratedCollections';
import OccasionSection    from '../components/OccasionSection';
import Craftsmanship      from '../components/Craftsmanship';
import BenefitsSection    from '../components/BenefitsSection';
import BrandStory         from '../components/BrandStory';
import Testimonials       from '../components/Testimonials';
import InstagramGallery   from '../components/InstagramGallery';
import Newsletter         from '../components/Newsletter';

export default function Homepage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full flex flex-col">
      <Hero />
      <CategorySection />
      <NewArrivals />
      <BestSellers />
      <PromoBanner />
      <TrendingNow />
      <OccasionSection />
      <CuratedCollections />
      <Craftsmanship />
      <BrandStory />
      <Testimonials />
      <InstagramGallery />
      <BenefitsSection />
      <Newsletter />
    </div>
  );
}
