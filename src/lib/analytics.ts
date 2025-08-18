/**
 * Umami Analytics utility for manual event tracking
 * 
 * This utility provides TypeScript-safe methods for tracking events
 * and page views with Umami analytics.
 */

// Extend the global window object to include umami
declare global {
  interface Window {
    umami?: {
      track: (
        eventNameOrPropsOrFunction: 
          | string 
          | Record<string, any> 
          | ((props: Record<string, any>) => Record<string, any>),
        eventData?: Record<string, any>
      ) => void;
      identify: (data: Record<string, any> | string) => void;
    };
  }
}

/**
 * Check if tracking is enabled (environment variables are configured)
 * @returns boolean indicating if tracking should be active
 */
export const isTrackingEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if we're in production and have required env vars
  const isProduction = process.env.NODE_ENV === 'production';
  const hasWebsiteId = !!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const hasScriptUrl = !!process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  
  return isProduction && hasWebsiteId && hasScriptUrl;
};

/**
 * Track a custom event with Umami
 * @param eventName - Name of the event to track
 * @param eventData - Optional additional data to send with the event
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  // Skip tracking if environment variables are not configured
  if (!isTrackingEnabled()) return;
  
  if (typeof window !== 'undefined' && window.umami?.track) {
    if (eventData) {
      window.umami.track(eventName, eventData);
    } else {
      window.umami.track(eventName);
    }
  }
};

/**
 * Track a page view manually (useful for SPA navigation)
 * @param url - The URL to track (defaults to current page)
 * @param title - The page title (defaults to document.title)
 */
export const trackPageView = (url?: string, title?: string) => {
  // Skip tracking if environment variables are not configured
  if (!isTrackingEnabled()) return;
  
  if (typeof window !== 'undefined' && window.umami?.track) {
    const pageData: Record<string, any> = {};
    
    if (url) pageData.url = url;
    if (title) pageData.title = title;
    
    if (Object.keys(pageData).length > 0) {
      window.umami.track((props) => ({ ...props, ...pageData }));
    } else {
      // Track default page view
      window.umami.track((props) => props);
    }
  }
};

/**
 * Identify a user session with custom data
 * @param userData - User data to associate with the session
 */
export const identifyUser = (userData: Record<string, any> | string) => {
  // Skip tracking if environment variables are not configured
  if (!isTrackingEnabled()) return;
  
  if (typeof window !== 'undefined' && window.umami?.identify) {
    window.umami.identify(userData);
  }
};

/**
 * Track outbound link clicks
 * @param url - The external URL being clicked
 * @param linkText - Optional text of the link
 */
export const trackOutboundLink = (url: string, linkText?: string) => {
  if (!isTrackingEnabled()) return;
  
  trackEvent('outbound-link-click', {
    url,
    linkText,
  });
};

/**
 * Track file downloads
 * @param fileName - Name of the file being downloaded
 * @param fileType - Type/extension of the file
 * @param fileSize - Optional size of the file
 */
export const trackDownload = (fileName: string, fileType: string, fileSize?: number) => {
  if (!isTrackingEnabled()) return;
  
  trackEvent('file-download', {
    fileName,
    fileType,
    fileSize,
  });
};

/**
 * Track form submissions
 * @param formName - Name or identifier of the form
 * @param formData - Optional form data to track
 */
export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  if (!isTrackingEnabled()) return;
  
  trackEvent('form-submission', {
    formName,
    ...formData,
  });
};

/**
 * Track search queries
 * @param query - The search query
 * @param resultsCount - Optional number of results returned
 */
export const trackSearch = (query: string, resultsCount?: number) => {
  if (!isTrackingEnabled()) return;
  
  trackEvent('search', {
    query,
    resultsCount,
  });
};

/**
 * Check if Umami is available and loaded
 * @returns boolean indicating if Umami is ready to use
 */
export const isUmamiLoaded = (): boolean => {
  return isTrackingEnabled() && typeof window !== 'undefined' && !!window.umami;
};

// Event tracking constants for consistent naming
export const EVENTS = {
  // Navigation
  PAGE_VIEW: 'page-view',
  OUTBOUND_LINK: 'outbound-link-click',
  
  // User Actions
  BUTTON_CLICK: 'button-click',
  FORM_SUBMIT: 'form-submission',
  SEARCH: 'search',
  DOWNLOAD: 'file-download',
  
  // Content Interaction
  CARD_CLICK: 'card-click',
  MODAL_OPEN: 'modal-open',
  MODAL_CLOSE: 'modal-close',
  THEME_TOGGLE: 'theme-toggle',
  
  // Cheat Sheet Specific
  CHEAT_SHEET_VIEW: 'cheat-sheet-view',
  CHEAT_SHEET_EXPAND: 'cheat-sheet-expand',
  CHEAT_SHEET_COPY: 'cheat-sheet-copy',
  IMAGE_VIEW: 'image-view',
} as const;

export type EventType = typeof EVENTS[keyof typeof EVENTS];
