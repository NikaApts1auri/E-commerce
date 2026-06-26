import Link from "next/link"

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { label: "Phones", href: "/products?category=phone" },
      { label: "Laptops", href: "/products?category=laptop" },
      { label: "Audio", href: "/products?category=audio" },
      { label: "All Products", href: "/products" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/products" },
      { label: "Shipping", href: "/products" },
      { label: "Returns", href: "/products" },
      { label: "Warranty", href: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/products" },
      { label: "Careers", href: "/products" },
      { label: "Press", href: "/products" },
      { label: "Contact", href: "/products" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-sm font-bold">V</span>
              </span>
              <span className="text-lg font-semibold tracking-tight">VoltEdge</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Premium consumer electronics, curated for people who care about the details.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {"© "}
            {new Date().getFullYear()} VoltEdge. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Built with Next.js</p>
        </div>
      </div>
    </footer>
  )
}
