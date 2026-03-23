"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface CompanyFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ─── List / Search ────────────────────────────────────────────────────────────

export interface GetCompaniesParams {
  search?: string;
  page?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface GetCompaniesResult {
  companies: {
    id: string;
    name: string;
    domain: string | null;
    industry: string | null;
    size: number | null;
    address: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: { contacts: number; deals: number };
  }[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getCompanies(params: GetCompaniesParams = {}): Promise<GetCompaniesResult> {
  const session = await getSession();
  if (!session) redirect("/login");

  const { search = "", page = 1, sortBy = "name", sortOrder = "asc" } = params;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { domain: { contains: search, mode: "insensitive" as const } },
          { industry: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: pageSize,
      include: {
        _count: { select: { contacts: true, deals: true } },
      },
    }),
    prisma.company.count({ where }),
  ]);

  return {
    companies,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── Get Single ───────────────────────────────────────────────────────────────

export async function getCompany(id: string) {
  const session = await getSession();
  if (!session) redirect("/login");

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: {
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      _count: { select: { deals: true } },
    },
  });

  return company;
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createCompanyAction(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const name = formData.get("name");
  const domain = formData.get("domain");
  const industry = formData.get("industry");
  const sizeRaw = formData.get("size");
  const address = formData.get("address");
  const notes = formData.get("notes");

  if (typeof name !== "string" || !name.trim()) {
    return { fieldErrors: { name: "Company name is required" } };
  }

  const size =
    typeof sizeRaw === "string" && sizeRaw.trim() !== "" ? Number.parseInt(sizeRaw, 10) : null;

  if (size !== null && Number.isNaN(size)) {
    return { fieldErrors: { size: "Size must be a number" } };
  }

  const company = await prisma.company.create({
    data: {
      name: name.trim(),
      domain: typeof domain === "string" && domain.trim() ? domain.trim() : null,
      industry: typeof industry === "string" && industry.trim() ? industry.trim() : null,
      size,
      address: typeof address === "string" && address.trim() ? address.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/companies");
  redirect(`/companies/${company.id}`);
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateCompanyAction(
  id: string,
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const name = formData.get("name");
  const domain = formData.get("domain");
  const industry = formData.get("industry");
  const sizeRaw = formData.get("size");
  const address = formData.get("address");
  const notes = formData.get("notes");

  if (typeof name !== "string" || !name.trim()) {
    return { fieldErrors: { name: "Company name is required" } };
  }

  const size =
    typeof sizeRaw === "string" && sizeRaw.trim() !== "" ? Number.parseInt(sizeRaw, 10) : null;

  if (size !== null && Number.isNaN(size)) {
    return { fieldErrors: { size: "Size must be a number" } };
  }

  await prisma.company.update({
    where: { id },
    data: {
      name: name.trim(),
      domain: typeof domain === "string" && domain.trim() ? domain.trim() : null,
      industry: typeof industry === "string" && industry.trim() ? industry.trim() : null,
      size,
      address: typeof address === "string" && address.trim() ? address.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/companies");
  revalidatePath(`/companies/${id}`);
  redirect(`/companies/${id}`);
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteCompanyAction(id: string): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  // Unlink contacts before deleting
  await prisma.contact.updateMany({
    where: { companyId: id },
    data: { companyId: null },
  });

  await prisma.company.delete({ where: { id } });

  revalidatePath("/companies");
  redirect("/companies");
}

// ─── Link / Unlink Contacts ───────────────────────────────────────────────────

export async function linkContactAction(
  companyId: string,
  contactId: string
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  await prisma.contact.update({
    where: { id: contactId },
    data: { companyId },
  });

  revalidatePath(`/companies/${companyId}`);
  return {};
}

export async function unlinkContactAction(
  companyId: string,
  contactId: string
): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  await prisma.contact.update({
    where: { id: contactId },
    data: { companyId: null },
  });

  revalidatePath(`/companies/${companyId}`);
  return {};
}

// ─── Get unlinked contacts (for linking UI) ───────────────────────────────────

export async function getUnlinkedContacts(_companyId: string) {
  const session = await getSession();
  if (!session) redirect("/login");

  return prisma.contact.findMany({
    where: { companyId: null },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
}
