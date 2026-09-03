import React, { createContext, useContext, useState, useEffect } from 'react';

// Default local asset paths for fallback
import lehengaRed from '../assets/lehenga_red.jpg';
import lehengaPink from '../assets/lehenga_pink.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';
import sareeGolden from '../assets/saree_golden.jpg';
import sareeBeigeMaroon from '../assets/saree_beige_maroon.jpg';
import sareeBeigeOrange from '../assets/saree_beige_orange.jpg';
import anarkaliBlackMulti from '../assets/anarkali_black_multicolor.jpg';
import kurtiPurplePrinted from '../assets/kurti_purple_printed.jpg';
import kurtiBrownPrinted from '../assets/kurti_brown_printed.jpg';
import coordSet from '../assets/coord_set.jpg';

export const initialDefaultSections = [
  {
    id: 'announcement',
    label: 'Announcement Bar',
    desc: 'Top header alert ticker',
    active: true,
    updated: '2026-08-25',
    content: {
      item1: 'FREE SHIPPING ABOVE ₹1999',
      item2: 'EASY RETURNS & EXCHANGES',
      item3: 'COD AVAILABLE ACROSS INDIA',
      speedSeconds: 4,
    },
  },
  {
    id: 'hero',
    label: 'Hero Slider',
    desc: 'Full-screen rotating showcase',
    active: true,
    updated: '2026-08-25',
    content: {
      autoplayInterval: 7,
      socialProofText: 'Loved by 10,000+ Women',
      slides: [
        {
          id: 1,
          eyebrow: 'HERITAGE LEHENGAS',
          headingLine1: 'Royal',
          headingLine2: 'Occasions.',
          subtitle: 'Experience royalty in our signature sequin & velvet lehenga collections.',
          ctaText: 'SHOP NEW ARRIVALS',
          ctaLink: '/products',
          secondaryCtaText: 'EXPLORE SAREES',
          secondaryCtaLink: '/category/sarees',
          mainImage: lehengaRed,
          detailImageLeft: lehengaPink,
          detailImageRight: lehengaMint,
          mainLabel: 'Royal Occasions.',
          leftEyebrow: 'DETAILS',
          leftTitle: 'Handcrafted\nembroidery',
          rightEyebrow: 'THE EDIT',
          rightTitle: 'Timeless celebration\nwear',
          accentBg: '#EBF5F5',
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
          secondaryCtaText: 'NEW ARRIVALS',
          secondaryCtaLink: '/products',
          mainImage: sareeGolden,
          detailImageLeft: sareeBeigeMaroon,
          detailImageRight: sareeBeigeOrange,
          mainLabel: 'Grace in Every Drape.',
          leftEyebrow: 'DETAILS',
          leftTitle: 'Exquisite organza\ndetails',
          rightEyebrow: 'THE EDIT',
          rightTitle: 'Modern festive\nsilhouettes',
          accentBg: '#E8F3F5',
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
          secondaryCtaText: 'VIEW KURTIS',
          secondaryCtaLink: '/category/kurtis',
          mainImage: anarkaliBlackMulti,
          detailImageLeft: kurtiPurplePrinted,
          detailImageRight: coordSet,
          mainLabel: 'Elegance, Made for You.',
          leftEyebrow: 'DETAILS',
          leftTitle: 'Traditional zardozi\ncraft',
          rightEyebrow: 'THE EDIT',
          rightTitle: 'Heritage premium\nweaves',
          accentBg: '#EBF4F5',
          active: true,
        },
      ],
    },
  },
  {
    id: 'categories',
    label: 'Shop By Category',
    desc: 'Circular category cards',
    active: true,
    updated: '2026-08-20',
    content: {
      eyebrow: 'Collections',
      title: 'Shop By Category',
      subtitle: 'Explore our handpicked curation across all ethnic silhouettes',
    },
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    desc: 'Fresh product drops carousel',
    active: true,
    updated: '2026-08-22',
    content: {
      eyebrow: 'Just In',
      title: 'New Arrivals',
      viewAllText: 'View All',
      viewAllLink: '/products?sort=newest',
      maxItems: 10,
    },
  },
  {
    id: 'best-sellers',
    label: 'Best Sellers',
    desc: 'Most loved client favourites',
    active: true,
    updated: '2026-08-22',
    content: {
      eyebrow: 'Most Loved',
      title: 'Best Sellers',
      viewAllText: 'View All',
      viewAllLink: '/products?sort=popular',
      maxItems: 8,
    },
  },
  {
    id: 'four-pillars',
    label: 'Four Pillars of Excellence',
    desc: 'Trust badges & values',
    active: true,
    updated: '2026-08-10',
    content: {
      eyebrow: 'The Suka Promise',
      title: 'Four Pillars of Excellence',
      item1Title: 'Authentic Weaves',
      item1Desc: 'Direct from master artisanal clusters across India with certified pure silks.',
      item2Title: 'Bespoke Finishing',
      item2Desc: 'Handcrafted embroideries and tailored fits created to drape like poetry.',
      item3Title: 'Complimentary Express',
      item3Desc: 'Secure doorstep express delivery across all pin codes in India.',
      item4Title: 'Easy 7-Day Returns',
      item4Desc: 'Hassle-free exchange and returns guarantee for complete peace of mind.',
    },
  },
  {
    id: 'promo-banners',
    label: 'Promotional Banner',
    desc: 'Wide editorial spotlight banner',
    active: true,
    updated: '2026-08-18',
    content: {
      eyebrow: 'Featured Collections',
      title: 'Curated For You',
      subtitle: 'Grace in Every Drape • Comfort in Every Stitch',
      description: 'Explore our handwoven pure silk & organza sarees and effortlessly chic printed sets.',
      ctaText: 'EXPLORE ALL',
      ctaLink: '/products',
      image: sareeGolden,
    },
  },
  {
    id: 'trending',
    label: 'Trending Now',
    desc: 'Trending fashion highlights',
    active: true,
    updated: '2026-08-24',
    content: {
      eyebrow: 'Curated Selection',
      title: 'Trending Now',
      viewAllText: 'View All',
      viewAllLink: '/products',
    },
  },
  {
    id: 'occasion',
    label: 'Shop By Occasion',
    desc: 'Occasion based drapes & styles',
    active: true,
    updated: '2026-08-10',
    content: {
      eyebrow: 'Occasion Edit',
      title: 'Shop By Occasion',
    },
  },
  {
    id: 'collections',
    label: 'Curated Collections',
    desc: 'Handpicked themed collections',
    active: true,
    updated: '2026-08-15',
    content: {
      eyebrow: 'Handpicked For You',
      title: 'Curated Collections',
      ctaText: 'DISCOVER ALL',
      ctaLink: '/products',
      items: [
        {
          id: 'under-1999',
          title: 'Under ₹1999',
          subtitle: 'Affordable Luxury',
          image: kurtiBrownPrinted,
          link: '/products?price=under-2000',
        },
        {
          id: 'new-season',
          title: 'New Season',
          subtitle: 'Latest Arrivals',
          image: sareeBeigeOrange,
          link: '/products?sort=newest',
        },
        {
          id: 'wedding-guest',
          title: 'Wedding Guest',
          subtitle: 'Celebration Ready',
          image: lehengaPink,
          link: '/category/occasion',
        },
        {
          id: 'everyday-essentials',
          title: 'Everyday Essentials',
          subtitle: 'Breathable Comfort',
          image: coordSet,
          link: '/category/kurtis',
        },
      ],
    },
  },
  {
    id: 'testimonials',
    label: 'Testimonials & Reviews',
    desc: 'Real client reviews',
    active: true,
    updated: '2026-08-20',
    content: {
      eyebrow: 'Testimonials',
      title: 'Loved By Thousands',
      subtitle: 'Stories of elegance and joy shared by our valued patrons across the globe.',
      items: [
        {
          id: 1,
          name: 'Ananya Deshmukh',
          city: 'Mumbai',
          stars: 5,
          quote: 'The crimson lehenga exceeded all my expectations. The fabric quality and zardozi detailing are magnificent!',
          tag: 'Bridal Edit',
        },
        {
          id: 2,
          name: 'Pooja Sundaram',
          city: 'Bangalore',
          stars: 5,
          quote: 'I wore the Kanchipuram silk drape for my sister’s wedding and received non-stop compliments. Truly royal.',
          tag: 'Pure Silk Saree',
        },
        {
          id: 3,
          name: 'Ritu Khurana',
          city: 'Delhi',
          stars: 5,
          quote: 'The organza saree drapes effortlessly and feels weightless. Suka Fashions is now my go-to luxury ethnic destination.',
          tag: 'Organza Drape',
        },
      ],
    },
  },
  {
    id: 'instagram',
    label: 'Instagram Community',
    desc: 'Editorial social showcase',
    active: true,
    updated: '2026-08-12',
    content: {
      handle: '@sukafashions',
      title: 'Join Our Community',
      subtitle: 'Tag #SukaElegance on Instagram to get featured in our editorial gallery',
      followers: '120k Followers',
      images: [
        lehengaRed,
        sareeGolden,
        anarkaliBlackMulti,
        coordSet,
        lehengaPink,
        sareeBeigeMaroon,
      ],
    },
  },
  {
    id: 'brand-story',
    label: 'Brand Story',
    desc: 'Heritage & craft storytelling',
    active: true,
    updated: '2026-08-01',
    content: {
      eyebrow: 'Our Story',
      title: 'Preserving Indian Heritage Craft',
      paragraph: 'Suka Fashions brings together centuries-old weaving techniques with modern aesthetic sensibilities to deliver timeless luxury ethnic wear.',
      highlight1: '100% Handcrafted Luxury',
      highlight2: 'Ethically Sourced Silks',
      highlight3: 'Custom Tailored Fit',
    },
  },
  {
    id: 'newsletter',
    label: 'Newsletter & Club',
    desc: 'Email subscription signup',
    active: true,
    updated: '2026-08-01',
    content: {
      eyebrow: 'Exclusive Access',
      title: 'JOIN THE SUKA CLUB',
      subtitle: 'Subscribe to receive updates, access to exclusive deals, and 10% off your first order.',
      buttonText: 'SUBSCRIBE',
      placeholder: 'Enter your email address',
      disclaimer: 'By subscribing, you agree to receive promotional updates. Unsubscribe anytime.',
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
          // Merge with initial defaults to ensure newly added keys are always available
          return initialDefaultSections.map(defaultSec => {
            const matched = parsed.find(p => p.id === defaultSec.id);
            if (!matched) return defaultSec;

            if (defaultSec.id === 'hero') {
              const defaultSlides = defaultSec.content?.slides || [];
              const matchedSlides = matched.content?.slides || [];
              const mergedSlides = defaultSlides.map((defSlide, idx) => {
                const mSlide = matchedSlides[idx] || {};
                return {
                  ...defSlide,
                  ...mSlide,
                  mainImage: mSlide.mainImage || defSlide.mainImage,
                  detailImageLeft: mSlide.detailImageLeft || defSlide.detailImageLeft,
                  detailImageRight: mSlide.detailImageRight || defSlide.detailImageRight,
                };
              });
              return {
                ...defaultSec,
                ...matched,
                content: {
                  ...defaultSec.content,
                  ...matched.content,
                  slides: mergedSlides,
                },
              };
            }

            return {
              ...defaultSec,
              ...matched,
              content: {
                ...defaultSec.content,
                ...matched.content,
                image: matched.content?.image || defaultSec.content?.image,
              },
            };
          });
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
