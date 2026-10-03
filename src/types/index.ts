export type PageRoute =
  | '/'
  | '/septic-tank-pumping-houston-tx/'
  | '/septic-tank-cleaning-houston/'
  | '/septic-tank-inspection-houston/'
  | '/septic-tank-maintenance-houston/'
  | '/emergency-septic-service-houston/'
  | '/service-areas/'
  | '/about-us/'
  | '/contact/'
  | '/request-a-quote/'
  | '/privacy-policy/'
  | '/terms-of-service/'
  | string;

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  headline: string;
  pricingEstimate: string;
  frequency: string;
  commonSigns: string[];
  processSteps: { title: string; desc: string }[];
  seoTitle: string;
  metaDesc: string;
  canonicalUrl: string;
}

export interface CityArea {
  id: string;
  slug: string;
  name: string;
  state: string;
  county: string;
  zipCodes: string[];
  systemTypes: string;
  soilNotes: string;
  dispatchNote: string;
  metaDesc: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: 'general' | 'pricing' | 'maintenance' | 'emergency';
}

export interface LeadFormData {
  fullName: string;
  phone: string;
  email?: string;
  zipCode: string;
  serviceNeeded: string;
  propertyType: string;
  preferredDate: string;
  tankSizeEstimated?: string;
  description: string;
  consent: boolean;
  website_honeypot?: string; // Spam protection
  formRenderTime?: number;    // Spam protection
}

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
  leadId?: string;
  dispatchStatus?: string;
  errors?: Record<string, string>;
}
