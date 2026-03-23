export const dynamic = "force-dynamic";

import { Calendar, ChevronLeft, Clock, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ActivityTypeBadge } from "@/components/activities/activity-type-badge";
import { DeleteActivityButton } from "@/components/activities/delete-activity-button";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ActivityDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true } },
      deal: { select: { id: true, title: true } },
      createdBy: { select: { name: true } },
    },
  });

  if (!activity) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/activities"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Activities
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{activity.subject}</h1>
          <div className="mt-2">
            <ActivityTypeBadge type={activity.type} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/activities/${activity.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteActivityButton activityId={activity.id} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Details</h2>
          <dl className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <dt className="text-sm text-gray-500">Date</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(activity.date).toLocaleString()}
                </dd>
              </div>
            </div>
            {activity.durationMinutes && (
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <dt className="text-sm text-gray-500">Duration</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {activity.durationMinutes} minutes
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Linked Records</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Contact</dt>
              <dd className="text-sm font-medium text-gray-900">
                {activity.contact ? (
                  <Link
                    href={`/contacts/${activity.contact.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {activity.contact.firstName} {activity.contact.lastName}
                  </Link>
                ) : (
                  "None"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Deal</dt>
              <dd className="text-sm font-medium text-gray-900">
                {activity.deal ? (
                  <Link
                    href={`/deals/${activity.deal.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {activity.deal.title}
                  </Link>
                ) : (
                  "None"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Logged by</dt>
              <dd className="text-sm font-medium text-gray-900">
                {activity.createdBy.name ?? "Unknown"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {activity.description && (
        <div className="mt-6 rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{activity.description}</p>
        </div>
      )}
    </div>
  );
}
