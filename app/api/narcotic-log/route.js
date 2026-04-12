import { db } from "@/lib/db";
import { narcoticLog } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(narcoticLog).orderBy(desc(narcoticLog.createdAt));
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  await db.insert(narcoticLog).values({
    medicineId: parseInt(body.medicineId),
    medicineName: body.medicineName,
    scheduleType: body.scheduleType,
    transactionType: body.transactionType,
    qty: parseInt(body.qty),
    saleId: body.saleId || null,
    purchaseId: body.purchaseId || null,
    patientName: body.patientName || null,
    patientPhone: body.patientPhone || null,
    doctorName: body.doctorName || null,
    prescriptionNo: body.prescriptionNo || null,
    remarks: body.remarks || null,
  });
  return NextResponse.json({ success: true });
}