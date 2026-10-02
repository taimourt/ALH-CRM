'use client';

export type AnalyticsEventType =
  | 'page_viewed'
  | 'property_viewed'
  | 'society_viewed'
  | 'search_performed'
  | 'filter_used'
  | 'calculator_used'
  | 'video_watched'
  | 'video_completed'
  | 'video_property_clicked'
  | 'video_enquiry_clicked'
  | 'short_hover_preview'
  | 'short_modal_opened'
  | 'short_grid_clicked'
  | 'price_requested'
  | 'whatsapp_clicked'
  | 'phone_clicked'
  | 'lead_form_started'
  | 'lead_created'
  | 'site_visit_requested'
  | 'property_compared'
  | 'society_compared'
  | 'property_finder_started'
  | 'property_finder_completed'
  | 'property_requirement_submitted';


export interface AnalyticsPayload {
  eventName: AnalyticsEventType;
  properties?: Record<string, unknown>;
  timestamp?: string;
  url?: string;
}

export function trackEvent(eventName: AnalyticsEventType, properties?: Record<string, unknown>) {
  const payload: AnalyticsPayload = {
    eventName,
    properties: properties || {},
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  // Log event in browser console for development audit
  if (process.env.NODE_ENV !== 'production') {
    console.log('[ALH Analytics Event]:', payload);
  }

  // Push to window dataLayer if Google Tag Manager is active
  if (typeof window !== 'undefined') {
    (window as unknown as { dataLayer?: unknown[] }).dataLayer =
      (window as unknown as { dataLayer?: unknown[] }).dataLayer || [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push(payload);
  }
}
