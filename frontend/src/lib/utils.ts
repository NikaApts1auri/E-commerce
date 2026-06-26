import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://d3foeao11pzazf.cloudfront.net"

/**
 * Product images come back from the API in a few shapes:
 *  - a full URL (https://...)
 *  - a protocol-less CloudFront URL (d3foeao11pzazf.cloudfront.net/products/...)
 *  - a relative path (/products/...)
 *  - missing entirely
 * Normalize them all to a usable absolute URL (or null when absent).
 */
export function resolveImageUrl(image?: string | null): string | null {
  if (!image) return null
  const trimmed = image.trim()
  if (!trimmed) return null
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }
  if (trimmed.includes("cloudfront.net")) {
    return `https://${trimmed.replace(/^\/+/, "")}`
  }
  return `${IMAGE_BASE_URL}/${trimmed.replace(/^\/+/, "")}`
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}
