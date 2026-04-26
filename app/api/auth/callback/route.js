import { googleClient } from "@/lib/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users, preActivations } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createSessionCookie } from "@/lib/session";

const DEVELOPER_EMAIL = "prasad.kamta@gmail.com";
const TRIAL_DAYS = 7;

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
    const userInfo = await userInfoRes.json();

    const email = userInfo.email;
    const name = userInfo.name;
    const picture = userInfo.picture;

    // --- Developer shortcut ---
    if (email === DEVELOPER_EMAIL) {
      await createSessionCookie({ userId: 0, email, name, picture });
      cookieStore.delete("google_oauth_state");
      cookieStore.delete("google_code_verifier");
      return Response.redirect(new URL("/dashboard", request.url).toString());
    }

    // --- users table check ---
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      // नया user → trial INSERT
      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + TRIAL_DAYS);

      await db.insert(users).values({
        email,
        name,
        status: "trial",
        expiryDate: trialEnds.toISOString(),
        reminderSent: 0,
      });

      // pre_activations check → payment पहले हुई थी?
      const preAct = await db
        .select()
        .from(preActivations)
        .where(eq(preActivations.email, email))
        .limit(1);

      if (preAct.length > 0) {
        const activeExpiry = new Date();
        activeExpiry.setFullYear(activeExpiry.getFullYear() + 1);

        await db
          .update(users)
          .set({
            status: "active",
            expiryDate: activeExpiry.toISOString(),
            reminderSent: 0,
          })
          .where(eq(users.email, email));

        await db
          .delete(preActivations)
          .where(eq(preActivations.email, email));
      }
    } else {
      // पुराना user → name update करो
      await db
        .update(users)
        .set({ name })
        .where(eq(users.email, email));
    }

    // Fresh read
    const userRow = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const u = userRow[0];

    await createSessionCookie({ userId: u.id, email, name, picture });
    cookieStore.delete("google_oauth_state");
    cookieStore.delete("google_code_verifier");

    const now = new Date();
    const expiry = u.expiryDate ? new Date(u.expiryDate) : null;

    const isActive = u.status === "active" && expiry && now < expiry;
    const isTrial  = u.status === "trial"  && expiry && now < expiry;

    if (isActive || isTrial) {
      return Response.redirect(new URL("/dashboard", request.url).toString());
    }

    return Response.redirect(new URL("/expired", request.url).toString());

  } catch (e) {
    console.error("callback error:", e);
    return Response.redirect(new URL("/login?error=failed", request.url).toString());
  }
}