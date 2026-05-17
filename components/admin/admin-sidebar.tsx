"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/manage-portal", label: "Dashboard", icon: "🏠" },
  { href: "/manage-portal/projects", label: "Projects", icon: "📁" },
  { href: "/manage-portal/skills", label: "Skills", icon: "🛠" },
  { href: "/manage-portal/experiences", label: "Experiences", icon: "💼" },
  { href: "/manage-portal/profile", label: "Profile", icon: "👤" },
  { href: "/manage-portal/contact", label: "Contact Info", icon: "📞" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // still redirect on failure
    }
    router.push("/manage-portal/login")
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <p className="text-lg font-bold text-primary">Admin Portal</p>
        <p className="text-xs text-muted-foreground">Belal Portfolio</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active =
            item.href === "/manage-portal"
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  )
}
