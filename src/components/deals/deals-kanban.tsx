"use client";

import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { DealStage } from "@prisma/client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { updateDealStageAction } from "@/lib/actions/deals";

interface KanbanDeal {
  id: string;
  title: string;
  value: string | null;
  stage: DealStage;
  contact: { id: string; firstName: string; lastName: string } | null;
  company: { id: string; name: string } | null;
  expectedCloseDate: Date | null;
}

interface DealsKanbanProps {
  deals: KanbanDeal[];
}

const STAGE_ORDER: DealStage[] = [
  DealStage.LEAD,
  DealStage.QUALIFIED,
  DealStage.PROPOSAL,
  DealStage.NEGOTIATION,
  DealStage.CLOSED_WON,
  DealStage.CLOSED_LOST,
];

const STAGE_LABELS: Record<DealStage, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

const STAGE_COLORS: Record<DealStage, string> = {
  LEAD: "bg-gray-100 border-gray-300",
  QUALIFIED: "bg-blue-50 border-blue-200",
  PROPOSAL: "bg-yellow-50 border-yellow-200",
  NEGOTIATION: "bg-orange-50 border-orange-200",
  CLOSED_WON: "bg-green-50 border-green-200",
  CLOSED_LOST: "bg-red-50 border-red-200",
};

const STAGE_HEADER_COLORS: Record<DealStage, string> = {
  LEAD: "bg-gray-200 text-gray-700",
  QUALIFIED: "bg-blue-100 text-blue-700",
  PROPOSAL: "bg-yellow-100 text-yellow-700",
  NEGOTIATION: "bg-orange-100 text-orange-700",
  CLOSED_WON: "bg-green-100 text-green-700",
  CLOSED_LOST: "bg-red-100 text-red-700",
};

function formatCurrency(value: string | null): string {
  if (!value) return "—";
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getColumnTotal(deals: KanbanDeal[]): string {
  const total = deals.reduce((sum, d) => {
    if (!d.value) return sum;
    const v = Number.parseFloat(d.value);
    return Number.isNaN(v) ? sum : sum + v;
  }, 0);
  if (total === 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(total);
}

export function DealsKanban({ deals: initialDeals }: DealsKanbanProps) {
  const [deals, setDeals] = useState<KanbanDeal[]>(initialDeals);
  const [, startTransition] = useTransition();

  const dealsByStage = STAGE_ORDER.reduce<Record<DealStage, KanbanDeal[]>>(
    (acc, stage) => {
      acc[stage] = deals.filter((d) => d.stage === stage);
      return acc;
    },
    {} as Record<DealStage, KanbanDeal[]>
  );

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newStage = destination.droppableId as DealStage;

    // Optimistic update
    setDeals((prev) => prev.map((d) => (d.id === draggableId ? { ...d, stage: newStage } : d)));

    startTransition(async () => {
      const result = await updateDealStageAction(draggableId, newStage);
      if (result.error) {
        // Revert on error
        const originalStage = source.droppableId as DealStage;
        setDeals((prev) =>
          prev.map((d) => (d.id === draggableId ? { ...d, stage: originalStage } : d))
        );
      }
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGE_ORDER.map((stage) => {
          const columnDeals = dealsByStage[stage];
          return (
            <div
              key={stage}
              className={`flex min-w-[280px] flex-col rounded-lg border ${STAGE_COLORS[stage]}`}
            >
              {/* Column header */}
              <div className={`rounded-t-lg px-4 py-3 ${STAGE_HEADER_COLORS[stage]}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{STAGE_LABELS[stage]}</h3>
                  <span className="rounded-full bg-white bg-opacity-60 px-2 py-0.5 text-xs font-medium">
                    {columnDeals.length}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium opacity-75">
                  {getColumnTotal(columnDeals)}
                </p>
              </div>

              {/* Droppable column body */}
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex min-h-[120px] flex-1 flex-col gap-2 p-3 transition-colors ${
                      snapshot.isDraggingOver ? "bg-white bg-opacity-50" : ""
                    }`}
                  >
                    {columnDeals.map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-shadow ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-blue-400"
                                : "hover:shadow-md"
                            }`}
                          >
                            <Link
                              href={`/deals/${deal.id}`}
                              className="block"
                              onClick={(e) => {
                                // Prevent navigation during drag
                                if (snapshot.isDragging) e.preventDefault();
                              }}
                            >
                              <p className="font-medium text-gray-900 hover:text-blue-600 text-sm leading-snug">
                                {deal.title}
                              </p>
                            </Link>
                            <p className="mt-1 text-sm font-semibold text-gray-700">
                              {formatCurrency(deal.value)}
                            </p>
                            {deal.contact && (
                              <p className="mt-1 text-xs text-gray-500">
                                {deal.contact.firstName} {deal.contact.lastName}
                              </p>
                            )}
                            {deal.expectedCloseDate && (
                              <p className="mt-1 text-xs text-gray-400">
                                Close: {formatDate(deal.expectedCloseDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columnDeals.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-4">No deals</p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
