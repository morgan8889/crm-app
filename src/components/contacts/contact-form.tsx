"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createContactAction, updateContactAction } from "@/lib/actions/contacts";
import type { Contact } from "@/types";

interface ContactCompany {
  id: string;
  name: string;
}

interface ContactFormProps {
  contact?: Contact & { company?: ContactCompany | null };
  companies: ContactCompany[];
}

const initialState = { error: undefined };

export function ContactForm({ contact, companies }: ContactFormProps) {
  const action = contact ? updateContactAction : createContactAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const defaultTags = contact?.tags?.join(", ") ?? "";

  return (
    <form action={formAction} className="space-y-6">
      {contact && <input type="hidden" name="id" value={contact.id} />}

      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            name="firstName"
            required
            defaultValue={contact?.firstName ?? ""}
            placeholder="Jane"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="lastName"
            name="lastName"
            required
            defaultValue={contact?.lastName ?? ""}
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={contact?.email ?? ""}
          placeholder="jane@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={contact?.phone ?? ""}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <Select id="companyId" name="companyId" defaultValue={contact?.companyId ?? ""}>
          <option value="">— None —</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
          <span className="ml-1 text-xs text-gray-400">(comma-separated)</span>
        </label>
        <Input
          id="tags"
          name="tags"
          defaultValue={defaultTags}
          placeholder="customer, vip, prospect"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={contact?.notes ?? ""}
          placeholder="Add any notes about this contact…"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? contact
              ? "Saving…"
              : "Creating…"
            : contact
              ? "Save Changes"
              : "Create Contact"}
        </Button>
        <Link
          href={contact ? `/contacts/${contact.id}` : "/contacts"}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
