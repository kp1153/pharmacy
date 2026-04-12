import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import { eq, like, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const barcode = searchParams.get("barcode");

  if (barcode) {
    const result = await db.select().from(medicines).where(eq(medicines.barcode, barcode)).limit(1);
    return NextResponse.json(result[0] || null);
  }

  if (search) {
    const result = await db.select().from(medicines).where(
      or(
        like(medicines.name, `%${search}%`),
        like(medicines.generic, `%${search}%`),
        like(medicines.barcode, `%${search}%`)
      )
    );
    return NextResponse.json(result);
  }

  const all = await db.select().from(medicines);
  return NextResponse.json(all);
}

export async function POST(req) {
  const body = await req.json();
  await db.insert(medicines).values({
    name: body.name,
    generic: body.generic || null,
    company: body.company || null,
    batch: body.batch || null,
    expiry: body.expiry || null,
    mrp: parseFloat(body.mrp),
    purchasePrice: body.purchasePrice ? parseFloat(body.purchasePrice) : null,
    stock: parseInt(body.stock) || 0,
    reorderLevel: parseInt(body.reorderLevel) || 10,
    unit: body.unit || "strip",
    rack: body.rack || null,
    hsn: body.hsn || null,
    gst: parseFloat(body.gst) || 12,
    barcode: body.barcode || null,
    scheduleType: body.scheduleType || "general",
  });
  return NextResponse.json({ success: true });
}