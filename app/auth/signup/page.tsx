export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form className="flex flex-col space-y-4 w-64">
        <input type="email" placeholder="Email" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up with Email</button>
      </form>
      <div className="mt-6">
        <a href="/api/auth/signin/github" className="bg-gray-800 text-white px-4 py-2 rounded">Sign Up with GitHub</a>
      </div>
      <div className="mt-4">
        <a href="/auth/signin" className="text-blue-600">Already have an account? Sign In</a>
      </div>
    </main>
  );
}
