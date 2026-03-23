export const dynamic = "force-dynamic";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityForm } from "@/components/activities/activity-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewActivityPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [contacts, deals] = await Promise.all([
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    }),
    prisma.deal.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

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
      <h1 className="text-2xl font-bold text-gray-900">Log Activity</h1>
      <div className="mt-6">
        <ActivityForm contacts={contacts} deals={deals} />
      </div>
    </div>
  );
}
