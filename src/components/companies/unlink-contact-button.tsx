"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { unlinkContactAction } from "@/lib/actions/companies";

interface UnlinkContactButtonProps {
  companyId: string;
  contactId: string;
  contactName: string;
}

export function UnlinkContactButton({
  companyId,
  contactId,
  contactName,
}: UnlinkContactButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleUnlink() {
    startTransition(async () => {
      await unlinkContactAction(companyId, contactId);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleUnlink}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      aria-label={`Unlink ${contactName}`}
    >
      {isPending ? "Unlinking…" : "Unlink"}
    </Button>
  );
}
