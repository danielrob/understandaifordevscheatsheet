/**
 * React hook for Umami analytics integration
 * 
 * Provides easy-to-use React hooks for tracking events and page views
 */

'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  trackEvent, 
  trackPageView, 
  identifyUser, 
  isUmamiLoaded,
  isTrackingEnabled,
  type EventType 
} from '@/lib/analytics';

/**
 * Hook to automatically track page views on route changes
 * @param options - Configuration options for page tracking
 */
export const usePageTracking = (options?: {
  trackOnMount?: boolean;
  includeSearchParams?: boolean;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackOnMount = true, includeSearchParams = false } = options || {};

  useEffect(() => {
    // Skip if tracking is not enabled
    if (!isTrackingEnabled()) return;
    
    if (trackOnMount) {
      const url = includeSearchParams && searchParams.toString() 
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      
      trackPageView(url);
    }
  }, [pathname, searchParams, trackOnMount, includeSearchParams]);
};

/**
 * Hook that provides analytics tracking functions
 * @returns Object with tracking functions
 */
export const useAnalytics = () => {
  const track = useCallback((eventName: EventType | string, eventData?: Record<string, any>) => {
    trackEvent(eventName, eventData);
  }, []);

  const trackPage = useCallback((url?: string, title?: string) => {
    trackPageView(url, title);
  }, []);

  const identify = useCallback((userData: Record<string, any> | string) => {
    identifyUser(userData);
  }, []);

  const isLoaded = useCallback(() => {
    return isUmamiLoaded();
  }, []);

  return {
    track,
    trackPage,
    identify,
    isLoaded,
  };
};

/**
 * Hook to track component mount/unmount events
 * @param componentName - Name of the component to track
 * @param trackUnmount - Whether to track unmount event (default: false)
 */
export const useComponentTracking = (componentName: string, trackUnmount = false) => {
  useEffect(() => {
    // Skip if tracking is not enabled
    if (!isTrackingEnabled()) return;
    
    trackEvent('component-mount', { componentName });

    return () => {
      if (trackUnmount && isTrackingEnabled()) {
        trackEvent('component-unmount', { componentName });
      }
    };
  }, [componentName, trackUnmount]);
};

/**
 * Hook to track user interactions with specific elements
 * @param eventName - Base event name
 * @returns Click handler function
 */
export const useClickTracking = (eventName: string) => {
  return useCallback((additionalData?: Record<string, any>) => {
    trackEvent(eventName, additionalData);
  }, [eventName]);
};

/**
 * Hook to track scroll depth on a page
 * @param thresholds - Array of percentage thresholds to track (default: [25, 50, 75, 100])
 */
export const useScrollTracking = (thresholds: number[] = [25, 50, 75, 100]) => {
  useEffect(() => {
    // Skip if tracking is not enabled
    if (!isTrackingEnabled()) return;
    
    const trackedThresholds = new Set<number>();
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackEvent('scroll-depth', { 
            threshold, 
            page: window.location.pathname 
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [thresholds]);
};

/**
 * Hook to track time spent on page
 * @param intervalSeconds - How often to send time tracking events (default: 30 seconds)
 */
export const useTimeTracking = (intervalSeconds = 30) => {
  useEffect(() => {
    // Skip if tracking is not enabled
    if (!isTrackingEnabled()) return;
    
    const startTime = Date.now();
    let timeSpent = 0;
    
    const trackTime = () => {
      timeSpent += intervalSeconds;
      trackEvent('time-on-page', { 
        timeSpent, 
        page: window.location.pathname 
      });
    };

    const interval = setInterval(trackTime, intervalSeconds * 1000);
    
    // Track total time on page when leaving
    const handleBeforeUnload = () => {
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      trackEvent('page-exit', { 
        totalTimeSpent: totalTime, 
        page: window.location.pathname 
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [intervalSeconds]);
};
