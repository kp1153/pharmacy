import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq, and, lt } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();

  const expiredUsers = await db
    .select()
    .from(users)
    .where(
      and(
        lt(users.expiryDate, now),
        eq(users.reminderSent, 0)
      )
    );

  for (const u of expiredUsers) {
    await db
      .update(users)
      .set({ reminderSent: 1 })
      .where(eq(users.id, u.id));
  }

  return NextResponse.json({
    success: true,
    processed: expiredUsers.length,
    time: now,
  });
}