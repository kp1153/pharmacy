import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ACTIVATION_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { email, months } = await request.json();
  if (!email) return Response.json({ error: "email required" }, { status: 400 });

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + (months || 12));

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [email],
  });

  if (existing.rows.length === 0) {
    await db.execute({
      sql: "INSERT INTO users (email, status, expiry_date, reminder_sent) VALUES (?, 'active', ?, 0)",
      args: [email, expiry.toISOString()],
    });
  } else {
    await db.execute({
      sql: "UPDATE users SET status = 'active', expiry_date = ?, reminder_sent = 0 WHERE email = ?",
      args: [expiry.toISOString(), email],
    });
  }

  return Response.json({ ok: true, email, expiryDate: expiry.toISOString() });
}