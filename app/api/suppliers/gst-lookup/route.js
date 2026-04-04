import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const gstin = searchParams.get("gstin");

  if (!gstin || gstin.length !== 15) {
    return NextResponse.json({ error: "Invalid GSTIN" }, { status: 400 });
  }

  const url = `https://api.gst.gov.in/commonapi/v1.1/search?action=TP&gstin=${gstin}`;

  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "GST API unavailable" }, { status: 502 });
    }

    const data = await res.json();

    return NextResponse.json({
      name: data.tradeNam || data.lgnm || null,
      address: data.pradr?.adr || null,
      state: data.pradr?.addr?.stcd || null,
      status: data.sts || null,
    });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}