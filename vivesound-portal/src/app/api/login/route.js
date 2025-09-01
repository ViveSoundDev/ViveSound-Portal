import { NextResponse } from "next/server";

export async function POST(req) {
  const incoming = await req.json();

  const upstream = await fetch(
    "https://01x12geaf5.execute-api.us-east-1.amazonaws.com/prod/cryptlex-login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(incoming), // { email, password }
    }
  );

  // Read as text first, then safely parse JSON
  const raw = await upstream.text();
  let outer;
  try {
    outer = JSON.parse(raw);
  } catch {
    outer = raw; // not JSON
  }

  // Unwrap API Gateway shape if present: { statusCode, headers, body: "<json-string>" }
  let payload = outer;
  if (
    outer &&
    typeof outer === "object" &&
    "body" in outer &&
    typeof outer.body === "string"
  ) {
    try {
      payload = JSON.parse(outer.body);
    } catch {
      // leave as string; we'll treat as error below
      payload = { message: outer.body };
    }
  }

  // If backend encodes errors in payload even with 200
  const errorMessage =
    payload?.errorMessage || payload?.message || payload?.error || null;

  // If your backend returns a token on success, set it; otherwise return error
  const token = payload?.accessToken || null;
  const email = payload?.userEmail || null;
  const orgName = payload?.orgDetails?.name || null;
  const orgid = payload?.orgDetails?.id || null;

  if (!upstream.ok || errorMessage || !token || !email || !orgName || !orgid) {
    // Pick best message, fall back to generic
    const msg = errorMessage || "Login failed";
    return NextResponse.json({ message: msg }, { status: 401 });
  }

  // Success: set HttpOnly cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  res.cookies.set("user_email", email, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  res.cookies.set("org_name", orgName, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  res.cookies.set("org_id", orgid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}
