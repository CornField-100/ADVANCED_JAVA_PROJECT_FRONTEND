import { useEffect } from 'react';

/**
 * Performance monitoring component for Web Vitals and bundle analysis
 * Only runs in production to avoid development overhead
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only monitor in production
    if (import.meta.env.PROD) {
      // Monitor Core Web Vitals
      const reportWebVitals = (metric) => {
        console.log(`🎯 Web Vital - ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });

        // Send to analytics service (Google Analytics, etc.)
        if (window.gtag) {
          window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          });
        }
      };

      // Dynamic import for web-vitals to avoid increasing bundle size
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(reportWebVitals);
        onFID(reportWebVitals);
        onFCP(reportWebVitals);
        onLCP(reportWebVitals);
        onTTFB(reportWebVitals);
      }).catch(() => {
        console.warn('⚠️ Web Vitals monitoring not available');
      });

      // Monitor chunk loading performance
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const start = performance.now();
        return originalFetch.apply(this, args).then(response => {
          const duration = performance.now() - start;
          if (args[0] && args[0].includes('.js')) {
            console.log(`📦 Chunk loaded in ${duration.toFixed(2)}ms:`, args[0]);
          }
          return response;
        });
      };

      // Monitor bundle sizes
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('🚀 Navigation Performance:', {
              domContentLoaded: `${entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart}ms`,
              loadComplete: `${entry.loadEventEnd - entry.loadEventStart}ms`,
              firstPaint: `${entry.responseEnd - entry.requestStart}ms`,
            });
          }
          
          if (entry.entryType === 'resource' && entry.name.includes('.js')) {
            const sizeKB = (entry.transferSize / 1024).toFixed(1);
            console.log(`📊 JS Resource loaded: ${entry.name.split('/').pop()} (${sizeKB}KB)`);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });

      // Cleanup
      return () => {
        observer.disconnect();
        window.fetch = originalFetch;
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
