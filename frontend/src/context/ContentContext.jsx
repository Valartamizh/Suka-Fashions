// ContentContext.jsx — Unified Shared Content Store for Suka Fashions Admin CMS & Customer Storefront
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialHomeSections } from '../data/initialHomeContent';
import { contentService, formatPublishedDate } from '../services/contentService';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [publishedSections, setPublishedSections] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('suka_content_published_v6');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return initialHomeSections;
  });

  const [draftSections, setDraftSections] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('suka_content_draft_v6');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return initialHomeSections;
  });

  const [meta, setMeta] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('suka_content_meta_v6');
        if (raw) return JSON.parse(raw);
      } catch (_) {}
    }
    return {
      status: 'PUBLISHED',
      lastPublishedAt: '11 Sep 2026, 09:15 AM',
      lastPublishedBy: 'Aditi Sharma',
    };
  });

  const [versionHistory, setVersionHistory] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('preview') === 'true';
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cross-tab synchronization via BroadcastChannel and storage events
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const bc = new BroadcastChannel('suka_cms_channel');
    bc.onmessage = (event) => {
      if (event.data?.type === 'DRAFT_UPDATED' && Array.isArray(event.data.draftSections)) {
        setDraftSections(event.data.draftSections);
      }
      if (event.data?.type === 'PUBLISHED_UPDATED' && Array.isArray(event.data.publishedSections)) {
        setPublishedSections(event.data.publishedSections);
      }
      if (event.data?.type === 'META_UPDATED' && event.data.meta) {
        setMeta(event.data.meta);
      }
    };
    return () => bc.close();
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'suka_content_draft_v6' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setDraftSections(parsed);
        } catch (_) {}
      }
      if (e.key === 'suka_content_published_v6' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPublishedSections(parsed);
        } catch (_) {}
      }
      if (e.key === 'suka_content_meta_v6' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed) setMeta(parsed);
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Initialize from contentService
  useEffect(() => {
    async function loadData() {
      try {
        const data = await contentService.fetchAdminContent();
        setPublishedSections(data.published);
        setDraftSections(data.draft);
        setMeta(data.meta);
        setVersionHistory(data.history);
      } catch (err) {
        console.error('Failed to initialize ContentContext:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Detect URL parameter ?preview=true on location change or load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('preview') === 'true') {
        setIsPreviewMode(true);
      }
    }
  }, []);

  // Auto-sync draftSections to localStorage so any opened preview window sees latest edits
  useEffect(() => {
    if (isLoading) return;
    try {
      localStorage.setItem('suka_content_draft_v5', JSON.stringify(draftSections));
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('suka_cms_channel');
        bc.postMessage({ type: 'DRAFT_UPDATED', draftSections });
        bc.close();
      }
    } catch (_) {}
  }, [draftSections, isLoading]);

  // Determine which section list to present to storefront:
  // When in Preview Mode, storefront renders draftSections. Otherwise, publishedSections.
  const activeStoreSections = isPreviewMode ? draftSections : publishedSections;

  // Storefront getters
  const isSectionActive = useCallback((id) => {
    const section = activeStoreSections.find(s => s.id === id);
    return section ? (section.enabled !== false) : true;
  }, [activeStoreSections]);

  const getSectionContent = useCallback((id) => {
    const section = activeStoreSections.find(s => s.id === id);
    return section ? section.content : {};
  }, [activeStoreSections]);

  // Admin CMS mutations (operate on draftSections and mark status as DRAFT)
  const toggleSection = useCallback((id) => {
    setDraftSections((prev) => {
      const updated = prev.map(s => {
        if (s.id === id) {
          const newEnabled = !(s.enabled !== false);
          return { ...s, enabled: newEnabled, active: newEnabled };
        }
        return s;
      });
      return updated;
    });
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, []);

  const updateSectionContent = useCallback((id, newContentOrFn) => {
    setDraftSections((prev) => {
      const updated = prev.map(s => {
        if (s.id === id) {
          const mergedContent = typeof newContentOrFn === 'function'
            ? newContentOrFn(s.content || {})
            : { ...s.content, ...newContentOrFn };
          return { ...s, content: mergedContent };
        }
        return s;
      });
      return updated;
    });
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, []);

  const updateSectionMeta = useCallback((id, fields) => {
    setDraftSections((prev) => {
      const updated = prev.map(s => {
        if (s.id === id) {
          return { ...s, ...fields };
        }
        return s;
      });
      return updated;
    });
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, []);

  const deleteSection = useCallback((id) => {
    setDraftSections((prev) => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, []);

  const reorderSections = useCallback((newOrderedSections) => {
    // Keep footer permanently fixed as the last section
    const nonFooter = newOrderedSections.filter(s => s.id !== 'footer');
    const footerSec = newOrderedSections.find(s => s.id === 'footer');
    const finalSections = footerSec ? [...nonFooter, footerSec] : nonFooter;
    const indexed = finalSections.map((sec, idx) => ({
      ...sec,
      order: idx + 1,
    }));
    setDraftSections(indexed);
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, []);

  const moveSection = useCallback((fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= draftSections.length || toIndex >= draftSections.length) return;
    setDraftSections((prev) => {
      // Prevent moving footer or moving any section into/beyond footer position
      if (prev[fromIndex]?.id === 'footer' || prev[toIndex]?.id === 'footer') {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, [draftSections.length]);

  const moveSectionUp = useCallback((id) => {
    if (id === 'footer') return; // Footer cannot be moved up
    const idx = draftSections.findIndex(s => s.id === id);
    if (idx > 0) moveSection(idx, idx - 1);
  }, [draftSections, moveSection]);

  const moveSectionDown = useCallback((id) => {
    if (id === 'footer') return; // Footer cannot be moved down
    const idx = draftSections.findIndex(s => s.id === id);
    // Don't move down if next section is footer or end of list
    if (idx >= 0 && idx < draftSections.length - 1 && draftSections[idx + 1]?.id !== 'footer') {
      moveSection(idx, idx + 1);
    }
  }, [draftSections, moveSection]);

  // Actions
  const saveDraft = useCallback(async () => {
    const res = await contentService.saveDraftContent(draftSections);
    if (res.success) {
      setMeta(res.meta);
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('suka_cms_channel');
        bc.postMessage({ type: 'DRAFT_UPDATED', draftSections: res.draft });
        bc.postMessage({ type: 'META_UPDATED', meta: res.meta });
        bc.close();
      }
    }
    return res;
  }, [draftSections]);

  const publishChanges = useCallback(async (publisherName = 'Aditi Sharma') => {
    const res = await contentService.publishContent(draftSections, publisherName);
    if (res.success) {
      setPublishedSections(res.published);
      setDraftSections(res.draft);
      setMeta(res.meta);
      setVersionHistory(res.history);
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('suka_cms_channel');
        bc.postMessage({ type: 'PUBLISHED_UPDATED', publishedSections: res.published });
        bc.postMessage({ type: 'DRAFT_UPDATED', draftSections: res.draft });
        bc.postMessage({ type: 'META_UPDATED', meta: res.meta });
        bc.close();
      }
    }
    return res;
  }, [draftSections]);

  const restoreVersion = useCallback(async (versionId, restorerName = 'Aditi Sharma') => {
    const res = await contentService.restoreContentVersion(versionId, restorerName);
    if (res.success) {
      setPublishedSections(res.published);
      setDraftSections(res.draft);
      setMeta(res.meta);
      setVersionHistory(res.history);
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('suka_cms_channel');
        bc.postMessage({ type: 'PUBLISHED_UPDATED', publishedSections: res.published });
        bc.postMessage({ type: 'DRAFT_UPDATED', draftSections: res.draft });
        bc.postMessage({ type: 'META_UPDATED', meta: res.meta });
        bc.close();
      }
    }
    return res;
  }, []);

  const resetContent = useCallback(async () => {
    const res = await contentService.resetToDefaults();
    setPublishedSections(res.published);
    setDraftSections(res.draft);
    setMeta(res.meta);
    setVersionHistory(res.history);
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('suka_cms_channel');
      bc.postMessage({ type: 'PUBLISHED_UPDATED', publishedSections: res.published });
      bc.postMessage({ type: 'DRAFT_UPDATED', draftSections: res.draft });
      bc.postMessage({ type: 'META_UPDATED', meta: res.meta });
      bc.close();
    }
    return res;
  }, []);

  return (
    <ContentContext.Provider
      value={{
        // Storefront & CMS active view
        sections: activeStoreSections,
        publishedSections,
        draftSections,
        status: meta.status || 'PUBLISHED',
        lastPublishedAt: meta.lastPublishedAt || '11 Sep 2026, 09:15 AM',
        lastPublishedBy: meta.lastPublishedBy || 'Aditi Sharma',
        versionHistory,
        isPreviewMode,
        isLoading,
        setIsPreviewMode,

        // Storefront queries
        isSectionActive,
        getSectionContent,

        // CMS operations
        toggleSection,
        updateSectionContent,
        updateSectionMeta,
        reorderSections,
        moveSection,
        moveSectionUp,
        moveSectionDown,
        deleteSection,
        saveDraft,
        publishChanges,
        restoreVersion,
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
