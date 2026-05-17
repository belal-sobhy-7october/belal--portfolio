import { headers } from "next/headers"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { createClient } from "@/lib/supabase-server"

export default async function ManagePortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""
  const isLoginPage = pathname === "/manage-portal/login"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isLoginPage) {
    redirect("/manage-portal/login")
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">{children}</main>
    </div>
  )
}
