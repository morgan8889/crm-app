export const dynamic = "force-dynamic";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DealForm } from "@/components/deals/deal-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewDealPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [contacts, companies] = await Promise.all([
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    }),
    prisma.company.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/deals"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Deals
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">New Deal</h1>
      <div className="mt-6">
        <DealForm contacts={contacts} companies={companies} />
      </div>
    </div>
  );
}
