import getDashboardURL from "@/app/utils/getDashboardURL";
import { SignOut } from "@/components/ui/signOut";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const userRole: string = session?.user.role;

  if (!session || !session?.user) {
    return;
  }

  const { username, email, role, created_at } = session.user;

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-xl border border-[#333] overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="bg-gradient-to-r p-8 border-b-1 border-b-blue-500">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#0a0a0a] border-4 border-white/20 flex items-center justify-center text-3xl font-bold">
                {username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{username}</h2>
                <p className="text-blue-100 capitalize">
                  {role?.toLowerCase() || "user"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8 space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white">
                {username}
              </div>
            </div>

            {/* Email with Verified Badge */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-white">{email}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Verified
                </span>
              </div>
            </div>

            {/* Member Since */}
            {created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Member Since
                </label>
                <div className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white">
                  {formatDate(created_at)}
                </div>
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Account Role
              </label>
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                  {role?.toLowerCase() || "undefined"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-[#333] p-6 bg-[#0a0a0a]/50">
            <div className="flex gap-3">
              <a
                href={getDashboardURL(userRole)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
              >
                Dashboard
              </a>
              <SignOut />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
