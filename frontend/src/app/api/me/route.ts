import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

const API_BASE_URL = process.env.API_BASE_URL || "https://e-commerce-3i45.onrender.com"

function decodeJwt(token: string): { id?: string; role?: string; email?: string } | null {
  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    const decoded = Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "utf-8",
    )
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Returns the currently authenticated user (or null).
 * The JWT lives in an httpOnly cookie, so the client cannot read it directly —
 * this server route decodes it and enriches it with profile data.
 */
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) {
    return NextResponse.json({ user: null })
  }

  const claims = decodeJwt(token)
  if (!claims?.id) {
    return NextResponse.json({ user: null })
  }

  let profile: Record<string, unknown> = {}
  try {
    const res = await fetch(`${API_BASE_URL}/users/${claims.id}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (res.ok) {
      profile = await res.json()
    }
  } catch {
    // Non-fatal: fall back to claims only.
  }

  return NextResponse.json({
    user: {
      id: claims.id,
      role: claims.role ?? profile.role ?? "user",
      email: profile.email ?? claims.email ?? "",
      fullName: profile.fullName ?? "",
    },
  })
}
