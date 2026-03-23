export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to your CRM dashboard.</p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Contacts", value: "0" },
          { label: "Total Companies", value: "0" },
          { label: "Active Deals", value: "0" },
          { label: "Activities This Week", value: "0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
