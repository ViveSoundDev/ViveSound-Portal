import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // 1. Read the token from cookies
  const token = cookies().get("auth_token")?.value;
  const userEmail = cookies().get("user_email")?.value;

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

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch users" },
        { status: upstream.status }
      );
    }
    console.log("GET USERS: ", data);
    // 3. Return users to frontend
    return NextResponse.json(data.body, { status: 200 });
  } catch (err) {
    console.error("get-users error:", err);
    return NextResponse.json(
      { message: "Server error while fetching users" },
      { status: 500 }
    );
  }
}
