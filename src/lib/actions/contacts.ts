"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface ContactResult {
  error?: string;
  id?: string;
}

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

function parseTagsFromString(tagsStr: string): string[] {
  if (!tagsStr.trim()) return [];
  return tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export async function createContactAction(
  _prevState: ContactResult,
  formData: FormData
): Promise<ContactResult> {
  await requireAuth();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const companyId = formData.get("companyId");
  const notes = formData.get("notes");
  const tagsStr = formData.get("tags");

  if (typeof firstName !== "string" || !firstName.trim()) {
    return { error: "First name is required" };
  }
  if (typeof lastName !== "string" || !lastName.trim()) {
    return { error: "Last name is required" };
  }
  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { error: "Invalid email address" };
  }

  const tags = typeof tagsStr === "string" ? parseTagsFromString(tagsStr) : [];

  const contact = await prisma.contact.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      companyId: typeof companyId === "string" && companyId.trim() ? companyId.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      tags,
    },
  });

  revalidatePath("/contacts");
  redirect(`/contacts/${contact.id}`);
}

export async function updateContactAction(
  _prevState: ContactResult,
  formData: FormData
): Promise<ContactResult> {
  await requireAuth();

  const id = formData.get("id");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const companyId = formData.get("companyId");
  const notes = formData.get("notes");
  const tagsStr = formData.get("tags");

  if (typeof id !== "string" || !id.trim()) {
    return { error: "Invalid contact ID" };
  }
  if (typeof firstName !== "string" || !firstName.trim()) {
    return { error: "First name is required" };
  }
  if (typeof lastName !== "string" || !lastName.trim()) {
    return { error: "Last name is required" };
  }
  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { error: "Invalid email address" };
  }

  const tags = typeof tagsStr === "string" ? parseTagsFromString(tagsStr) : [];

  const existing = await prisma.contact.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Contact not found" };
  }

  await prisma.contact.update({
    where: { id },
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: typeof phone === "string" && phone.trim() ? phone.trim() : null,
      companyId: typeof companyId === "string" && companyId.trim() ? companyId.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      tags,
    },
  });

  revalidatePath("/contacts");
  revalidatePath(`/contacts/${id}`);
  redirect(`/contacts/${id}`);
}

export async function updateContactNotesAction(
  contactId: string,
  notes: string
): Promise<ContactResult> {
  await requireAuth();

  const existing = await prisma.contact.findUnique({ where: { id: contactId } });
  if (!existing) {
    return { error: "Contact not found" };
  }

  await prisma.contact.update({
    where: { id: contactId },
    data: { notes: notes.trim() || null },
  });

  revalidatePath(`/contacts/${contactId}`);
  return {};
}

export async function deleteContactAction(contactId: string): Promise<ContactResult> {
  await requireAuth();

  const existing = await prisma.contact.findUnique({ where: { id: contactId } });
  if (!existing) {
    return { error: "Contact not found" };
  }

  await prisma.contact.delete({ where: { id: contactId } });

  revalidatePath("/contacts");
  redirect("/contacts");
}
