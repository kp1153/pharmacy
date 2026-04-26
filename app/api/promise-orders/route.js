import { db } from "@/lib/db";
import { promiseOrders } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(promiseOrders).orderBy(desc(promiseOrders.createdAt));
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  await db.insert(promiseOrders).values({
    patientName: body.patientName,
    patientPhone: body.patientPhone || null,
    medicineName: body.medicineName,
    qty: parseInt(body.qty) || 1,
    status: "pending",
  });
  return NextResponse.json({ success: true });
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  await db.update(promiseOrders).set({ status: body.status }).where(eq(promiseOrders.id, parseInt(id)));
  return NextResponse.json({ success: true });
}