import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { CompanyForm } from "@/components/companies/company-form";
import type { CompanyFormState } from "@/lib/actions/companies";
import { getCompany, updateCompanyAction } from "@/lib/actions/companies";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCompanyPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCompany(id);

  if (!company) notFound();

  async function boundUpdateAction(
    prevState: CompanyFormState,
    formData: FormData
  ): Promise<CompanyFormState> {
    "use server";
    return updateCompanyAction(id, prevState, formData);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/companies/${id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to {company.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Edit Company</h1>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <CompanyForm action={boundUpdateAction} company={company} cancelHref={`/companies/${id}`} />
      </div>
    </div>
  );
}
