import { db } from "@/lib/db";
import { prescriptions } from "@/lib/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(prescriptions).orderBy(desc(prescriptions.createdAt));
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  await db.insert(prescriptions).values({
    patientId: body.patientId,
    diagnosis: body.diagnosis || null,
    notes: body.notes || null,
    medicines: JSON.stringify(body.medicines),
    tests: body.tests ? JSON.stringify(body.tests) : null,
    sentToPharmacy: 1,
  });
  return NextResponse.json({ success: true });
}