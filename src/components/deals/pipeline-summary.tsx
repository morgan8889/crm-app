import type { DealStage } from "@prisma/client";

interface StageSummary {
  stage: DealStage;
  count: number;
  total: number;
}

interface PipelineSummaryProps {
  summaries: StageSummary[];
}

const STAGE_LABELS: Record<DealStage, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

function formatCurrency(value: number): string {
  if (value === 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PipelineSummary({ summaries }: PipelineSummaryProps) {
  const totalDeals = summaries.reduce((s, x) => s + x.count, 0);
  const totalValue = summaries.reduce((s, x) => s + x.total, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Pipeline Summary</h2>
        <span className="text-xs text-gray-500">
          {totalDeals} deals · {formatCurrency(totalValue)} total
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {summaries.map(({ stage, count, total }) => (
          <div key={stage} className="rounded-md bg-gray-50 px-3 py-2">
            <p className="text-xs font-medium text-gray-500">{STAGE_LABELS[stage]}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{count}</p>
            <p className="text-xs text-gray-600">{formatCurrency(total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
