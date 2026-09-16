import { useEffect, useRef } from 'react';

/**
 * useReveal - Attaches IntersectionObserver to a container ref.
 * All children with the class "reveal" inside the container get
 * the "visible" class added when they enter the viewport or are already visible.
 * Uses MutationObserver to automatically discover and reveal dynamically rendered elements.
 *
 * @param {object} options - IntersectionObserver options
 * @returns {ref} containerRef - Attach to the section wrapper element
 */
export function useReveal(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      el.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
      return;
    }

    const observedSet = new WeakSet();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px 0px 50px 0px', ...options }
    );

    const observeNewItems = () => {
      const revealItems = el.querySelectorAll('.reveal:not(.visible)');
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      revealItems.forEach((item) => {
        if (!observedSet.has(item)) {
          observedSet.add(item);
          // Check if element is already within or near the visible viewport
          const rect = item.getBoundingClientRect();
          if (rect.top <= viewportHeight + 50 && rect.bottom >= -50) {
            item.classList.add('visible');
          } else {
            observer.observe(item);
          }
        }
      });
    };

    // Initial pass
    observeNewItems();

    // Observe dynamically added children (e.g. products loaded from context/API)
    const mutationObserver = new MutationObserver(() => {
      observeNewItems();
    });

    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return containerRef;
}

