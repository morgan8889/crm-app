import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

import { CompanyForm } from "@/components/companies/company-form";
import { createCompanyAction } from "@/lib/actions/companies";

export default function NewCompanyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Companies
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">New Company</h1>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <CompanyForm action={createCompanyAction} cancelHref="/companies" />
      </div>
    </div>
  );
}
