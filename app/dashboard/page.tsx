export default function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to your dashboard. Here you can manage items and reviews.</p>
      <a href="/items" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go to Items</a>
    </main>
  );
}
