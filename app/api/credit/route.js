import { db } from "@/lib/db";
import { udhar } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(udhar)
    .orderBy(sql`created_at desc`);

  return NextResponse.json(rows);
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { patientName, patientPhone, amount, note, saleId } = await request.json();
  if (!patientName || !amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await db.insert(udhar).values({
    patientName,
    patientPhone: patientPhone || "",
    amount: parseFloat(amount),
    paid: 0,
    note: note || "",
    saleId: saleId || null,
  });

  return NextResponse.json({ success: true });
}