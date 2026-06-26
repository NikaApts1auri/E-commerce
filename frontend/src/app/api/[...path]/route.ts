import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

const API_BASE_URL = process.env.API_BASE_URL || "https://e-commerce-3i45.onrender.com"
const TOKEN_COOKIE = "token"
const SEVEN_DAYS = 7 * 24 * 60 * 60

/**
 * Catch-all proxy that forwards browser requests to the upstream NestJS API.
 *
 * Why a proxy?
 *  - The upstream API's CORS allowlist only includes localhost, so the browser
 *    cannot call it directly from a deployed/preview origin.
 *  - It lets us keep the auth token in a secure, httpOnly cookie on THIS origin
 *    and attach it as a Bearer token server-side (the token never touches JS).
 */
async function handler(req: NextRequest, segments: string[]) {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value

  const path = segments.join("/")
  const search = req.nextUrl.search
  const targetUrl = `${API_BASE_URL}/${path}${search}`

  const headers: Record<string, string> = {}
  const contentType = req.headers.get("content-type")
  if (contentType) headers["content-type"] = contentType
  if (token) headers["authorization"] = `Bearer ${token}`

  let body: string | undefined
  if (!["GET", "HEAD"].includes(req.method)) {
    body = await req.text()
  }

  let upstream: Response
  try {
    upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    })
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to reach the API. Please try again." },
      { status: 502 },
    )
  }

  const responseText = await upstream.text()
  let data: unknown = responseText
  const upstreamContentType = upstream.headers.get("content-type") || ""
  if (upstreamContentType.includes("application/json")) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = responseText
    }
  }

  const res = NextResponse.json(
    typeof data === "string" ? { message: data } : data,
    { status: upstream.status },
  )

  // Transparently manage the auth cookie based on auth endpoints.
  if (
    upstream.ok &&
    typeof data === "object" &&
    data !== null &&
    "accessToken" in (data as Record<string, unknown>)
  ) {
    const accessToken = (data as { accessToken?: string }).accessToken
    if (accessToken) {
      res.cookies.set(TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SEVEN_DAYS,
      })
    }
  }

  if (path === "auth/logout") {
    res.cookies.delete(TOKEN_COOKIE)
  }

  return res
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return handler(req, path)
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return handler(req, path)
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return handler(req, path)
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return handler(req, path)
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return handler(req, path)
}
