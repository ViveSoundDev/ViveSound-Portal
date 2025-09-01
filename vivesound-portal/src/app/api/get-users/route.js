import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // 1. Read cookies (must await the store, then .get)
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const userEmail = cookieStore.get("user_email")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: no token" },
      { status: 401 }
    );
  }

  try {
    // 2. Call your backend API
    const upstream = await fetch(
      "https://01x12geaf5.execute-api.us-east-1.amazonaws.com/prod/get-user-data",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // pass token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      }
    );

    const data = await upstream.json().catch(() => ({}));
    // API Gateway often nests JSON in `body` (string). Normalize it:
    let bodyOut = data;
    if (typeof data?.body === "string") {
      try {
        bodyOut = JSON.parse(data.body);
      } catch {
        bodyOut = data.body;
      }
    } else if (data?.body && typeof data.body === "object") {
      bodyOut = data.body;
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch users" },
        { status: upstream.status }
      );
    }
    // 3. Return users to frontend
    return NextResponse.json(bodyOut, { status: 200 });
  } catch (err) {
    console.error("get-users error:", err);
    return NextResponse.json(
      { message: "Server error while fetching users" },
      { status: 500 }
    );
  }
}
