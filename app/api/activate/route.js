import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  const body = await request.json();

  const secret = process.env.HUB_SECRET;
  const bearerOk = authHeader === `Bearer ${secret}`;
  const bodyOk = body.secret === secret;

  if (!bearerOk && !bodyOk) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { email, months } = body;
  if (!email)
    return Response.json({ error: "email required" }, { status: 400 });

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + (months || 12));

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [email],
  });

  if (existing.rows.length === 0) {
    // User नहीं है → pre_activations में डालो
    await db.execute({
      sql: "INSERT INTO pre_activations (email) VALUES (?) ON CONFLICT(email) DO NOTHING",
      args: [email],
    });
  } else {
    // User है → activate करो
    await db.execute({
      sql: "UPDATE users SET status = 'active', expiry_date = ?, reminder_sent = 0 WHERE email = ?",
      args: [expiry.toISOString(), email],
    });
  }

  return Response.json({
    success: true,
    ok: true,
    email,
    expiryDate: expiry.toISOString(),
  });
}
