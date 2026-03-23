export const dynamic = "force-dynamic";

import { Building2, Calendar, ChevronLeft, DollarSign, Pencil, User } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DeleteDealDialog } from "@/components/deals/delete-deal-dialog";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STAGE_LABELS: Record<string, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

interface DealDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      company: { select: { id: true, name: true } },
    },
  });

  if (!deal) notFound();

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

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{deal.title}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/deals/${deal.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteDealDialog dealId={deal.id} dealTitle={deal.title} />
        </div>
      </div>

      <div className="mt-2">
        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {STAGE_LABELS[deal.stage] ?? deal.stage}
        </span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Deal Details</h2>
          <dl className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <DollarSign className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <dt className="text-sm text-gray-500">Value</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {deal.value ? `$${Number(deal.value).toLocaleString()}` : "Not set"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <dt className="text-sm text-gray-500">Expected Close Date</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {deal.expectedCloseDate
                    ? new Date(deal.expectedCloseDate).toLocaleDateString()
                    : "Not set"}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Linked Records</h2>
          <dl className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <dt className="text-sm text-gray-500">Contact</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {deal.contact ? (
                    <Link
                      href={`/contacts/${deal.contact.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {deal.contact.firstName} {deal.contact.lastName}
                    </Link>
                  ) : (
                    "None"
                  )}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <dt className="text-sm text-gray-500">Company</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {deal.company ? (
                    <Link
                      href={`/companies/${deal.company.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {deal.company.name}
                    </Link>
                  ) : (
                    "None"
                  )}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {deal.notes && (
        <div className="mt-6 rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{deal.notes}</p>
        </div>
      )}
    </div>
  );
}
