export const dynamic = "force-dynamic";

import { Mail, Phone, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ContactsPagination } from "@/components/contacts/contacts-pagination";
import { ContactsSearch } from "@/components/contacts/contacts-search";
import { ContactsSort } from "@/components/contacts/contacts-sort";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

type SortKey =
  | "name_asc"
  | "name_desc"
  | "email_asc"
  | "email_desc"
  | "created_desc"
  | "created_asc";

function buildOrderBy(sort: string) {
  const map: Record<SortKey, object> = {
    name_asc: [{ firstName: "asc" }, { lastName: "asc" }],
    name_desc: [{ firstName: "desc" }, { lastName: "desc" }],
    email_asc: { email: "asc" },
    email_desc: { email: "desc" },
    created_desc: { createdAt: "desc" },
    created_asc: { createdAt: "asc" },
  };
  return map[sort as SortKey] ?? map.name_asc;
}

interface ContactsPageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page ?? 1));
  const sort = params.sort ?? "name_asc";

  const where = query
    ? {
        OR: [
          { firstName: { contains: query, mode: "insensitive" as const } },
          { lastName: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
          { company: { name: { contains: query, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { company: { select: { id: true, name: true } } },
    }),
    prisma.contact.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} contact{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/contacts/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Suspense>
            <ContactsSearch />
          </Suspense>
        </div>
        <Suspense>
          <ContactsSort />
        </Suspense>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {contacts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {query
              ? `No contacts found matching "${query}".`
              : "No contacts yet. Add your first contact to get started."}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {contact.firstName} {contact.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.email ?? <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.phone ?? <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.company ? (
                          <Link
                            href={`/companies/${contact.company.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.company.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden">
              <ul className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <Link
                      href={`/contacts/${contact.id}`}
                      className={cn("block px-4 py-4 hover:bg-gray-50")}
                    >
                      <p className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </p>
                      {contact.email && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </p>
                      )}
                      {contact.phone && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </p>
                      )}
                      {contact.company && (
                        <p className="mt-1 text-sm text-gray-500">{contact.company.name}</p>
                      )}
                      {contact.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagination */}
            <Suspense>
              <ContactsPagination currentPage={page} totalPages={totalPages} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
