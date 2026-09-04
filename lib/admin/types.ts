export type EnquiryStatus = "New" | "Contacted" | "Qualified" | "Closed";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  projectSize: string;
  budgetRange: string;
  timeline: string;
  message: string;
  status: EnquiryStatus;
  submittedAt: string;
}

export type AdminProjectCategory =
  | "Residential Interiors"
  | "Modular Kitchen"
  | "Bedroom & Wardrobe"
  | "TV Units & Feature Walls"
  | "Commercial Interiors";

export interface AdminProjectImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: AdminProjectCategory;
  year: number;
  featured: boolean;
  order: number;
  shortDescription: string;
  overview: string;
  designApproach: string;
  servicesInvolved: string[];
  materialHighlights: string[];
  coverImage: AdminProjectImage;
  gallery: AdminProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export type QuotationProjectType =
  | "Residential"
  | "Commercial"
  | "Modular Kitchen"
  | "Bedroom & Wardrobe"
  | "TV Unit & Feature Wall"
  | "Hospitality & Specialty"
  | "Other";

export type QuotationStatus = "draft" | "finalized";

export interface QuotationLineItem {
  id: string;
  description: string;
  brand: string;
  quality: string;
  quantity: string;
  price: number;
}

export interface QuotationSection {
  id: string;
  roomType: string;
  items: QuotationLineItem[];
}

export interface Quotation {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  projectType: QuotationProjectType;
  projectTitle: string;
  sections: QuotationSection[];
  status: QuotationStatus;
  totalAmount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
}

export type PaymentMethod = "UPI" | "Bank Transfer" | "Cash" | "Cheque" | "Card" | "Other";

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  notes: string;
}

export interface Invoice {
  id: string;
  quotationId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectTitle: string;
  totalAmount: number;
  payments: PaymentRecord[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
