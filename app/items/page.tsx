export default function ItemsPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Items</h2>
      <p>List of submitted items will appear here.</p>
      <a href="/dashboard" className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Back to Dashboard</a>
    </main>
  );
}
