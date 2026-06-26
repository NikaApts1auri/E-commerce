import { cn, formatPrice } from "@/lib/utils"
import type { Product } from "@/types"

export function Price({
  product,
  className,
  size = "md",
}: {
  product: Product
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const onSale = product.discount?.isOnSale && product.discount.oldPrice > product.price
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-foreground", sizes[size])}>
        {formatPrice(product.price)}
      </span>
      {onSale && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            size === "lg" ? "text-base" : "text-xs",
          )}
        >
          {formatPrice(product.discount!.oldPrice)}
        </span>
      )}
    </div>
  )
}
