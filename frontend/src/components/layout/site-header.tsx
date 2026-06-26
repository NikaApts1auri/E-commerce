"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Menu, Search, ShoppingCart, User2, LogOut, Package, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { useCartStore } from "@/store/cart-store"
import { useMounted } from "@/hooks/use-mounted"
import { PRODUCT_CATEGORIES } from "@/types"
import { cn } from "@/lib/utils"

const NAV_CATEGORIES = [
  { label: "Phones", value: "phone" },
  { label: "Laptops", value: "laptop" },
  { label: "Tablets", value: "tab" },
  { label: "Audio", value: "audio" },
  { label: "Watches", value: "smartwatch" },
  { label: "Cameras", value: "camera" },
  { label: "Gaming", value: "gaming" },
]

export function SiteHeader() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const mounted = useMounted()
  const totalItems = useCartStore((s) => s.totalItems())
  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = search.trim()
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products")
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-lg font-semibold tracking-tight">VoltEdge</span>
              </div>
              <form onSubmit={submitSearch} className="mt-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products"
                    className="pl-9"
                  />
                </div>
              </form>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_CATEGORIES.map((c) => (
                  <Link
                    key={c.value}
                    href={`/products?category=${c.value}`}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {c.label}
                  </Link>
                ))}
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  All Products
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-bold">V</span>
            </span>
            <span className="text-lg font-semibold tracking-tight">VoltEdge</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/products?category=${c.value}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Cart">
            <Link href="/cart">
              <ShoppingCart className="size-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
          </Button>

          {mounted && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User2 className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {user?.fullName || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  <User2 className="mr-2 size-4" /> Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account?tab=orders")}>
                  <Package className="mr-2 size-4" /> Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
