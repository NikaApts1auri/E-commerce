import axios, { type AxiosError } from "axios"

/**
 * Axios instance pointed at our same-origin Next.js proxy (`/api`), which
 * forwards to the upstream NestJS API. This avoids CORS and keeps the auth
 * token in a secure httpOnly cookie that the proxy attaches server-side.
 */
export const http = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
})

export interface ApiError {
  message: string
  statusCode?: number
}

export function extractApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<{ message?: string | string[]; statusCode?: number }>
  const data = axiosError?.response?.data
  let message = "Something went wrong. Please try again."
  if (data?.message) {
    message = Array.isArray(data.message) ? data.message[0] : data.message
  } else if (axiosError?.message) {
    message = axiosError.message
  }
  return { message, statusCode: axiosError?.response?.status }
}
