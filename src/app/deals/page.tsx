export default function DealsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Deal
        </button>
      </div>
      <p className="mt-2 text-gray-600">Manage your deals pipeline here.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"].map(
          (stage) => (
            <div key={stage} className="rounded-lg border bg-white p-4">
              <h3 className="font-semibold text-gray-800">{stage}</h3>
              <p className="mt-1 text-sm text-gray-500">0 deals</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
