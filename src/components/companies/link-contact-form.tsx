"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { linkContactAction } from "@/lib/actions/companies";

interface UnlinkedContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
}

interface LinkContactFormProps {
  companyId: string;
  unlinkedContacts: UnlinkedContact[];
}

export function LinkContactForm({ companyId, unlinkedContacts }: LinkContactFormProps) {
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleLink() {
    if (!selectedId) return;
    setError(null);

    startTransition(async () => {
      const result = await linkContactAction(companyId, selectedId);
      if (result.error) {
        setError(result.error);
      } else {
        setSelectedId("");
      }
    });
  }

  if (unlinkedContacts.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No unlinked contacts available. All contacts are already linked to a company.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="flex-1"
        aria-label="Select a contact to link"
      >
        <option value="">Select a contact…</option>
        {unlinkedContacts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.firstName} {c.lastName}
            {c.email ? ` (${c.email})` : ""}
          </option>
        ))}
      </Select>
      <Button type="button" onClick={handleLink} disabled={!selectedId || isPending} size="sm">
        {isPending ? "Linking…" : "Link Contact"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
