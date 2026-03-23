export const dynamic = "force-dynamic";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ActivityForm } from "@/components/activities/activity-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface EditActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditActivityPage({ params }: EditActivityPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [activity, contacts, deals] = await Promise.all([
    prisma.activity.findUnique({ where: { id } }),
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    }),
    prisma.deal.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  if (!activity) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/activities/${activity.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Activity
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Activity</h1>
      <div className="mt-6">
        <ActivityForm activity={activity} contacts={contacts} deals={deals} />
      </div>
    </div>
  );
}
