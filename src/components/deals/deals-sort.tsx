"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";

export function DealsSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "created_desc";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`/deals?${params.toString()}`);
  }

  return (
    <Select value={currentSort} onChange={handleChange} className="w-44">
      <option value="created_desc">Newest first</option>
      <option value="created_asc">Oldest first</option>
      <option value="value_desc">Value (high → low)</option>
      <option value="value_asc">Value (low → high)</option>
      <option value="stage_asc">Stage (A → Z)</option>
      <option value="close_asc">Close date (soon)</option>
      <option value="close_desc">Close date (late)</option>
    </Select>
  );
}
