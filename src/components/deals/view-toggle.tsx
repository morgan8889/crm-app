"use client";

import { Kanban, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  currentView: "kanban" | "list";
}

export function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setView(view: "kanban" | "list") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    params.delete("page");
    router.push(`/deals?${params.toString()}`);
  }

  return (
    <div className="flex rounded-md border border-gray-200 p-0.5">
      <button
        type="button"
        onClick={() => setView("kanban")}
        className={cn(
          "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
          currentView === "kanban" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Kanban className="h-4 w-4" />
        Kanban
      </button>
      <button
        type="button"
        onClick={() => setView("list")}
        className={cn(
          "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors",
          currentView === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
        )}
      >
        <List className="h-4 w-4" />
        List
      </button>
    </div>
  );
}
