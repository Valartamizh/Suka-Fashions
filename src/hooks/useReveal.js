import { useEffect, useRef } from 'react';

/**
 * useReveal - Attaches IntersectionObserver to a container ref.
 * All children with the class "reveal" inside the container get
 * the "visible" class added when the container enters the viewport.
 *
 * @param {object} options - IntersectionObserver options
 * @returns {ref} containerRef - Attach to the section wrapper element
 */
export function useReveal(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const revealItems = el.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
