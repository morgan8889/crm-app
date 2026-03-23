"use server";

import { DealStage } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface DealResult {
  error?: string;
  id?: string;
}

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function createDealAction(
  _prevState: DealResult,
  formData: FormData
): Promise<DealResult> {
  await requireAuth();

  const title = formData.get("title");
  const valueStr = formData.get("value");
  const stage = formData.get("stage");
  const contactId = formData.get("contactId");
  const companyId = formData.get("companyId");
  const expectedCloseDateStr = formData.get("expectedCloseDate");
  const notes = formData.get("notes");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Title is required" };
  }

  if (
    stage !== null &&
    typeof stage === "string" &&
    stage.trim() &&
    !Object.values(DealStage).includes(stage as DealStage)
  ) {
    return { error: "Invalid stage" };
  }

  let value: string | null = null;
  if (typeof valueStr === "string" && valueStr.trim()) {
    const parsed = Number.parseFloat(valueStr.trim());
    if (Number.isNaN(parsed) || parsed < 0) {
      return { error: "Value must be a non-negative number" };
    }
    value = valueStr.trim();
  }

  let expectedCloseDate: Date | null = null;
  if (typeof expectedCloseDateStr === "string" && expectedCloseDateStr.trim()) {
    expectedCloseDate = new Date(expectedCloseDateStr.trim());
    if (Number.isNaN(expectedCloseDate.getTime())) {
      return { error: "Invalid expected close date" };
    }
  }

  const deal = await prisma.deal.create({
    data: {
      title: title.trim(),
      value: value ?? undefined,
      stage: typeof stage === "string" && stage.trim() ? (stage as DealStage) : DealStage.LEAD,
      contactId: typeof contactId === "string" && contactId.trim() ? contactId.trim() : null,
      companyId: typeof companyId === "string" && companyId.trim() ? companyId.trim() : null,
      expectedCloseDate,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/deals");
  redirect(`/deals/${deal.id}`);
}

export async function updateDealAction(
  _prevState: DealResult,
  formData: FormData
): Promise<DealResult> {
  await requireAuth();

  const id = formData.get("id");
  const title = formData.get("title");
  const valueStr = formData.get("value");
  const stage = formData.get("stage");
  const contactId = formData.get("contactId");
  const companyId = formData.get("companyId");
  const expectedCloseDateStr = formData.get("expectedCloseDate");
  const notes = formData.get("notes");

  if (typeof id !== "string" || !id.trim()) {
    return { error: "Invalid deal ID" };
  }
  if (typeof title !== "string" || !title.trim()) {
    return { error: "Title is required" };
  }

  if (
    stage !== null &&
    typeof stage === "string" &&
    stage.trim() &&
    !Object.values(DealStage).includes(stage as DealStage)
  ) {
    return { error: "Invalid stage" };
  }

  let value: string | null = null;
  if (typeof valueStr === "string" && valueStr.trim()) {
    const parsed = Number.parseFloat(valueStr.trim());
    if (Number.isNaN(parsed) || parsed < 0) {
      return { error: "Value must be a non-negative number" };
    }
    value = valueStr.trim();
  }

  let expectedCloseDate: Date | null = null;
  if (typeof expectedCloseDateStr === "string" && expectedCloseDateStr.trim()) {
    expectedCloseDate = new Date(expectedCloseDateStr.trim());
    if (Number.isNaN(expectedCloseDate.getTime())) {
      return { error: "Invalid expected close date" };
    }
  }

  const existing = await prisma.deal.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Deal not found" };
  }

  await prisma.deal.update({
    where: { id },
    data: {
      title: title.trim(),
      value: value ?? null,
      stage: typeof stage === "string" && stage.trim() ? (stage as DealStage) : DealStage.LEAD,
      contactId: typeof contactId === "string" && contactId.trim() ? contactId.trim() : null,
      companyId: typeof companyId === "string" && companyId.trim() ? companyId.trim() : null,
      expectedCloseDate,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/deals");
  revalidatePath(`/deals/${id}`);
  redirect(`/deals/${id}`);
}

export async function deleteDealAction(dealId: string): Promise<DealResult> {
  await requireAuth();

  const existing = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!existing) {
    return { error: "Deal not found" };
  }

  await prisma.deal.delete({ where: { id: dealId } });

  revalidatePath("/deals");
  redirect("/deals");
}

export async function updateDealStageAction(dealId: string, stage: DealStage): Promise<DealResult> {
  await requireAuth();

  if (!Object.values(DealStage).includes(stage)) {
    return { error: "Invalid stage" };
  }

  const existing = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!existing) {
    return { error: "Deal not found" };
  }

  await prisma.deal.update({
    where: { id: dealId },
    data: { stage },
  });

  revalidatePath("/deals");
  return {};
}
