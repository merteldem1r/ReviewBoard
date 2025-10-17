import getDashboardURL from "@/app/utils/getDashboardURL";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function SystemPage() {
  const session = await getServerSession(authOptions);
  const userRole: string = session?.user.role;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Information</h1>
            <p className="text-gray-400">
              Technical details and configuration overview
            </p>
          </div>
          <Link
            href={getDashboardURL(userRole)}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Tech Stack */}
        <section className="mb-8">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Tech Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Frontend */}
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333]">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Frontend
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next.js</span>
                    <span className="text-xs text-green-400">15.5.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">React</span>
                    <span className="text-xs text-green-400">19</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">TypeScript</span>
                    <span className="text-xs text-green-400">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tailwind CSS</span>
                    <span className="text-xs text-green-400">3.4.1</span>
                  </div>
                </div>
              </div>

              {/* Backend */}
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333]">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Backend
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next.js API Routes</span>
                    <span className="text-xs text-blue-400">REST</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">NextAuth.js</span>
                    <span className="text-xs text-blue-400">JWT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prisma ORM</span>
                    <span className="text-xs text-green-400">6.17.1</span>
                  </div>
                </div>
              </div>

              {/* Database & Hosting */}
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333]">
                <h3 className="text-sm font-medium text-gray-400 mb-3">
                  Infrastructure
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PostgreSQL</span>
                    <span className="text-xs text-blue-400">Database</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Supabase</span>
                    <span className="text-xs text-green-400">Hosting</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vercel</span>
                    <span className="text-xs text-green-400">Deploy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Roles */}
        <section className="mb-8">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              User Roles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* User */}
              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#333]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                    USER
                  </span>
                </div>
                <h3 className="font-semibold mb-2">Standard User</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Can create and manage their own items
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Create items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>View own items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Review items</span>
                  </li>
                </ul>
              </div>

              {/* Reviewer */}
              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#333]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    REVIEWER
                  </span>
                </div>
                <h3 className="font-semibold mb-2">Reviewer</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Can review and approve/reject items
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>View all items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Approve items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Reject items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✗</span>
                    <span>Manage system</span>
                  </li>
                </ul>
              </div>

              {/* Admin */}
              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#333]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    ADMIN
                  </span>
                </div>
                <h3 className="font-semibold mb-2">Administrator</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Full system access and management
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>All reviewer permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Manage users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Configure tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Configure rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>View audit logs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Automation & Cron Jobs */}
        <section className="mb-8">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Automated Processes
            </h2>

            <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#333] mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Status Auto-Progression
                  </h3>
                  <p className="text-sm text-gray-400">
                    Automatically moves items from NEW to IN_REVIEW status
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Schedule</div>
                    <div className="text-sm font-medium">Every 10 minutes</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Trigger Service
                    </div>
                    <div className="text-sm font-medium">
                      <a
                        href="https://console.cron-job.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        cron-job.org
                      </a>
                      <span className="text-gray-500 ml-1 text-xs">
                        (External)
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Trigger Condition
                    </div>
                    <div className="text-sm font-medium">
                      Items created{" "}
                      <span className="text-yellow-400">30+ minutes ago</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Status Change
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-300">
                        NEW
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        IN_REVIEW
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Endpoint</div>
                    <div className="text-sm font-mono bg-[#1a1a1a] px-2 py-1 rounded border border-[#333]">
                      /api/crons/item-status-scheduler
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Authentication
                    </div>
                    <div className="text-sm font-medium">
                      Bearer Token (CRON_SECRET)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Audit Logging
                    </div>
                    <div className="text-sm font-medium flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span>STATUS_CHANGED_BY_SYSTEM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#333]">
                <div className="text-xs text-gray-500 mb-2">Purpose</div>
                <p className="text-sm text-gray-400">
                  Creates the perception of active review by automatically
                  progressing items to IN_REVIEW status after 30 minutes,
                  simulating immediate attention from reviewers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Scoring */}
        <section>
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Risk Scoring System
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333]">
                <h3 className="font-semibold mb-3">Rule Types</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-400 font-medium text-sm">
                        AMOUNT_RULE
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Assigns risk scores based on transaction amounts. Higher
                      amounts = higher risk.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400 font-medium text-sm">
                        TAG_RULE
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Associates risk scores with specific tags. Items inherit
                      tag risk scores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#333]">
                <h3 className="font-semibold mb-3">Risk Levels</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Risk</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                      0-30
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Risk</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      31-70
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Risk</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                      71-100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
