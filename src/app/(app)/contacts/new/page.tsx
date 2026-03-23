export const dynamic = "force-dynamic";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ContactForm } from "@/components/contacts/contact-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewContactPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const companies = await prisma.company.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/contacts"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Contacts
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">New Contact</h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ContactForm companies={companies} />
      </div>
    </div>
  );
}
