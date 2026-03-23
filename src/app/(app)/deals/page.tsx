export const dynamic = "force-dynamic";

import type { DealStage } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DealsKanban } from "@/components/deals/deals-kanban";
import { DealsPagination } from "@/components/deals/deals-pagination";
import { DealsSearch } from "@/components/deals/deals-search";
import { DealsSort } from "@/components/deals/deals-sort";
import { PipelineSummary } from "@/components/deals/pipeline-summary";
import { ViewToggle } from "@/components/deals/view-toggle";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

const STAGE_ORDER: DealStage[] = [
  "LEAD",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];

interface DealsPageProps {
  searchParams: Promise<{ q?: string; page?: string; view?: string; sort?: string }>;
}

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const view = params.view === "kanban" ? "kanban" : "list";
  const sort = params.sort ?? "created_desc";

  const where = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { contact: { firstName: { contains: query, mode: "insensitive" as const } } },
          { contact: { lastName: { contains: query, mode: "insensitive" as const } } },
          { company: { name: { contains: query, mode: "insensitive" as const } } },
        ],
      }
    : {};

  // Pipeline summary
  const allDeals = await prisma.deal.findMany({
    select: { stage: true, value: true },
  });

  const summaries = STAGE_ORDER.map((stage) => {
    const stageDeals = allDeals.filter((d) => d.stage === stage);
    return {
      stage,
      count: stageDeals.length,
      total: stageDeals.reduce((sum, d) => sum + (d.value ? Number(d.value) : 0), 0),
    };
  });

  if (view === "kanban") {
    const deals = await prisma.deal.findMany({
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const kanbanDeals = deals.map((d) => ({
      ...d,
      value: d.value ? String(d.value) : null,
    }));

    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <div className="flex items-center gap-2">
            <ViewToggle currentView="kanban" />
            <Link href="/deals/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Deal
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <PipelineSummary summaries={summaries} />
        </div>

        <div className="mt-4">
          <DealsKanban deals={kanbanDeals} />
        </div>
      </div>
    );
  }

  // List view
  const orderByMap: Record<string, object> = {
    created_desc: { createdAt: "desc" },
    created_asc: { createdAt: "asc" },
    value_desc: { value: "desc" },
    value_asc: { value: "asc" },
    title_asc: { title: "asc" },
    title_desc: { title: "desc" },
  };

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: orderByMap[sort] ?? { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.deal.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <div className="flex items-center gap-2">
          <ViewToggle currentView="list" />
          <Link href="/deals/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Deal
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <PipelineSummary summaries={summaries} />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <DealsSearch />
        <DealsSort />
      </div>

      {deals.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-500">
          {query ? (
            <p>No deals found matching &ldquo;{query}&rdquo;.</p>
          ) : (
            <p>No deals yet. Add your first deal to get started.</p>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Close Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {deal.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {deal.value ? `$${Number(deal.value).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {deal.stage.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {deal.contact ? (
                        <Link
                          href={`/contacts/${deal.contact.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {deal.contact.firstName} {deal.contact.lastName}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {deal.company ? (
                        <Link
                          href={`/companies/${deal.company.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {deal.company.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {deal.expectedCloseDate
                        ? new Date(deal.expectedCloseDate).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <DealsPagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
