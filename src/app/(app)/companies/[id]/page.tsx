import { ChevronLeft, Mail, Phone, Users } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { DeleteCompanyButton } from "@/components/companies/delete-company-button";
import { LinkContactForm } from "@/components/companies/link-contact-form";
import { UnlinkContactButton } from "@/components/companies/unlink-contact-button";
import { Button } from "@/components/ui/button";
import { getCompany, getUnlinkedContacts } from "@/lib/actions/companies";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [company, unlinkedContacts] = await Promise.all([getCompany(id), getUnlinkedContacts(id)]);

  if (!company) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Companies
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
          {company.domain && (
            <a
              href={`https://${company.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-blue-600 hover:underline"
            >
              {company.domain}
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/companies/${company.id}/edit`}>Edit</Link>
          </Button>
          <DeleteCompanyButton companyId={company.id} companyName={company.name} />
        </div>
      </div>

      {/* Details card */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Company Details</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Industry</dt>
            <dd className="mt-1 text-sm text-gray-700">{company.industry ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Size</dt>
            <dd className="mt-1 text-sm text-gray-700">
              {company.size != null ? `${company.size.toLocaleString()} employees` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Address</dt>
            <dd className="mt-1 text-sm text-gray-700">{company.address ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Deals</dt>
            <dd className="mt-1 text-sm text-gray-700">{company._count.deals}</dd>
          </div>
          {company.notes && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</dt>
              <dd className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{company.notes}</dd>
            </div>
          )}
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Created</dt>
            <dd className="mt-1 text-sm text-gray-700">
              {company.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>

      {/* Linked Contacts */}
      <div className="rounded-lg border bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">
            Contacts ({company.contacts.length})
          </h2>
        </div>

        {/* Link new contact */}
        <div className="rounded-md bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Link a contact</p>
          <LinkContactForm companyId={company.id} unlinkedContacts={unlinkedContacts} />
        </div>

        {/* Contact list */}
        {company.contacts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No contacts linked to this company yet.
          </p>
        ) : (
          <ul className="divide-y">
            {company.contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                  >
                    {contact.firstName} {contact.lastName}
                  </Link>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    {contact.email && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </span>
                    )}
                    {contact.phone && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                </div>
                <UnlinkContactButton
                  companyId={company.id}
                  contactId={contact.id}
                  contactName={`${contact.firstName} ${contact.lastName}`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
