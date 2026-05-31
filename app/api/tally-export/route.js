import { db } from "@/lib/db";
import { sales, purchases } from "@/lib/schema";
import { sql } from "drizzle-orm";
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

  const purchaseRows = await db
    .select()
    .from(purchases)
    .where(sql`strftime('%Y-%m', created_at) = ${month}`)
    .orderBy(sql`created_at asc`);

  const salesData = salesRows.map(s => ({
    type: "Sale",
    date: s.createdAt?.split("T")[0] || s.createdAt?.split(" ")[0] || "",
    refNo: s.billNo,
    party: s.patientName || "Cash",
    amount: s.netAmount,
    gst: s.gstAmount,
    paymentType: s.paymentType,
  }));

  const purchaseData = purchaseRows.map(p => ({
    type: "Purchase",
    date: p.createdAt?.split("T")[0] || p.createdAt?.split(" ")[0] || "",
    refNo: p.invoiceNo || "",
    party: p.supplierName || "",
    amount: p.totalAmount,
    gst: 0,
    paymentType: p.paidAmount >= p.totalAmount ? "paid" : "pending",
  }));

  const totalSales = salesRows.reduce((s, r) => s + r.netAmount, 0);
  const totalPurchases = purchaseRows.reduce((s, r) => s + r.totalAmount, 0);
  const totalGst = salesRows.reduce((s, r) => s + r.gstAmount, 0);

  return NextResponse.json({
    sales: salesData,
    purchases: purchaseData,
    summary: { totalSales, totalPurchases, totalGst, month },
  });
}