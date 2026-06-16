export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface NewsletterRequest {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export interface PageViewRequest {
  path: string;
  locale?: string;
  referrer?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
