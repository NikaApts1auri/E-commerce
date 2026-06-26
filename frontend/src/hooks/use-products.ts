"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { discountsService, productsService, type ProductQuery } from "@/services/api"

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => productsService.list(query),
    placeholderData: keepPreviousData,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(id),
    enabled: Boolean(id),
  })
}

export function useDiscounts(activeOnly = true) {
  return useQuery({
    queryKey: ["discounts", activeOnly],
    queryFn: () => discountsService.list(activeOnly),
  })
}
