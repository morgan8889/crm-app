export default function CompaniesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Company
        </button>
      </div>
      <p className="mt-2 text-gray-600">Manage your companies here.</p>
      <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-500">
        <p>No companies yet. Add your first company to get started.</p>
      </div>
    </div>
  );
}
