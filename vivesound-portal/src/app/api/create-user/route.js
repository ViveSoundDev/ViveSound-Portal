// app/api/create-user/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  // cookies() must be awaited first, then .get(...)
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const orgIdFromCookie = cookieStore.get("org_id")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: no token" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { email, firstName, lastName } = body;

    // enforce orgId from cookie
    const organizationId = orgIdFromCookie;

    if (!email || !firstName || !lastName || !organizationId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const upstream = await fetch(
      "https://01x12geaf5.execute-api.us-east-1.amazonaws.com/prod/create-user",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          organizationId,
        }),
      }
    );

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to create user" },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("create-user error:", err);
    return NextResponse.json(
      { message: "Server error while creating user" },
      { status: 500 }
    );
  }
}
