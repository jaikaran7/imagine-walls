import { prisma } from "@/lib/db";
import { Prisma } from "@/src/generated/prisma/client";
import { normalizeQuotationSections } from "./format";
import { generateId } from "./id";
import type {
  AdminProject,
  AdminProjectImage,
  AdminReview,
  AdminReviewKind,
  Enquiry,
  EnquiryStatus,
  Invoice,
  PaymentRecord,
  Quotation,
  QuotationSection,
} from "./types";

function toIso(value: Date): string {
  return value.toISOString();
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function asProjectImage(value: unknown): AdminProjectImage {
  if (value && typeof value === "object") {
    return value as AdminProjectImage;
  }
  return { id: "cover", src: "", alt: "" };
}

function asProjectImages(value: unknown): AdminProjectImage[] {
  return Array.isArray(value) ? (value as AdminProjectImage[]) : [];
}

function asQuotationSections(value: unknown): QuotationSection[] {
  return normalizeQuotationSections(value);
}

function asPayments(value: unknown): PaymentRecord[] {
  return Array.isArray(value) ? (value as PaymentRecord[]) : [];
}

function mapEnquiry(record: {
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
  status: string;
  submittedAt: Date;
}): Enquiry {
  return {
    id: record.id,
    name: record.name,
    phone: record.phone,
    email: record.email,
    projectType: record.projectType,
    location: record.location,
    projectSize: record.projectSize,
    budgetRange: record.budgetRange,
    timeline: record.timeline,
    message: record.message,
    status: record.status as EnquiryStatus,
    submittedAt: toIso(record.submittedAt),
  };
}

function mapProject(record: {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  year: number;
  featured: boolean;
  sortOrder: number;
  shortDescription: string;
  overview: string;
  designApproach: string;
  servicesInvolved: unknown;
  materialHighlights: unknown;
  coverImage: unknown;
  gallery: unknown;
  createdAt: Date;
  updatedAt: Date;
}): AdminProject {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    location: record.location,
    category: record.category as AdminProject["category"],
    year: record.year,
    featured: record.featured,
    order: record.sortOrder,
    shortDescription: record.shortDescription,
    overview: record.overview,
    designApproach: record.designApproach,
    servicesInvolved: asStringArray(record.servicesInvolved),
    materialHighlights: asStringArray(record.materialHighlights),
    coverImage: asProjectImage(record.coverImage),
    gallery: asProjectImages(record.gallery),
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
  };
}

function mapQuotation(record: {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  projectType: string;
  projectTitle: string;
  sections: unknown;
  status: string;
  totalAmount: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  finalizedAt: Date | null;
}): Quotation {
  return {
    id: record.id,
    clientName: record.clientName,
    clientPhone: record.clientPhone,
    clientEmail: record.clientEmail,
    clientAddress: record.clientAddress,
    projectType: record.projectType as Quotation["projectType"],
    projectTitle: record.projectTitle,
    sections: asQuotationSections(record.sections),
    status: record.status as Quotation["status"],
    totalAmount: record.totalAmount,
    notes: record.notes,
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
    finalizedAt: record.finalizedAt ? toIso(record.finalizedAt) : undefined,
  };
}

function mapInvoice(record: {
  id: string;
  quotationId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectTitle: string;
  totalAmount: number;
  payments: unknown;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}): Invoice {
  return {
    id: record.id,
    quotationId: record.quotationId,
    clientName: record.clientName,
    clientPhone: record.clientPhone,
    clientEmail: record.clientEmail,
    projectTitle: record.projectTitle,
    totalAmount: record.totalAmount,
    payments: asPayments(record.payments),
    notes: record.notes,
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
  };
}

// Enquiries
export async function getEnquiries(): Promise<Enquiry[]> {
  const items = await prisma.enquiry.findMany({
    orderBy: { submittedAt: "desc" },
  });
  return items.map(mapEnquiry);
}

export async function addEnquiry(enquiry: Omit<Enquiry, "id">): Promise<Enquiry> {
  const record = await prisma.enquiry.create({
    data: {
      id: generateId("enq"),
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      projectType: enquiry.projectType,
      location: enquiry.location,
      projectSize: enquiry.projectSize,
      budgetRange: enquiry.budgetRange,
      timeline: enquiry.timeline,
      message: enquiry.message,
      status: enquiry.status,
      submittedAt: new Date(enquiry.submittedAt),
    },
  });
  return mapEnquiry(record);
}

export async function updateEnquiry(id: string, patch: Partial<Enquiry>): Promise<Enquiry | null> {
  try {
    const record = await prisma.enquiry.update({
      where: { id },
      data: {
        name: patch.name,
        phone: patch.phone,
        email: patch.email,
        projectType: patch.projectType,
        location: patch.location,
        projectSize: patch.projectSize,
        budgetRange: patch.budgetRange,
        timeline: patch.timeline,
        message: patch.message,
        status: patch.status,
        submittedAt: patch.submittedAt ? new Date(patch.submittedAt) : undefined,
      },
    });
    return mapEnquiry(record);
  } catch {
    return null;
  }
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  try {
    await prisma.enquiry.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Projects
export async function getAdminProjects(): Promise<AdminProject[]> {
  const items = await prisma.adminProject.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return items.map(mapProject);
}

export async function getAdminProject(id: string): Promise<AdminProject | null> {
  const record = await prisma.adminProject.findUnique({ where: { id } });
  return record ? mapProject(record) : null;
}

export async function addAdminProject(
  project: Omit<AdminProject, "id" | "createdAt" | "updatedAt">,
): Promise<AdminProject> {
  const record = await prisma.adminProject.create({
    data: {
      id: generateId("proj"),
      slug: project.slug,
      title: project.title,
      location: project.location,
      category: project.category,
      year: project.year,
      featured: project.featured,
      sortOrder: project.order,
      shortDescription: project.shortDescription,
      overview: project.overview,
      designApproach: project.designApproach,
      servicesInvolved: project.servicesInvolved as unknown as Prisma.InputJsonValue,
      materialHighlights: project.materialHighlights as unknown as Prisma.InputJsonValue,
      coverImage: project.coverImage as unknown as Prisma.InputJsonValue,
      gallery: project.gallery as unknown as Prisma.InputJsonValue,
    },
  });
  return mapProject(record);
}

export async function updateAdminProject(id: string, patch: Partial<AdminProject>): Promise<AdminProject | null> {
  try {
    const record = await prisma.adminProject.update({
      where: { id },
      data: {
        slug: patch.slug,
        title: patch.title,
        location: patch.location,
        category: patch.category,
        year: patch.year,
        featured: patch.featured,
        sortOrder: patch.order,
        shortDescription: patch.shortDescription,
        overview: patch.overview,
        designApproach: patch.designApproach,
        servicesInvolved: patch.servicesInvolved as unknown as Prisma.InputJsonValue | undefined,
        materialHighlights: patch.materialHighlights as unknown as Prisma.InputJsonValue | undefined,
        coverImage: patch.coverImage as unknown as Prisma.InputJsonValue | undefined,
        gallery: patch.gallery as unknown as Prisma.InputJsonValue | undefined,
      },
    });
    return mapProject(record);
  } catch {
    return null;
  }
}

export async function deleteAdminProject(id: string): Promise<boolean> {
  try {
    await prisma.adminProject.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Quotations
export async function getQuotations(): Promise<Quotation[]> {
  const items = await prisma.quotation.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return items.map(mapQuotation);
}

export async function getQuotation(id: string): Promise<Quotation | null> {
  const record = await prisma.quotation.findUnique({ where: { id } });
  return record ? mapQuotation(record) : null;
}

export async function addQuotation(
  quotation: Omit<Quotation, "id" | "createdAt" | "updatedAt">,
): Promise<Quotation> {
  const record = await prisma.quotation.create({
    data: {
      id: generateId("quo"),
      clientName: quotation.clientName,
      clientPhone: quotation.clientPhone,
      clientEmail: quotation.clientEmail,
      clientAddress: quotation.clientAddress,
      projectType: quotation.projectType,
      projectTitle: quotation.projectTitle,
      sections: quotation.sections as unknown as Prisma.InputJsonValue,
      status: quotation.status,
      totalAmount: quotation.totalAmount,
      notes: quotation.notes,
      finalizedAt: quotation.finalizedAt ? new Date(quotation.finalizedAt) : null,
    },
  });
  return mapQuotation(record);
}

export async function updateQuotation(id: string, patch: Partial<Quotation>): Promise<Quotation | null> {
  try {
    const record = await prisma.quotation.update({
      where: { id },
      data: {
        clientName: patch.clientName,
        clientPhone: patch.clientPhone,
        clientEmail: patch.clientEmail,
        clientAddress: patch.clientAddress,
        projectType: patch.projectType,
        projectTitle: patch.projectTitle,
        sections: patch.sections as unknown as Prisma.InputJsonValue | undefined,
        status: patch.status,
        totalAmount: patch.totalAmount,
        notes: patch.notes,
        finalizedAt:
          patch.finalizedAt === undefined
            ? undefined
            : patch.finalizedAt
              ? new Date(patch.finalizedAt)
              : null,
      },
    });
    return mapQuotation(record);
  } catch {
    return null;
  }
}

export async function deleteQuotation(id: string): Promise<boolean> {
  try {
    await prisma.quotation.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Invoices
export async function getInvoices(): Promise<Invoice[]> {
  const items = await prisma.invoice.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return items.map(mapInvoice);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const record = await prisma.invoice.findUnique({ where: { id } });
  return record ? mapInvoice(record) : null;
}

export async function addInvoice(invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Promise<Invoice> {
  const record = await prisma.invoice.create({
    data: {
      id: generateId("inv"),
      quotationId: invoice.quotationId,
      clientName: invoice.clientName,
      clientPhone: invoice.clientPhone,
      clientEmail: invoice.clientEmail,
      projectTitle: invoice.projectTitle,
      totalAmount: invoice.totalAmount,
      payments: invoice.payments as unknown as Prisma.InputJsonValue,
      notes: invoice.notes,
    },
  });
  return mapInvoice(record);
}

export async function updateInvoice(id: string, patch: Partial<Invoice>): Promise<Invoice | null> {
  try {
    const record = await prisma.invoice.update({
      where: { id },
      data: {
        quotationId: patch.quotationId,
        clientName: patch.clientName,
        clientPhone: patch.clientPhone,
        clientEmail: patch.clientEmail,
        projectTitle: patch.projectTitle,
        totalAmount: patch.totalAmount,
        payments: patch.payments as unknown as Prisma.InputJsonValue | undefined,
        notes: patch.notes,
      },
    });
    return mapInvoice(record);
  } catch {
    return null;
  }
}

export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    await prisma.invoice.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// Reviews
function mapReview(record: {
  id: string;
  kind: string;
  title: string;
  quote: string;
  name: string;
  detail: string;
  headline: string;
  color: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminReview {
  return {
    id: record.id,
    kind: (record.kind === "highlight" ? "highlight" : "quote") as AdminReviewKind,
    title: record.title,
    quote: record.quote,
    name: record.name,
    detail: record.detail,
    headline: record.headline,
    color: record.color,
    order: record.sortOrder,
    published: record.published,
    createdAt: toIso(record.createdAt),
    updatedAt: toIso(record.updatedAt),
  };
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  const items = await prisma.adminReview.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return items.map(mapReview);
}

export async function getAdminReview(id: string): Promise<AdminReview | null> {
  const record = await prisma.adminReview.findUnique({ where: { id } });
  return record ? mapReview(record) : null;
}

export async function addAdminReview(
  review: Omit<AdminReview, "id" | "createdAt" | "updatedAt">,
): Promise<AdminReview> {
  const record = await prisma.adminReview.create({
    data: {
      id: generateId("rev"),
      kind: review.kind,
      title: review.title,
      quote: review.quote,
      name: review.name,
      detail: review.detail,
      headline: review.headline,
      color: review.color,
      sortOrder: review.order,
      published: review.published,
    },
  });
  return mapReview(record);
}

export async function updateAdminReview(id: string, patch: Partial<AdminReview>): Promise<AdminReview | null> {
  try {
    const record = await prisma.adminReview.update({
      where: { id },
      data: {
        kind: patch.kind,
        title: patch.title,
        quote: patch.quote,
        name: patch.name,
        detail: patch.detail,
        headline: patch.headline,
        color: patch.color,
        sortOrder: patch.order,
        published: patch.published,
      },
    });
    return mapReview(record);
  } catch {
    return null;
  }
}

export async function deleteAdminReview(id: string): Promise<boolean> {
  try {
    await prisma.adminReview.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
