import { googleClient } from "@/lib/auth";
import { cookies } from "next/headers";
import { createSessionCookie } from "@/lib/session";
import { NextResponse } from "next/server";

const DEVELOPER_EMAIL = "prasad.kamta@gmail.com";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  try {
    const tokens = await googleClient.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(new URL("/login?error=failed", request.url));
    }

    const userInfo = await userInfoRes.json();
    const { email, name, picture } = userInfo;

    if (!email) {
      return NextResponse.redirect(new URL("/login?error=failed", request.url));
    }

    if (email !== DEVELOPER_EMAIL) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
    }

    await createSessionCookie({ email, name, picture });

    cookieStore.delete("google_oauth_state");
    cookieStore.delete("google_code_verifier");

    return NextResponse.redirect(new URL("/home", request.url));

  } catch (e) {
    console.error("callback error:", e);
    return NextResponse.redirect(new URL("/login?error=failed", request.url));
  }
}