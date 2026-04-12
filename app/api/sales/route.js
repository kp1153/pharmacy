import { db } from "@/lib/db";
import { sales, saleItems, medicines, narcoticLog } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(sales).orderBy(desc(sales.createdAt));
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  const billNo = "BILL-" + Date.now();

  await db.insert(sales).values({
    billNo,
    patientId: body.patient.id || null,
    patientName: body.patient.name,
    patientPhone: body.patient.phone || null,
    subtotal: body.subtotal,
    discount: body.discount,
    gstAmount: 0,
    netAmount: body.netAmount,
    paymentType: body.paymentType,
    paidAmount: body.paymentType === "Credit" ? 0 : body.netAmount,
  });

  const inserted = await db
    .select({ id: sales.id })
    .from(sales)
    .where(eq(sales.billNo, billNo))
    .limit(1);

  const billId = inserted[0].id;

  for (const item of body.items) {
    await db.insert(saleItems).values({
      saleId: billId,
      medicineId: item.medicineId,
      medicineName: item.medicineName,
      batch: item.batch,
      expiry: item.expiry,
      qty: item.qty,
      mrp: item.mrp,
      discount: item.discount || 0,
      gst: item.gst || 0,
      amount: item.amount,
    });

    await db
      .update(medicines)
      .set({ stock: sql`stock - ${item.qty}` })
      .where(eq(medicines.id, item.medicineId));

    // narcotic auto-log
    if (item.scheduleType && item.scheduleType !== "general") {
      await db.insert(narcoticLog).values({
        medicineId: item.medicineId,
        medicineName: item.medicineName,
        scheduleType: item.scheduleType,
        transactionType: "sale",
        qty: item.qty,
        saleId: billId,
        patientName: body.patient.name || null,
        patientPhone: body.patient.phone || null,
        doctorName: body.doctorName || null,
        prescriptionNo: body.prescriptionNo || null,
        remarks: null,
      });
    }
  }

  return NextResponse.json({ success: true, billId });
}