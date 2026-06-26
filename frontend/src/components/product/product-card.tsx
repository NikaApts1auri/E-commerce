"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Price } from "@/components/product/price"
import { useCartStore } from "@/store/cart-store"
import { resolveImageUrl } from "@/lib/utils"
import type { Product } from "@/types"
import { toast } from "sonner"

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const image = resolveImageUrl(product.image)
  const onSale = product.discount?.isOnSale && product.discount.oldPrice > product.price
  const outOfStock = product.stock <= 0
  const id = product._id || product.id || ""

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (outOfStock) return
    addItem(product, 1)
    toast.success("Added to cart", { description: product.name })
  }

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-sm">No image</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && (
            <Badge className="bg-primary text-primary-foreground hover:bg-primary">
              -{product.discount!.percentage}%
            </Badge>
          )}
          {outOfStock && <Badge variant="secondary">Sold out</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.category}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Price product={product} />
          <Button
            size="icon"
            variant="outline"
            className="size-9 shrink-0"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
