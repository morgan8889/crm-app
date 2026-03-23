"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CompanyFormState } from "@/lib/actions/companies";
import type { Company } from "@/types";

interface CompanyFormProps {
  action: (prevState: CompanyFormState, formData: FormData) => Promise<CompanyFormState>;
  company?: Company | null;
  cancelHref: string;
}

const initialState: CompanyFormState = {};

export function CompanyForm({ action, company, cancelHref }: CompanyFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">
          Company Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={company?.name ?? ""}
          placeholder="Acme Corp"
          required
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          className={state.fieldErrors?.name ? "border-red-500" : ""}
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="text-xs text-red-600">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">Domain</Label>
        <Input
          id="domain"
          name="domain"
          defaultValue={company?.domain ?? ""}
          placeholder="acme.com"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          name="industry"
          defaultValue={company?.industry ?? ""}
          placeholder="Technology, Finance, Healthcare…"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="size">Company Size (employees)</Label>
        <Input
          id="size"
          name="size"
          type="number"
          min="1"
          defaultValue={company?.size ?? ""}
          placeholder="250"
          aria-describedby={state.fieldErrors?.size ? "size-error" : undefined}
          className={state.fieldErrors?.size ? "border-red-500" : ""}
        />
        {state.fieldErrors?.size && (
          <p id="size-error" className="text-xs text-red-600">
            {state.fieldErrors.size}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={company?.address ?? ""}
          placeholder="123 Main St, City, State 12345"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={company?.notes ?? ""}
          placeholder="Any additional notes…"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : company ? "Update Company" : "Create Company"}
        </Button>
        <Button variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
