export const dynamic = "force-dynamic";

import { Building2, Calendar, ChevronLeft, Mail, Pencil, Phone, Tag } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { DeleteContactDialog } from "@/components/contacts/delete-contact-dialog";
import { NotesEditor } from "@/components/contacts/notes-editor";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ContactDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  if (!contact) notFound();

  const fullName = `${contact.firstName} ${contact.lastName}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/contacts"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Contacts
      </Link>

      {/* Header card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            {contact.company && (
              <Link
                href={`/companies/${contact.company.id}`}
                className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Building2 className="h-4 w-4" />
                {contact.company.name}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button asChild variant="outline" size="sm">
              <Link href={`/contacts/${contact.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteContactDialog contactId={contact.id} contactName={fullName} />
          </div>
        </div>

        {/* Contact details grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {contact.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                {contact.email}
              </a>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <a href={`tel:${contact.phone}`} className="text-gray-700 hover:underline">
                {contact.phone}
              </a>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span>
              Added{" "}
              {contact.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <Suspense fallback={<div className="h-24 animate-pulse rounded bg-gray-100" />}>
          <NotesEditor contactId={contact.id} initialNotes={contact.notes} />
        </Suspense>
      </div>
    </div>
  );
}
