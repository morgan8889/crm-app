export const dynamic = "force-dynamic";

import { Building2, Globe, Plus, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CompaniesSearch } from "@/components/companies/companies-search";
import { Pagination } from "@/components/companies/pagination";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

interface CompaniesPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { domain: { contains: query, mode: "insensitive" as const } },
          { industry: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      include: { _count: { select: { contacts: true } } },
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.company.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <Link href="/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        <Suspense fallback={<div className="h-10" />}>
          <CompaniesSearch />
        </Suspense>
      </div>

      {companies.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-500">
          {query ? (
            <p>No companies found matching &ldquo;{query}&rdquo;.</p>
          ) : (
            <p>No companies yet. Add your first company to get started.</p>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contacts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Domain
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/companies/${company.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {company.name}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{company.industry ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {company._count.contacts}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {company.domain ? (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5" />
                          {company.domain}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
