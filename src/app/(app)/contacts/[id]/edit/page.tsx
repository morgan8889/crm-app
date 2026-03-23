export const dynamic = "force-dynamic";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ContactForm } from "@/components/contacts/contact-form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface EditContactPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const [contact, companies] = await Promise.all([
    prisma.contact.findUnique({
      where: { id },
      include: { company: { select: { id: true, name: true } } },
    }),
    prisma.company.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!contact) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/contacts/${id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Contact
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Edit {contact.firstName} {contact.lastName}
        </h1>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ContactForm contact={contact} companies={companies} />
      </div>
    </div>
  );
}
