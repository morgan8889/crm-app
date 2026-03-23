export const dynamic = "force-dynamic";

import type { DealStage } from "@prisma/client";
import { Building2, Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityTypeBadge } from "@/components/activities/activity-type-badge";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STAGE_LABELS: Record<DealStage, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

const STAGE_ORDER: DealStage[] = [
  "LEAD",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
];

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [contactCount, companyCount, deals, recentActivities, closingThisMonth] = await Promise.all(
    [
      prisma.contact.count(),
      prisma.company.count(),
      prisma.deal.findMany({ select: { stage: true, value: true } }),
      prisma.activity.findMany({
        include: {
          contact: { select: { id: true, firstName: true, lastName: true } },
          deal: { select: { id: true, title: true } },
        },
        orderBy: { date: "desc" },
        take: 15,
      }),
      prisma.deal.findMany({
        where: {
          expectedCloseDate: { lte: endOfMonth, gte: now },
          stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] },
        },
        include: {
          contact: { select: { firstName: true, lastName: true } },
          company: { select: { name: true } },
        },
        orderBy: { expectedCloseDate: "asc" },
        take: 10,
      }),
    ]
  );

  const openDeals = deals.filter((d) => !["CLOSED_WON", "CLOSED_LOST"].includes(d.stage));
  const totalPipelineValue = openDeals.reduce((sum, d) => sum + (d.value ? Number(d.value) : 0), 0);

  const pipelineByStage = STAGE_ORDER.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    return {
      stage,
      label: STAGE_LABELS[stage],
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + (d.value ? Number(d.value) : 0), 0),
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Key Metrics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total Contacts"
          value={contactCount.toString()}
          href="/contacts"
        />
        <MetricCard
          icon={Building2}
          label="Total Companies"
          value={companyCount.toString()}
          href="/companies"
        />
        <MetricCard
          icon={TrendingUp}
          label="Open Deals"
          value={openDeals.length.toString()}
          href="/deals"
        />
        <MetricCard
          icon={DollarSign}
          label="Pipeline Value"
          value={`$${totalPipelineValue.toLocaleString()}`}
          href="/deals?view=kanban"
        />
      </div>

      {/* Pipeline by Stage */}
      <div className="mt-8 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Pipeline by Stage</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pipelineByStage.map((s) => (
            <div key={s.stage} className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-600">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{s.count}</p>
              <p className="text-sm text-gray-500">${s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Deals Closing This Month */}
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Closing This Month</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          {closingThisMonth.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No deals closing this month.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {closingThisMonth.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="block rounded-lg border p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{deal.title}</p>
                    <p className="text-sm font-medium text-green-600">
                      {deal.value ? `$${Number(deal.value).toLocaleString()}` : "—"}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {deal.contact && `${deal.contact.firstName} ${deal.contact.lastName}`}
                    {deal.contact && deal.company && " · "}
                    {deal.company?.name}
                    {" · "}
                    {deal.expectedCloseDate &&
                      new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/activities" className="text-sm text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          {recentActivities.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No activities yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentActivities.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/activities/${activity.id}`}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-gray-50"
                >
                  <ActivityTypeBadge type={activity.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{activity.subject}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {activity.contact &&
                        `${activity.contact.firstName} ${activity.contact.lastName}`}
                      {activity.contact && activity.deal && " · "}
                      {activity.deal?.title}
                      {" · "}
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-lg border bg-white p-6 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-2">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Link>
  );
}
