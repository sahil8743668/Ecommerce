import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}
