export const dynamic = "force-dynamic";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DealForm } from "@/components/deals/deal-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface EditDealPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDealPage({ params }: EditDealPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [deal, contacts, companies] = await Promise.all([
    prisma.deal.findUnique({ where: { id } }),
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    }),
    prisma.company.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!deal) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/deals/${deal.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Deal
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Deal</h1>
      <div className="mt-6">
        <DealForm deal={deal} contacts={contacts} companies={companies} />
      </div>
    </div>
  );
}
