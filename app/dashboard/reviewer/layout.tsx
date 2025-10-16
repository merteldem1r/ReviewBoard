import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Check if user has REVIEWER or ADMIN role
  if (session.user.role !== "REVIEWER") {
    redirect("/");
  }

  return <>{children}</>;
}
