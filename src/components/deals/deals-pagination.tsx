"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DealsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function DealsPagination({ currentPage, totalPages }: DealsPaginationProps) {
  const searchParams = useSearchParams();

  function getHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `/deals?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild disabled={currentPage <= 1}>
          <Link href={getHref(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild disabled={currentPage >= totalPages}>
          <Link href={getHref(currentPage + 1)}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
