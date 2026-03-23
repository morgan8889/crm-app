"use server";

import { ActivityType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface ActivityResult {
  error?: string;
  id?: string;
}

async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function createActivityAction(
  _prevState: ActivityResult,
  formData: FormData
): Promise<ActivityResult> {
  const session = await requireAuth();

  const type = formData.get("type");
  const subject = formData.get("subject");
  const description = formData.get("description");
  const dateStr = formData.get("date");
  const durationStr = formData.get("durationMinutes");
  const contactId = formData.get("contactId");
  const dealId = formData.get("dealId");

  if (typeof subject !== "string" || !subject.trim()) {
    return { error: "Subject is required" };
  }
  if (typeof type !== "string" || !Object.values(ActivityType).includes(type as ActivityType)) {
    return { error: "Invalid activity type" };
  }

  let date = new Date();
  if (typeof dateStr === "string" && dateStr.trim()) {
    date = new Date(dateStr.trim());
    if (Number.isNaN(date.getTime())) return { error: "Invalid date" };
  }

  let durationMinutes: number | null = null;
  if (typeof durationStr === "string" && durationStr.trim()) {
    durationMinutes = Number.parseInt(durationStr.trim(), 10);
    if (Number.isNaN(durationMinutes) || durationMinutes < 0) {
      return { error: "Duration must be a non-negative number" };
    }
  }

  const activity = await prisma.activity.create({
    data: {
      type: type as ActivityType,
      subject: subject.trim(),
      description:
        typeof description === "string" && description.trim() ? description.trim() : null,
      date,
      durationMinutes,
      contactId: typeof contactId === "string" && contactId.trim() ? contactId.trim() : null,
      dealId: typeof dealId === "string" && dealId.trim() ? dealId.trim() : null,
      createdById: session.userId,
    },
  });

  revalidatePath("/activities");
  redirect(`/activities/${activity.id}`);
}

export async function updateActivityAction(
  _prevState: ActivityResult,
  formData: FormData
): Promise<ActivityResult> {
  await requireAuth();

  const id = formData.get("id");
  const type = formData.get("type");
  const subject = formData.get("subject");
  const description = formData.get("description");
  const dateStr = formData.get("date");
  const durationStr = formData.get("durationMinutes");
  const contactId = formData.get("contactId");
  const dealId = formData.get("dealId");

  if (typeof id !== "string" || !id.trim()) return { error: "Invalid activity ID" };
  if (typeof subject !== "string" || !subject.trim()) return { error: "Subject is required" };
  if (typeof type !== "string" || !Object.values(ActivityType).includes(type as ActivityType)) {
    return { error: "Invalid activity type" };
  }

  const existing = await prisma.activity.findUnique({ where: { id } });
  if (!existing) return { error: "Activity not found" };

  let date = existing.date;
  if (typeof dateStr === "string" && dateStr.trim()) {
    date = new Date(dateStr.trim());
    if (Number.isNaN(date.getTime())) return { error: "Invalid date" };
  }

  let durationMinutes: number | null = null;
  if (typeof durationStr === "string" && durationStr.trim()) {
    durationMinutes = Number.parseInt(durationStr.trim(), 10);
    if (Number.isNaN(durationMinutes) || durationMinutes < 0) return { error: "Invalid duration" };
  }

  await prisma.activity.update({
    where: { id },
    data: {
      type: type as ActivityType,
      subject: subject.trim(),
      description:
        typeof description === "string" && description.trim() ? description.trim() : null,
      date,
      durationMinutes,
      contactId: typeof contactId === "string" && contactId.trim() ? contactId.trim() : null,
      dealId: typeof dealId === "string" && dealId.trim() ? dealId.trim() : null,
    },
  });

  revalidatePath("/activities");
  revalidatePath(`/activities/${id}`);
  redirect(`/activities/${id}`);
}

export async function deleteActivityAction(activityId: string): Promise<ActivityResult> {
  await requireAuth();

  const existing = await prisma.activity.findUnique({ where: { id: activityId } });
  if (!existing) return { error: "Activity not found" };

  await prisma.activity.delete({ where: { id: activityId } });

  revalidatePath("/activities");
  redirect("/activities");
}
