import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Instantly scroll window to top whenever route or search parameters change
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
