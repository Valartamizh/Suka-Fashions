import React, { createContext, useContext, useState, useEffect } from 'react';

// Default local asset paths for fallback
import lehengaRed from '../assets/lehenga_red.jpg';
import lehengaPink from '../assets/lehenga_pink.jpg';
import lehengaMint from '../assets/lehenga_mint.jpg';
import sareeGolden from '../assets/saree_golden.jpg';
import sareeBeigePink from '../assets/saree_beige_pink.jpg';
import sareeBeigeMaroon from '../assets/saree_beige_maroon.jpg';
import sareeBeigeOrange from '../assets/saree_beige_orange.jpg';
import anarkaliBlackMulti from '../assets/anarkali_black_multicolor.jpg';
import kurtiTealPrinted from '../assets/kurti_teal_printed.jpg';
import kurtiPurplePrinted from '../assets/kurti_purple_printed.jpg';
import kurtiBrownPrinted from '../assets/kurti_brown_printed.jpg';
import coordSet from '../assets/coord_set.jpg';
import festiveSuit from '../assets/festive_suit.jpg';
import dressNavy from '../assets/dress_navy.jpg';

import dupattaSilk from '../assets/dupatta_silk.jpg';

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
    desc: 'Category cards & collections',
    active: true,
    updated: '2026-08-20',
    content: {
      eyebrow: 'Collections',
      title: 'Shop By Category',
      subtitle: 'Configure the categories and collection cards displayed in the "Shop By Category" section of the homepage. Customise tile labels, routing, colors, background gradients, and imagery in real-time.',
      viewAllText: 'View All',
      viewAllLink: '/products',
      tiles: [
        {
          id: 'cat-sarees',
          name: 'Sarees',
          link: '/category/sarees',
          targetRoute: 'sarees',
          themeColor: 'Orange Gradient',
          bgGradient: 'from-amber-200/90 via-orange-100 to-amber-100/80',
          borderColor: 'border-orange-200/80',
          textColor: 'text-amber-950',
          image: sareeGolden,
          order: 1,
          active: true,
        },
        {
          id: 'cat-lehengas',
          name: 'Lehengas',
          link: '/category/lehengas',
          targetRoute: 'lehengas',
          themeColor: 'Soft Pink',
          bgGradient: 'from-rose-100/90 via-pink-100 to-rose-100/80',
          borderColor: 'border-pink-200/80',
          textColor: 'text-rose-950',
          image: lehengaRed,
          order: 2,
          active: true,
        },
        {
          id: 'cat-kurtis',
          name: 'Kurtis & Suits',
          link: '/category/kurtis',
          targetRoute: 'kurtis',
          themeColor: 'Mint Green',
          bgGradient: 'from-emerald-100/90 via-teal-100/80 to-green-100/80',
          borderColor: 'border-emerald-200/80',
          textColor: 'text-emerald-950',
          image: anarkaliBlackMulti,
          order: 3,
          active: true,
        },
        {
          id: 'cat-dresses',
          name: 'Dresses',
          link: '/category/dresses',
          targetRoute: 'dresses',
          themeColor: 'Lavender Purple',
          bgGradient: 'from-purple-100/90 via-violet-100 to-indigo-100/80',
          borderColor: 'border-purple-200/80',
          textColor: 'text-purple-950',
          image: dressNavy,
          order: 4,
          active: true,
        },
        {
          id: 'cat-coords',
          name: 'Co-ords',
          link: '/category/coords',
          targetRoute: 'coords',
          themeColor: 'Teal Elegance',
          bgGradient: 'from-teal-100/90 via-cyan-100 to-emerald-100/80',
          borderColor: 'border-teal-200/80',
          textColor: 'text-teal-950',
          image: coordSet,
          order: 5,
          active: true,
        },
        {
          id: 'cat-dupattas',
          name: 'Dupattas',
          link: '/category/dupattas',
          targetRoute: 'dupattas',
          themeColor: 'Sky Blue',
          bgGradient: 'from-sky-100/90 via-blue-100/80 to-cyan-100/80',
          borderColor: 'border-sky-200/80',
          textColor: 'text-sky-950',
          image: dupattaSilk,
          order: 6,
          active: true,
        },
        {
          id: 'cat-festive',
          name: 'Festive Wear',
          link: '/category/occasion',
          targetRoute: 'festive',
          themeColor: 'Soft Gold',
          bgGradient: 'from-amber-100/90 via-yellow-100/80 to-amber-100/70',
          borderColor: 'border-amber-200/80',
          textColor: 'text-amber-950',
          image: festiveSuit,
          order: 7,
          active: true,
        },
      ],
    },
  },
  {
    id: 'promo-banners',
    label: 'Promo Banners',
    desc: 'Promotional banners and special offer campaigns',
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
      banners: [
        {
          id: 'promo-1',
          order: 1,
          title: 'Royal Heritage Silks',
          subtitle: 'Handcrafted Pure Kanchipuram & Organza',
          description: 'Explore authentic handwoven pure silk & organza sarees at up to 40% off.',
          type: 'PROMOTION',
          ctaText: 'Shop Sarees',
          ctaLink: '/category/sarees',
          targetRoute: 'sarees',
          image: sareeGolden,
          active: true,
        },
        {
          id: 'promo-2',
          order: 2,
          title: 'Bridal & Festive Couture',
          subtitle: 'Exclusive Zardozi & Velvet Lehengas',
          description: 'Luxury bridal ensembles with intricate handcrafted dori, sequins and cutdana work.',
          type: 'COLLECTION',
          ctaText: 'Explore Lehengas',
          ctaLink: '/category/lehengas',
          targetRoute: 'lehengas',
          image: lehengaRed,
          active: true,
        },
        {
          id: 'promo-3',
          order: 3,
          title: 'Contemporary Festive Edit',
          subtitle: 'Kurtis, Co-ords & Anarkali Sets',
          description: 'Effortlessly chic breathable silhouettes designed for modern celebratory occasions.',
          type: 'NEW ARRIVAL',
          ctaText: 'Discover Kurtis',
          ctaLink: '/category/kurtis',
          targetRoute: 'kurtis',
          image: anarkaliBlackMulti,
          active: true,
        },
      ],
    },
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    desc: 'Fresh product drops showcase',
    active: true,
    updated: '2026-08-22',
    content: {
      eyebrow: 'Just In',
      title: 'New Arrivals',
      viewAllText: 'View All',
      viewAllLink: '/products?sort=newest',
      maxItems: 10,
      customItems: [
        { id: 'prd-3136', productId: 'PRD-3136', name: 'Teal Embroidered Organza Saree', category: 'Sarees', price: 3499, order: 1, active: true, image: sareeGolden },
        { id: 'prd-3138', productId: 'PRD-3138', name: 'Golden Zari Banarasi Silk Saree', category: 'Sarees', price: 4599, order: 2, active: true, image: sareeBeigeMaroon },
        { id: 'prd-3139', productId: 'PRD-3139', name: 'Crimson Bridal Velvet Lehenga', category: 'Lehengas', price: 12999, order: 3, active: true, image: lehengaRed },
        { id: 'prd-3140', productId: 'PRD-3140', name: 'Blush Pink Sequin Party Lehenga', category: 'Lehengas', price: 8499, order: 4, active: true, image: lehengaPink },
        { id: 'prd-3141', productId: 'PRD-3141', name: 'Mint Pastel Organza Lehenga', category: 'Lehengas', price: 7999, order: 5, active: true, image: lehengaMint },
        { id: 'prd-3142', productId: 'PRD-3142', name: 'Blush Pink Scalloped Organza Saree', category: 'Sarees', price: 3899, order: 6, active: true, image: sareeBeigePink },
        { id: 'prd-3145', productId: 'PRD-3145', name: 'Festive Orange Zari Georgette Saree', category: 'Sarees', price: 2999, order: 7, active: true, image: sareeBeigeOrange },
        { id: 'prd-3147', productId: 'PRD-3147', name: 'Chanderi Floral Printed Saree', category: 'Sarees', price: 2499, order: 8, active: true, image: coordSet },
        { id: 'prd-3148', productId: 'PRD-3148', name: 'Kanchipuram Style Crimson Saree', category: 'Sarees', price: 5299, order: 9, active: true, image: festiveSuit },
        { id: 'prd-3150', productId: 'PRD-3150', name: 'Royal Purple Bandhani Silk Saree', category: 'Sarees', price: 4399, order: 10, active: true, image: kurtiPurplePrinted },
      ],
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
      maxItems: 9,
      customItems: [
        { id: 'prd-3136', productId: 'PRD-3136', name: 'Teal Embroidered Organza Saree', category: 'Sarees', price: 3499, order: 1, active: true, image: sareeGolden },
        { id: 'prd-3138', productId: 'PRD-3138', name: 'Golden Zari Banarasi Silk Saree', category: 'Sarees', price: 4599, order: 2, active: true, image: sareeBeigeMaroon },
        { id: 'prd-3139', productId: 'PRD-3139', name: 'Crimson Bridal Velvet Lehenga', category: 'Lehengas', price: 12999, order: 3, active: true, image: lehengaRed },
        { id: 'prd-3140', productId: 'PRD-3140', name: 'Blush Pink Sequin Party Lehenga', category: 'Lehengas', price: 8499, order: 4, active: true, image: lehengaPink },
        { id: 'prd-3144', productId: 'PRD-3144', name: 'Maroon & Beige Dual-Tone Saree', category: 'Sarees', price: 3299, order: 5, active: true, image: sareeBeigeOrange },
        { id: 'prd-3146', productId: 'PRD-3146', name: 'Vintage Black Zari Saree', category: 'Sarees', price: 4199, order: 6, active: true, image: anarkaliBlackMulti },
        { id: 'prd-3148', productId: 'PRD-3148', name: 'Kanchipuram Style Crimson Saree', category: 'Sarees', price: 5299, order: 7, active: true, image: festiveSuit },
        { id: 'prd-3150', productId: 'PRD-3150', name: 'Royal Purple Bandhani Silk Saree', category: 'Sarees', price: 4399, order: 8, active: true, image: kurtiPurplePrinted },
        { id: 'prd-3153', productId: 'PRD-3153', name: 'Emerald Green Silk Lehenga', category: 'Lehengas', price: 11499, order: 9, active: true, image: lehengaMint },
      ],
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
      eyebrow: 'Client Feedback',
      title: 'Reviews',
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
          return initialDefaultSections.map(defaultSec => {
            const matched = parsed.find(p => p.id === defaultSec.id);
            if (!matched) return defaultSec;

            if (defaultSec.id === 'hero') {
              const defaultSlides = defaultSec.content?.slides || [];
              const matchedSlides = matched.content?.slides || [];
              const mergedSlides = (matchedSlides.length > 0 ? matchedSlides : defaultSlides).map((mSlide, idx) => {
                const defSlide = defaultSlides[idx] || {};
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

            // Sanitize legacy mattress placeholder names
            const hasLegacyTiles = (matched.content?.tiles || []).some(t => ['Hybrid', 'Firm', 'dddd'].includes(t.name));
            const hasLegacyBanners = (matched.content?.banners || []).some(b => b.title?.includes('Mattress') || b.title === 'Classic Comfort');
            const hasLegacyItems = (matched.content?.customItems || []).some(item => item.name === 'FoamCloud');

            const safeTiles = (matched.content?.tiles && matched.content.tiles.length > 0 && !hasLegacyTiles)
              ? matched.content.tiles
              : defaultSec.content?.tiles;

            const safeBanners = (matched.content?.banners && matched.content.banners.length > 0 && !hasLegacyBanners)
              ? matched.content.banners
              : defaultSec.content?.banners;

            const safeCustomItems = (matched.content?.customItems && matched.content.customItems.length > 0 && !hasLegacyItems)
              ? matched.content.customItems
              : defaultSec.content?.customItems;

            return {
              ...defaultSec,
              ...matched,
              content: {
                ...defaultSec.content,
                ...matched.content,
                tiles: safeTiles,
                banners: safeBanners,
                customItems: safeCustomItems,
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

  const reorderSections = (newSections) => {
    setSections(newSections);
  };

  const moveSection = (fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= sections.length || toIndex >= sections.length) return;
    setSections(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
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
        reorderSections,
        moveSection,
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
