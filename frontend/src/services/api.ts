import { http } from "@/lib/axios"
import type {
  ApiMessageResponse,
  Cart,
  CreateOrderPayload,
  Discount,
  Order,
  Product,
  ProductsResponse,
  SignInPayload,
  SignInResponse,
  SignUpPayload,
  User,
} from "@/types"

/**
 * Service layer mapping every API endpoint from the Swagger schema.
 * All requests go through the `/api` proxy (see lib/axios.ts).
 */

/* ----------------------------- Products ----------------------------- */

export interface ProductQuery {
  search?: string
  page?: number
  limit?: number
}

export const productsService = {
  list: async (query: ProductQuery = {}): Promise<ProductsResponse> => {
    const { data } = await http.get<ProductsResponse>("/products", { params: query })
    return data
  },
  getById: async (id: string): Promise<Product> => {
    const { data } = await http.get<Product>(`/products/${id}`)
    return data
  },
}

/* ----------------------------- Discounts ----------------------------- */

export const discountsService = {
  list: async (activeOnly = true): Promise<Discount[]> => {
    const { data } = await http.get<Discount[]>("/discount", {
      params: { active: activeOnly },
    })
    return data
  },
}

/* ------------------------------- Auth -------------------------------- */

export const authService = {
  signIn: async (payload: SignInPayload): Promise<SignInResponse> => {
    const { data } = await http.post<SignInResponse>("/auth/sign-in", payload)
    return data
  },
  signUp: async (payload: SignUpPayload): Promise<ApiMessageResponse> => {
    const { data } = await http.post<ApiMessageResponse>("/auth/sign-up", payload)
    return data
  },
  forgotPassword: async (email: string): Promise<ApiMessageResponse> => {
    const { data } = await http.post<ApiMessageResponse>("/auth/forgot-password", { email })
    return data
  },
  resetPassword: async (token: string, newPassword: string): Promise<ApiMessageResponse> => {
    const { data } = await http.post<ApiMessageResponse>("/auth/reset-password", {
      token,
      newPassword,
    })
    return data
  },
  logout: async (): Promise<ApiMessageResponse> => {
    const { data } = await http.post<ApiMessageResponse>("/auth/logout", {})
    return data
  },
  me: async (): Promise<{ user: User | null }> => {
    const { data } = await http.get<{ user: User | null }>("/me")
    return data
  },
}

/* ------------------------------- Cart -------------------------------- */

export const cartService = {
  get: async (): Promise<Cart> => {
    const { data } = await http.get<Cart>("/cart")
    return data
  },
  addItem: async (productId: string, quantity: number): Promise<ApiMessageResponse> => {
    const { data } = await http.post<ApiMessageResponse>("/cart", { productId, quantity })
    return data
  },
  updateItem: async (productId: string, quantity: number): Promise<Cart> => {
    const { data } = await http.patch<Cart>("/cart", { productId, quantity })
    return data
  },
  removeItem: async (productId: string): Promise<Cart> => {
    const { data } = await http.delete<Cart>(`/cart/${productId}`)
    return data
  },
  clear: async (): Promise<Cart> => {
    const { data } = await http.delete<Cart>("/cart/clear")
    return data
  },
}

/* ------------------------------- Orders ------------------------------ */

export const ordersService = {
  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await http.post<Order>("/order", payload)
    return data
  },
  getById: async (id: string): Promise<Order> => {
    const { data } = await http.get<Order>(`/order/${id}`)
    return data
  },
}

/* ------------------------------- Users ------------------------------- */

export const usersService = {
  getById: async (id: string): Promise<User> => {
    const { data } = await http.get<User>(`/users/${id}`)
    return data
  },
  update: async (id: string, payload: Partial<User>): Promise<User> => {
    const { data } = await http.patch<User>(`/users/${id}`, payload)
    return data
  },
}
