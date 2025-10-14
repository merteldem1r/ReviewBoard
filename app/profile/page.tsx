import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default function Profile() {
  const session = getServerSession(authOptions);

  console.log(session);

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto"></div>
    </main>
  );
}
