import { db } from "@/lib/db";
import { udhar } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function PATCH(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const { paid } = await request.json();

  await db
    .update(udhar)
    .set({ paid: parseFloat(paid) })
    .where(eq(udhar.id, parseInt(id)));

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(udhar).where(eq(udhar.id, parseInt(id)));

  return NextResponse.json({ success: true });
}