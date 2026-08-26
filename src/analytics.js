const MEASUREMENT_ID = 'G-99RRR8XBY3';
let lastPageViewPath = null;

function getGtag() {
  if (typeof window === 'undefined') return null;
  return typeof window.gtag === 'function' ? window.gtag : null;
}

export function trackEvent(name, params = {}) {
  const gtag = getGtag();
  if (!gtag || !name) return;
  gtag('event', name, params);
}

export function trackPageView() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const pagePath = window.location.pathname + window.location.search;
  if (pagePath === lastPageViewPath) return;
  const gtag = getGtag();
  if (!gtag) return;
  lastPageViewPath = pagePath;
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  });
}

export { MEASUREMENT_ID };