"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

export interface CartLine {
  productId: string
  name: string
  price: number
  image?: string
  stock: number
  quantity: number
}

interface CartState {
  items: CartLine[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  totalItems: () => number
  totalAmount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const id = product._id || product.id || ""
        if (!id) return
        set((state) => {
          const existing = state.items.find((i) => i.productId === id)
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, product.stock)
            return {
              items: state.items.map((i) =>
                i.productId === id ? { ...i, quantity: nextQty } : i,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                productId: id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                quantity: Math.min(quantity, product.stock),
              },
            ],
          }
        })
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: () =>
        Number(get().items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)),
    }),
    { name: "voltedge-cart" },
  ),
)
