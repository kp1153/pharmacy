import { db } from "@/lib/db";
import { sales, saleItems } from "@/lib/schema";
import { sql, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  if (!month) return NextResponse.json({ error: "month required" }, { status: 400 });

  const salesRows = await db
    .select()
    .from(sales)
    .where(sql`strftime('%Y-%m', created_at) = ${month}`)
    .orderBy(sql`created_at asc`);

  const result = salesRows.map(s => ({
    billNo: s.billNo,
    date: s.createdAt?.split("T")[0] || s.createdAt?.split(" ")[0] || "",
    patientName: s.patientName || "",
    patientPhone: s.patientPhone || "",
    subtotal: s.subtotal,
    discount: s.discount,
    gstAmount: s.gstAmount,
    netAmount: s.netAmount,
    paymentType: s.paymentType,
  }));

  const totalTaxable = result.reduce((s, r) => s + (r.subtotal - r.discount), 0);
  const totalGst = result.reduce((s, r) => s + r.gstAmount, 0);
  const totalNet = result.reduce((s, r) => s + r.netAmount, 0);

  return NextResponse.json({ sales: result, summary: { totalTaxable, totalGst, totalNet, count: result.length } });
}