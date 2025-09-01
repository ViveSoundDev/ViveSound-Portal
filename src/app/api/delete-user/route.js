// app/api/delete-user/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  // 1. Auth from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const currentUserId = cookieStore.get("user_id")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: no token" },
      { status: 401 }
    );
  }

  try {
    // 2. Parse request body
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "Missing required field: userId" },
        { status: 400 }
      );
    }

    // Skip if trying to delete yourself
    if (currentUserId && userId === currentUserId) {
      console.log("Cannot delete your organization account");
      return NextResponse.json(
        { message: "Skipped deleting current user" },
        { status: 200 }
      );
    }

    // 3. Call upstream API
    const upstream = await fetch(
      "https://01x12geaf5.execute-api.us-east-1.amazonaws.com/prod/delete-user",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to delete user" },
        { status: upstream.status }
      );
    }

    // 4. Return upstream response
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("delete-user error:", err);
    return NextResponse.json(
      { message: "Server error while deleting user" },
      { status: 500 }
    );
  }
}
