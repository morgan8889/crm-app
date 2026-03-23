export default function ActivitiesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Log Activity
        </button>
      </div>
      <p className="mt-2 text-gray-600">Track calls, emails, meetings, and notes.</p>
      <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-500">
        <p>No activities yet. Log your first activity to get started.</p>
      </div>
    </div>
  );
}
