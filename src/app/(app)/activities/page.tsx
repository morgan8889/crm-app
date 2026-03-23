export const dynamic = "force-dynamic";

import type { ActivityType } from "@prisma/client";
import { Clock, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityTypeBadge } from "@/components/activities/activity-type-badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

const VALID_TYPES = ["CALL", "EMAIL", "MEETING", "NOTE"];

interface ActivitiesPageProps {
  searchParams: Promise<{ type?: string; page?: string }>;
}

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const params = await searchParams;
  const filterType = VALID_TYPES.includes(params.type ?? "")
    ? (params.type as ActivityType)
    : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const where = filterType ? { type: filterType } : {};

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.activity.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <Link href="/activities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Log Activity
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href="/activities">
          <Button variant={!filterType ? "default" : "outline"} size="sm">
            All
          </Button>
        </Link>
        {VALID_TYPES.map((t) => (
          <Link key={t} href={`/activities?type=${t}`}>
            <Button variant={filterType === t ? "default" : "outline"} size="sm">
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </Button>
          </Link>
        ))}
      </div>

      {activities.length === 0 ? (
        <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-500">
          <p>No activities yet. Log your first activity to get started.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <ActivityTypeBadge type={activity.type} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/activities/${activity.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {activity.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {activity.contact ? (
                        <Link
                          href={`/contacts/${activity.contact.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {activity.contact.firstName} {activity.contact.lastName}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {activity.deal ? (
                        <Link
                          href={`/deals/${activity.deal.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {activity.deal.title}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {activity.durationMinutes ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {activity.durationMinutes}m
                        </span>
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
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages} ({total} total)
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/activities?${filterType ? `type=${filterType}&` : ""}page=${page - 1}`}
                  >
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/activities?${filterType ? `type=${filterType}&` : ""}page=${page + 1}`}
                  >
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
