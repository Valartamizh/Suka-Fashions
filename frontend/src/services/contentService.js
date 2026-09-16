// contentService.js — Frontend Content Management Service (Prepared for Spring Boot REST API)
import { initialHomeSections } from '../data/initialHomeContent';

const STORAGE_KEY_PUBLISHED = 'suka_content_published_v6';
const STORAGE_KEY_DRAFT = 'suka_content_draft_v6';
const STORAGE_KEY_META = 'suka_content_meta_v6';
const STORAGE_KEY_HISTORY = 'suka_content_history_v6';

// Helper to format date in clean editorial format (e.g., "11 Sep 2026, 09:15 AM")
export function formatPublishedDate(date = new Date()) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = hours.toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
}

const defaultInitialHistory = [
  {
    versionId: 'v12',
    versionNumber: 12,
    publishedAt: '11 Sep 2026, 09:15 AM',
    publishedBy: 'Aditi Sharma (Super Admin)',
    status: 'Current',
    changeSummary: 'Updated festive hero slides and autumn category showcases',
  },
  {
    versionId: 'v11',
    versionNumber: 11,
    publishedAt: '08 Sep 2026, 05:40 PM',
    publishedBy: 'Aditi Sharma',
    status: 'Archived',
    changeSummary: 'Added new wedding guest curated collection and promotional banner',
  },
  {
    versionId: 'v10',
    versionNumber: 10,
    publishedAt: '01 Sep 2026, 11:20 AM',
    publishedBy: 'Super Admin',
    status: 'Archived',
    changeSummary: 'Initial Grand Festive launch layout with instagram marquee updates',
  },
];

function migrateLegacyPromoBanners(sections) {
  if (!Array.isArray(sections)) return sections;
  const legacyIdx = sections.findIndex(s => s.id === 'promo-banners');
  if (legacyIdx === -1) return sections;

  const legacy = sections[legacyIdx];
  const b1 = legacy.content?.banners?.[0] || {};
  const b2 = legacy.content?.banners?.[1] || {};

  const sec1 = {
    id: 'promo-banner-1',
    type: 'promo-banner',
    label: 'Promotional Banner 1',
    desc: 'Primary campaign banner showcase (e.g. Royal Heritage Silks)',
    enabled: legacy.enabled !== false && b1.enabled !== false,
    active: legacy.enabled !== false && b1.enabled !== false,
    order: legacy.order || 4,
    content: {
      id: b1.id || 'promo-1',
      title: b1.title || 'Royal Heritage Silks',
      subtitle: b1.subtitle || 'Handcrafted Pure Kanchipuram & Organza',
      description: b1.description || 'Explore authentic handwoven pure silk & organza sarees at up to 40% off.',
      type: b1.type || 'PROMOTION',
      ctaText: b1.ctaText || 'SHOP SAREES',
      ctaLink: b1.ctaLink || '/category/sarees',
      image: b1.image || '',
      theme: b1.theme || 'Teal Elegance',
      enabled: b1.enabled !== false,
    },
  };

  const sec2 = {
    id: 'promo-banner-2',
    type: 'promo-banner',
    label: 'Promotional Banner 2',
    desc: 'Secondary campaign banner showcase (e.g. Bridal & Festive Couture)',
    enabled: legacy.enabled !== false && b2.enabled !== false,
    active: legacy.enabled !== false && b2.enabled !== false,
    order: (legacy.order || 4) + 4,
    content: {
      id: b2.id || 'promo-2',
      title: b2.title || 'Bridal & Festive Couture',
      subtitle: b2.subtitle || 'Exclusive Zardozi & Velvet Lehengas',
      description: b2.description || 'Luxury bridal ensembles with intricate handcrafted dori, sequins and cutdana work.',
      type: b2.type || 'COLLECTION',
      ctaText: b2.ctaText || 'EXPLORE LEHENGAS',
      ctaLink: b2.ctaLink || '/category/lehengas',
      image: b2.image || '',
      theme: b2.theme || 'Rose Gold',
      enabled: b2.enabled !== false,
    },
  };

  return [
    ...sections.slice(0, legacyIdx),
    sec1,
    ...sections.slice(legacyIdx + 1),
    sec2,
  ];
}

function sanitizeSections(rawSections) {
  if (!Array.isArray(rawSections) || rawSections.length === 0) {
    return initialHomeSections;
  }
  const sections = migrateLegacyPromoBanners(rawSections);

  // Map over the provided sections to respect user additions, reorderings, and deletions
  const mapped = sections.map((sec, idx) => {
    const defaultSec = initialHomeSections.find(s => s.id === sec.id) || {};
    return {
      ...defaultSec,
      ...sec,
      enabled: sec.enabled !== undefined ? sec.enabled : (defaultSec.enabled !== undefined ? defaultSec.enabled : true),
      active: sec.active !== undefined ? sec.active : (sec.enabled !== undefined ? sec.enabled : true),
      order: typeof sec.order === 'number' ? sec.order : idx + 1,
      content: {
        ...(defaultSec.content || {}),
        ...(sec.content || {}),
      },
    };
  });

  // Ensure newly introduced standard sections (e.g. promo-banner-3) exist
  initialHomeSections.forEach(initSec => {
    if (!mapped.some(s => s.id === initSec.id)) {
      mapped.push({ ...initSec });
    }
  });

  // Sort sections by order and re-index sequentially
  return mapped.sort((a, b) => (a.order || 0) - (b.order || 0)).map((s, idx) => ({ ...s, order: idx + 1 }));
}

export const contentService = {
  // GET /api/content/home — Customer Landing Page (Published only)
  async fetchPublishedContent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PUBLISHED);
      if (raw) {
        const parsed = JSON.parse(raw);
        return sanitizeSections(parsed);
      }
    } catch (err) {
      console.warn('Error reading published content:', err);
    }
    return initialHomeSections;
  },

  // GET /api/content/home/preview — Storefront Preview Mode (Draft content)
  async fetchDraftContent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (raw) {
        const parsed = JSON.parse(raw);
        return sanitizeSections(parsed);
      }
    } catch (err) {
      console.warn('Error reading draft content:', err);
    }
    return this.fetchPublishedContent();
  },

  // GET /api/admin/content/home — Admin CMS (Meta, Draft, Published & History)
  async fetchAdminContent() {
    let published = await this.fetchPublishedContent();
    let draft = await this.fetchDraftContent();
    
    let meta = {
      status: 'PUBLISHED',
      lastPublishedAt: '11 Sep 2026, 09:15 AM',
      lastPublishedBy: 'Aditi Sharma',
    };

    try {
      const rawMeta = localStorage.getItem(STORAGE_KEY_META);
      if (rawMeta) {
        meta = { ...meta, ...JSON.parse(rawMeta) };
      }
    } catch (_) {}

    let history = defaultInitialHistory;
    try {
      const rawHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (rawHistory) {
        history = JSON.parse(rawHistory);
      }
    } catch (_) {}

    return {
      published,
      draft,
      meta,
      history,
    };
  },

  // PUT /api/admin/content/home/draft — Save Draft
  async saveDraftContent(draftSections) {
    const sanitized = sanitizeSections(draftSections);
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(sanitized));
      
      const currentMetaRaw = localStorage.getItem(STORAGE_KEY_META);
      const currentMeta = currentMetaRaw ? JSON.parse(currentMetaRaw) : {};
      const updatedMeta = {
        ...currentMeta,
        status: 'DRAFT',
        lastDraftSavedAt: formatPublishedDate(new Date()),
      };
      localStorage.setItem(STORAGE_KEY_META, JSON.stringify(updatedMeta));

      return { success: true, draft: sanitized, meta: updatedMeta };
    } catch (err) {
      console.error('Failed to save draft:', err);
      return { success: false, error: err.message };
    }
  },

  // POST /api/admin/content/home/publish — Publish Draft to Live Store
  async publishContent(draftSections, publisherName = 'Aditi Sharma') {
    const sanitized = sanitizeSections(draftSections);
    const nowFormatted = formatPublishedDate(new Date());

    try {
      // 1. Save as Published
      localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(sanitized));
      // 2. Draft is now synchronized with Published
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(sanitized));

      // 3. Update Meta
      const updatedMeta = {
        status: 'PUBLISHED',
        lastPublishedAt: nowFormatted,
        lastPublishedBy: publisherName,
        lastDraftSavedAt: nowFormatted,
      };
      localStorage.setItem(STORAGE_KEY_META, JSON.stringify(updatedMeta));

      // 4. Record Version History
      let history = defaultInitialHistory;
      try {
        const rawHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
        if (rawHistory) history = JSON.parse(rawHistory);
      } catch (_) {}

      const nextVersionNum = (history[0]?.versionNumber || 12) + 1;
      const newVersion = {
        versionId: `v${nextVersionNum}`,
        versionNumber: nextVersionNum,
        publishedAt: nowFormatted,
        publishedBy: publisherName,
        status: 'Current',
        changeSummary: 'Homepage storefront content published via Admin CMS',
        sections: sanitized,
      };

      const updatedHistory = [
        newVersion,
        ...history.map(h => ({ ...h, status: 'Archived' })),
      ].slice(0, 20); // Keep last 20

      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));

      return {
        success: true,
        published: sanitized,
        draft: sanitized,
        meta: updatedMeta,
        history: updatedHistory,
      };
    } catch (err) {
      console.error('Failed to publish content:', err);
      return { success: false, error: err.message };
    }
  },

  // GET /api/admin/content/home/history
  async fetchContentHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return defaultInitialHistory;
  },

  // POST /api/admin/content/home/restore/{versionId}
  async restoreContentVersion(versionId, restorerName = 'Aditi Sharma') {
    const history = await this.fetchContentHistory();
    const target = history.find(h => h.versionId === versionId);
    if (!target) return { success: false, error: 'Version not found' };

    const sectionsToRestore = target.sections || initialHomeSections;
    return this.publishContent(sectionsToRestore, `${restorerName} (Restored ${versionId})`);
  },

  // Reset to Factory Defaults
  async resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY_PUBLISHED);
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    localStorage.removeItem(STORAGE_KEY_META);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    return {
      published: initialHomeSections,
      draft: initialHomeSections,
      meta: {
        status: 'PUBLISHED',
        lastPublishedAt: '11 Sep 2026, 09:15 AM',
        lastPublishedBy: 'Aditi Sharma (Default)',
      },
      history: defaultInitialHistory,
    };
  },
};
