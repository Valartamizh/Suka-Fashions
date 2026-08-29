import React, { createContext, useContext, useState, useEffect } from 'react';

const initialDefaultSections = [
  {
    id: 'announcement',
    label: 'Announcement Bar',
    desc: 'Free shipping & offer bar',
    active: true,
    updated: '2026-08-25',
    content: {
      item1: 'FREE SHIPPING ABOVE ₹1999',
      item2: 'EASY RETURNS & EXCHANGES',
      item3: 'COD AVAILABLE ACROSS INDIA',
    },
  },
  {
    id: 'hero',
    label: 'Hero Slider',
    desc: '3 slides configured',
    active: true,
    updated: '2026-08-25',
    content: {
      slides: [
        {
          id: 1,
          eyebrow: 'HERITAGE LEHENGAS',
          headingLine1: 'Royal',
          headingLine2: 'Occasions.',
          subtitle: 'Experience royalty in our signature sequin & velvet lehenga collections.',
          ctaText: 'SHOP NEW ARRIVALS',
          ctaLink: '/products',
          active: true,
        },
        {
          id: 2,
          eyebrow: 'FESTIVE COUTURE',
          headingLine1: 'Grace in',
          headingLine2: 'Every Drape.',
          subtitle: 'Intricate embroideries. Premium organza & Kanchipuram silk drapes.',
          ctaText: 'EXPLORE SAREES',
          ctaLink: '/category/sarees',
          active: true,
        },
        {
          id: 3,
          eyebrow: 'TIMELESS WEAVES',
          headingLine1: 'Elegance,',
          headingLine2: 'Made for You.',
          subtitle: 'Contemporary silhouettes rooted in timeless Indian tradition.',
          ctaText: 'DISCOVER ALL',
          ctaLink: '/products',
          active: true,
        },
      ],
    },
  },
  {
    id: 'categories',
    label: 'Shop By Category',
    desc: '7 categories shown',
    active: true,
    updated: '2026-08-20',
    content: { eyebrow: 'Collections', title: 'Shop By Category' },
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    desc: 'Auto from isNew flag',
    active: true,
    updated: '2026-08-22',
    content: { eyebrow: 'Fresh Drops', title: 'New Arrivals' },
  },
  {
    id: 'best-sellers',
    label: 'Best Sellers',
    desc: 'Auto from sales data',
    active: true,
    updated: '2026-08-22',
    content: { eyebrow: 'Most Loved', title: 'Best Sellers' },
  },
  {
    id: 'promo-banners',
    label: 'Promotional Banners',
    desc: '2 banners active',
    active: true,
    updated: '2026-08-18',
    content: {
      banner1Title: 'Festive Discount',
      banner1Sub: 'Up to 40% off on designer kurtis',
      banner2Title: 'Bridal Edit',
      banner2Sub: 'Handcrafted sarees for special celebrations',
    },
  },
  {
    id: 'trending',
    label: 'Trending Now',
    desc: 'Manually curated',
    active: true,
    updated: '2026-08-24',
    content: { eyebrow: 'Curated Selection', title: 'Trending Now' },
  },
  {
    id: 'occasion',
    label: 'Shop By Occasion',
    desc: '6 occasions shown',
    active: true,
    updated: '2026-08-10',
    content: { eyebrow: 'Occasion Edit', title: 'Shop By Occasion' },
  },
  {
    id: 'collections',
    label: 'Curated Collections',
    desc: '3 collections',
    active: true,
    updated: '2026-08-15',
    content: { eyebrow: 'Handpicked For You', title: 'Curated Collections' },
  },
  {
    id: 'brand-story',
    label: 'Brand Story',
    desc: 'Heritage & values section',
    active: true,
    updated: '2026-08-01',
    content: {
      eyebrow: 'Our Story',
      title: 'Preserving Indian Heritage Craft',
      paragraph: 'Suka Fashions brings together centuries-old weaving techniques with modern aesthetic sensibilities to deliver timeless luxury ethnic wear.',
    },
  },
  {
    id: 'craftsmanship',
    label: 'Craftsmanship',
    desc: 'Quality storytelling',
    active: true,
    updated: '2026-08-01',
    content: { eyebrow: 'Artistry', title: 'Behind The Craft' },
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    desc: '3 featured reviews',
    active: true,
    updated: '2026-08-20',
    content: { eyebrow: 'Testimonials', title: 'Loved By Thousands' },
  },
  {
    id: 'instagram',
    label: 'Instagram Section',
    desc: 'Marquee gallery + handle',
    active: true,
    updated: '2026-08-12',
    content: { handle: '@sukafashions', title: 'Join Our Community' },
  },
  {
    id: 'benefits',
    label: 'Benefits Strip',
    desc: '4 benefits shown',
    active: true,
    updated: '2026-08-05',
    content: { title: 'Why Shop With Suka' },
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    desc: 'Email capture section',
    active: true,
    updated: '2026-08-01',
    content: {
      title: 'JOIN THE SUKA CLUB',
      subtitle: 'Subscribe to receive updates, access to exclusive deals, and 10% off your first order.',
      buttonText: 'SUBSCRIBE',
    },
  },
];

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('suka_content_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('Error parsing suka_content_settings:', err);
      }
    }
    return initialDefaultSections;
  });

  useEffect(() => {
    try {
      localStorage.setItem('suka_content_settings', JSON.stringify(sections));
    } catch (err) {
      console.error('Error saving suka_content_settings:', err);
    }
  }, [sections]);

  const isSectionActive = (id) => {
    const section = sections.find(s => s.id === id);
    return section ? section.active : true;
  };

  const getSectionContent = (id) => {
    const section = sections.find(s => s.id === id);
    return section ? section.content : {};
  };

  const toggleSection = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !s.active, updated: today } : s))
    );
  };

  const updateSectionContent = (id, newContent) => {
    const today = new Date().toISOString().split('T')[0];
    setSections(prev =>
      prev.map(s => (s.id === id ? { ...s, content: { ...s.content, ...newContent }, updated: today } : s))
    );
  };

  const resetContent = () => {
    setSections(initialDefaultSections);
    localStorage.removeItem('suka_content_settings');
  };

  return (
    <ContentContext.Provider
      value={{
        sections,
        isSectionActive,
        getSectionContent,
        toggleSection,
        updateSectionContent,
        resetContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
