import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Seed route disabled" },
    { status: 410 }
  );
}