import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import getDashboardURL from "../utils/getDashboardURL";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userRole: string = session?.user.role;
  redirect(getDashboardURL(userRole));

  return <></>;
}
