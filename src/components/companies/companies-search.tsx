"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function CompaniesSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset to page 1 when search/sort changes
      if (!("page" in updates)) {
        params.set("page", "1");
      }
      startTransition(() => {
        router.push(`/companies?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Search by name, domain, industry…"
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => updateParams({ search: e.target.value })}
        className="sm:max-w-xs"
        aria-label="Search companies"
      />
      <div className="flex items-center gap-2">
        <label htmlFor="sortBy" className="text-sm text-gray-600 whitespace-nowrap">
          Sort by
        </label>
        <Select
          id="sortBy"
          value={searchParams.get("sortBy") ?? "name"}
          onChange={(e) => updateParams({ sortBy: e.target.value })}
          className="w-36"
        >
          <option value="name">Name</option>
          <option value="createdAt">Date Created</option>
        </Select>
        <Select
          value={searchParams.get("sortOrder") ?? "asc"}
          onChange={(e) => updateParams({ sortOrder: e.target.value })}
          className="w-24"
          aria-label="Sort order"
        >
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </Select>
      </div>
    </div>
  );
}
