export default function ContactsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Contact
        </button>
      </div>
      <p className="mt-2 text-gray-600">Manage your contacts here.</p>
      <div className="mt-8 rounded-lg border bg-white p-8 text-center text-gray-500">
        <p>No contacts yet. Add your first contact to get started.</p>
      </div>
    </div>
  );
}
