/**
 * Type definitions derived from the NestJS API (Swagger schema + live responses).
 */

export const PRODUCT_CATEGORIES = [
  "phone",
  "tab",
  "laptop",
  "accessory",
  "audio",
  "smartwatch",
  "camera",
  "gaming",
  "other",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export interface ProductDiscount {
  isOnSale: boolean
  percentage: number
  oldPrice: number
}

export interface Product {
  _id: string
  id?: string
  name: string
  productCode?: string
  price: number
  stock: number
  description?: string
  image?: string
  category?: ProductCategory | string
  discount?: ProductDiscount
  createdAt?: string
  updatedAt?: string
}

export interface PaginationMeta {
  total: number
  page: number
  lastPage: number
}

export interface ProductsResponse {
  products: Product[]
  meta: PaginationMeta
}

export interface CartItem {
  productId: Product | string
  quantity: number
  price: number
  _id?: string
}

export interface Cart {
  _id: string
  userId: string
  guestId?: string
  items: CartItem[]
  totalAmount: number
  createdAt?: string
  updatedAt?: string
}

export interface User {
  _id?: string
  id?: string
  email: string
  fullName?: string
  role?: "user" | "admin"
}

export interface Discount {
  _id: string
  name: string
  percentage: number
  applicableProducts: Product[]
  startDate: string
  endDate: string
  isActive: boolean
}

export interface OrderItem {
  productId: string
  quantity: number
}

export interface CreateOrderPayload {
  totalAmount: number
  items: OrderItem[]
  userId: string
}

export interface Order {
  _id: string
  totalAmount: number
  items: Array<{ productId: Product | string; quantity: number }>
  userId: string
  status?: "pending" | "paid" | "failed" | string
  createdAt?: string
}

/* ---------- Auth payloads ---------- */

export interface SignInPayload {
  email: string
  password: string
}

export interface SignUpPayload {
  email: string
  password: string
  fullName: string
  role?: "user"
}

export interface SignInResponse {
  success: boolean
  message: string
  accessToken: string
}

export interface ApiMessageResponse {
  success: boolean
  message: string
}
