import Link from "next/link"
import ProjectsTable from "@/components/admin/projects-table"
import { Button } from "@/components/ui/button"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"
import type { ProjectRow } from "@/lib/types"

export default async function ProjectsPage() {
  let projects: ProjectRow[] = []
  let fetchError = ""

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("projects").select("*").order("created_at", {
      ascending: false,
    })
    if (error) throw error
    projects = (data ?? []) as ProjectRow[]
  } catch {
    fetchError = ADMIN_ERRORS.fetch
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/manage-portal/projects/new">Add Project</Link>
        </Button>
      </div>
      {fetchError && <p className="mb-4 text-sm text-destructive">{fetchError}</p>}
      <ProjectsTable projects={projects} />
    </div>
  )
}
