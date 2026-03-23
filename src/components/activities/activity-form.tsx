"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ActivityResult } from "@/lib/actions/activities";
import { createActivityAction, updateActivityAction } from "@/lib/actions/activities";
import type { Activity } from "@/types";

interface ActivityFormContact {
  id: string;
  firstName: string;
  lastName: string;
}

interface ActivityFormDeal {
  id: string;
  title: string;
}

interface ActivityFormProps {
  activity?: Activity;
  contacts: ActivityFormContact[];
  deals: ActivityFormDeal[];
}

const TYPE_OPTIONS = [
  { value: "CALL", label: "Call" },
  { value: "EMAIL", label: "Email" },
  { value: "MEETING", label: "Meeting" },
  { value: "NOTE", label: "Note" },
];

const initialState: ActivityResult = { error: undefined };

export function ActivityForm({ activity, contacts, deals }: ActivityFormProps) {
  const action = activity ? updateActivityAction : createActivityAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const defaultDate = activity
    ? new Date(activity.date).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16);

  return (
    <form action={formAction} className="max-w-2xl space-y-6 rounded-lg border bg-white p-6">
      {activity && <input type="hidden" name="id" value={activity.id} />}

      {state.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{state.error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={activity?.type ?? "CALL"}>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="date">Date & Time</Label>
          <Input type="datetime-local" name="date" defaultValue={defaultDate} />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Input
          name="subject"
          defaultValue={activity?.subject ?? ""}
          required
          placeholder="Brief summary"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          defaultValue={activity?.description ?? ""}
          rows={4}
          placeholder="Details..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="durationMinutes">Duration (min)</Label>
          <Input
            type="number"
            name="durationMinutes"
            min="0"
            defaultValue={activity?.durationMinutes ?? ""}
            placeholder="e.g. 30"
          />
        </div>
        <div>
          <Label htmlFor="contactId">Contact</Label>
          <Select name="contactId" defaultValue={activity?.contactId ?? ""}>
            <option value="">None</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="dealId">Deal</Label>
          <Select name="dealId" defaultValue={activity?.dealId ?? ""}>
            <option value="">None</option>
            {deals.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : activity ? "Update Activity" : "Create Activity"}
        </Button>
        <Link href={activity ? `/activities/${activity.id}` : "/activities"}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
