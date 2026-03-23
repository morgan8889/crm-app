"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteActivityAction } from "@/lib/actions/activities";

interface DeleteActivityButtonProps {
  activityId: string;
}

export function DeleteActivityButton({ activityId }: DeleteActivityButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    startTransition(() => {
      deleteActivityAction(activityId);
    });
  }

  return (
    <Button variant="outline" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="mr-2 h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
