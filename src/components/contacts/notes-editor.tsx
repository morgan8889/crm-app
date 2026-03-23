"use client";

import { Check, Pencil, X } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateContactNotesAction } from "@/lib/actions/contacts";

interface NotesEditorProps {
  contactId: string;
  initialNotes: string | null;
}

export function NotesEditor({ contactId, initialNotes }: NotesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [draft, setDraft] = useState(initialNotes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEdit() {
    setDraft(notes);
    setIsEditing(true);
    setError(null);
  }

  function handleCancel() {
    setIsEditing(false);
    setDraft(notes);
    setError(null);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateContactNotesAction(contactId, draft);
      if (result.error) {
        setError(result.error);
      } else {
        setNotes(draft);
        setIsEditing(false);
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Notes</h2>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            placeholder="Add notes about this contact…"
            disabled={isPending}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              <Check className="mr-1 h-4 w-4" />
              {isPending ? "Saving…" : "Save"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isPending}>
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-[80px] rounded-md border border-gray-200 bg-gray-50 p-3">
          {notes ? (
            <p className="whitespace-pre-wrap text-sm text-gray-700">{notes}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">No notes yet. Click Edit to add notes.</p>
          )}
        </div>
      )}
    </div>
  );
}
