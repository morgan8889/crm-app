"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function Pagination({ page, totalPages, total, pageSize }: PaginationProps) {
  const searchParams = useSearchParams();

  function buildHref(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    return `/companies?${params.toString()}`;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-sm text-gray-600">
        Showing {start}–{end} of {total} compan{total === 1 ? "y" : "ies"}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild disabled={page <= 1}>
          {page <= 1 ? (
            <span className="pointer-events-none opacity-50">Previous</span>
          ) : (
            <Link href={buildHref(page - 1)}>Previous</Link>
          )}
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
          {page >= totalPages ? (
            <span className="pointer-events-none opacity-50">Next</span>
          ) : (
            <Link href={buildHref(page + 1)}>Next</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
