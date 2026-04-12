import { db } from "@/lib/db";
import { stores } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const all = await db.select().from(stores).where(eq(stores.isActive, 1));
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  await db.insert(stores).values({
    name: body.name,
    address: body.address || null,
    phone: body.phone || null,
    email: body.email || null,
    gstin: body.gstin || null,
    dlNo: body.dlNo || null,
    city: body.city || null,
    state: body.state || null,
    pincode: body.pincode || null,
    isActive: 1,
  });
  return NextResponse.json({ success: true });
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  await db.update(stores).set({
    name: body.name,
    address: body.address || null,
    phone: body.phone || null,
    email: body.email || null,
    gstin: body.gstin || null,
    dlNo: body.dlNo || null,
    city: body.city || null,
    state: body.state || null,
    pincode: body.pincode || null,
    isActive: body.isActive ?? 1,
  }).where(eq(stores.id, parseInt(id)));
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await db.update(stores).set({ isActive: 0 }).where(eq(stores.id, parseInt(id)));
  return NextResponse.json({ success: true });
}