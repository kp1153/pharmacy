import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(",").map((e) => e.trim()) || [];

export async function requireAccess() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!ALLOWED_EMAILS.includes(session.email)) redirect("/login");
  return session;
}