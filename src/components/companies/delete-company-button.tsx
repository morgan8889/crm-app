"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteCompanyAction } from "@/lib/actions/companies";

interface DeleteCompanyButtonProps {
  companyId: string;
  companyName: string;
}

export function DeleteCompanyButton({ companyId, companyName }: DeleteCompanyButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${companyName}"?\n\nThis will unlink all associated contacts. This action cannot be undone.`
    );
    if (!confirmed) return;

    startTransition(async () => {
      await deleteCompanyAction(companyId);
    });
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      {isPending ? "Deleting…" : "Delete Company"}
    </Button>
  );
}
