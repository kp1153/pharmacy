import { db } from "@/lib/db";
import { bankTransactions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(bankTransactions).orderBy(desc(bankTransactions.date));
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  await db.insert(bankTransactions).values({
    date: body.date,
    description: body.description,
    amount: parseFloat(body.amount),
    type: body.type,
    category: body.category || null,
    referenceNo: body.referenceNo || null,
    bankName: body.bankName || null,
    reconciled: body.reconciled ? 1 : 0,
    saleId: body.saleId || null,
    purchaseId: body.purchaseId || null,
    remarks: body.remarks || null,
  });
  return NextResponse.json({ success: true });
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  await db.update(bankTransactions).set({
    reconciled: body.reconciled ? 1 : 0,
    remarks: body.remarks || null,
  }).where(eq(bankTransactions.id, parseInt(id)));
  return NextResponse.json({ success: true });
}