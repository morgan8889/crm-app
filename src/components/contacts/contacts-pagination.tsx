"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ContactsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ContactsPagination({ currentPage, totalPages }: ContactsPaginationProps) {
  const searchParams = useSearchParams();

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/contacts?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild disabled={currentPage <= 1}>
          <Link href={buildUrl(currentPage - 1)} aria-disabled={currentPage <= 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild disabled={currentPage >= totalPages}>
          <Link href={buildUrl(currentPage + 1)} aria-disabled={currentPage >= totalPages}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
