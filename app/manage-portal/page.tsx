import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"

async function getCount(table: "projects" | "skills" | "experiences") {
  try {
    const supabase = await createClient()
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })
    if (error) throw error
    return count ?? 0
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const [projectsCount, skillsCount, experiencesCount] = await Promise.all([
    getCount("projects"),
    getCount("skills"),
    getCount("experiences"),
  ])

  const metrics = [
    { label: "Projects", count: projectsCount, href: "/manage-portal/projects" },
    { label: "Skills", count: skillsCount, href: "/manage-portal/skills" },
    { label: "Experiences", count: experiencesCount, href: "/manage-portal/experiences" },
  ]

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <Link key={metric.label} href={metric.href}>
            <Card className="transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {metric.count === null ? "—" : metric.count}
                </p>
                {metric.count === null && (
                  <p className="mt-2 text-sm text-destructive">{ADMIN_ERRORS.fetch}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
