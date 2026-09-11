// ContentContext.jsx — Unified Shared Content Store for Suka Fashions Admin CMS & Customer Storefront
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialHomeSections } from '../data/initialHomeContent';
import { contentService, formatPublishedDate } from '../services/contentService';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [publishedSections, setPublishedSections] = useState(initialHomeSections);
  const [draftSections, setDraftSections] = useState(initialHomeSections);
  const [meta, setMeta] = useState({
    status: 'PUBLISHED',
    lastPublishedAt: '11 Sep 2026, 09:15 AM',
    lastPublishedBy: 'Aditi Sharma',
  });
  const [versionHistory, setVersionHistory] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const reorderSections = useCallback((newOrderedSections) => {
    const indexed = newOrderedSections.map((sec, idx) => ({
      ...sec,
      order: idx + 1,
    }));
    setDraftSections(indexed);
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, []);

  const moveSection = useCallback((fromIndex, toIndex) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= draftSections.length || toIndex >= draftSections.length) return;
    setDraftSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
    setMeta((m) => ({ ...m, status: 'DRAFT' }));
  }, [draftSections.length]);

  const moveSectionUp = useCallback((id) => {
    const idx = draftSections.findIndex(s => s.id === id);
    if (idx > 0) moveSection(idx, idx - 1);
  }, [draftSections, moveSection]);

  const moveSectionDown = useCallback((id) => {
    const idx = draftSections.findIndex(s => s.id === id);
    if (idx >= 0 && idx < draftSections.length - 1) moveSection(idx, idx + 1);
  }, [draftSections, moveSection]);

  // Actions
  const saveDraft = useCallback(async () => {
    const res = await contentService.saveDraftContent(draftSections);
    if (res.success) {
      setMeta(res.meta);
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
    }
    return res;
  }, []);

  const resetContent = useCallback(async () => {
    const res = await contentService.resetToDefaults();
    setPublishedSections(res.published);
    setDraftSections(res.draft);
    setMeta(res.meta);
    setVersionHistory(res.history);
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
