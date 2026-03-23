"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createDealAction, updateDealAction } from "@/lib/actions/deals";
import type { Deal } from "@/types";
import { DealStage } from "@/types";

interface DealFormContact {
  id: string;
  firstName: string;
  lastName: string;
}

interface DealFormCompany {
  id: string;
  name: string;
}

interface DealFormProps {
  deal?: Deal;
  contacts: DealFormContact[];
  companies: DealFormCompany[];
}

const STAGE_LABELS: Record<DealStage, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

const initialState = { error: undefined };

function formatDateForInput(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DealForm({ deal, contacts, companies }: DealFormProps) {
  const action = deal ? updateDealAction : createDealAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {deal && <input type="hidden" name="id" value={deal.id} />}

      {state.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={deal?.title ?? ""}
          placeholder="Enterprise Software License"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="value" className="block text-sm font-medium text-gray-700">
            Value ($)
          </label>
          <Input
            id="value"
            name="value"
            type="number"
            min="0"
            step="0.01"
            defaultValue={deal?.value != null ? String(deal.value) : ""}
            placeholder="50000.00"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
            Stage
          </label>
          <Select id="stage" name="stage" defaultValue={deal?.stage ?? DealStage.LEAD}>
            {Object.entries(STAGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contactId" className="block text-sm font-medium text-gray-700">
            Contact
          </label>
          <Select id="contactId" name="contactId" defaultValue={deal?.contactId ?? ""}>
            <option value="">— None —</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <Select id="companyId" name="companyId" defaultValue={deal?.companyId ?? ""}>
            <option value="">— None —</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700">
          Expected Close Date
        </label>
        <Input
          id="expectedCloseDate"
          name="expectedCloseDate"
          type="date"
          defaultValue={formatDateForInput(deal?.expectedCloseDate)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={deal?.notes ?? ""}
          placeholder="Add any notes about this deal…"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (deal ? "Saving…" : "Creating…") : deal ? "Save Changes" : "Create Deal"}
        </Button>
        <Link
          href={deal ? `/deals/${deal.id}` : "/deals"}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
