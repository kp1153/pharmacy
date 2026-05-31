import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const DEVELOPER_EMAIL = "prasad.kamta@gmail.com";

export async function requireAccess() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.email !== DEVELOPER_EMAIL) redirect("/login");
  return session;
}