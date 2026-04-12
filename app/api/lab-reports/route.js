import { db } from "@/lib/db";
import { labReports } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");
  if (patientId) {
    const all = await db.select().from(labReports).where(eq(labReports.patientId, parseInt(patientId)));
    return NextResponse.json(all);
  }
  const all = await db.select().from(labReports);
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  await db.insert(labReports).values({
    patientId: body.patientId,
    prescriptionId: body.prescriptionId || null,
    category: body.category,
    testName: body.testName,
    result: body.result || null,
    reportDate: body.reportDate || null,
  });
  return NextResponse.json({ success: true });
}