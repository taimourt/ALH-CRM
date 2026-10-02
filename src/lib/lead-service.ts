export interface LeadSubmissionPayload {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  requirement?: string;
  propertyId?: string;
  societyId?: string;
  propertyType?: string;
  size?: string;
  budget?: number | string;
  purpose?: string;
  timeline?: string;
  leadSource?: string;
  leadMedium?: string;
  campaign?: string;
  landingPage?: string;
  notes?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export async function submitWebsiteLead(payload: LeadSubmissionPayload) {
  try {
    const response = await fetch('/api/website/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to process lead submission');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
}

export function extractUTMParameters(searchParams?: URLSearchParams): Record<string, string> {
  if (!searchParams && typeof window !== 'undefined') {
    searchParams = new URLSearchParams(window.location.search);
  }

  if (!searchParams) return {};

  return {
    utmSource: searchParams.get('utm_source') || '',
    utmMedium: searchParams.get('utm_medium') || '',
    utmCampaign: searchParams.get('utm_campaign') || '',
    utmContent: searchParams.get('utm_content') || '',
    utmTerm: searchParams.get('utm_term') || '',
  };
}
