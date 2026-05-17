import ProjectForm from "@/components/admin/project-form"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"
import type { ProjectRow } from "@/lib/types"

type EditProjectPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  let project: ProjectRow | null = null
  let fetchError = ""

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()
    if (error) throw error
    project = data as ProjectRow
  } catch {
    fetchError = ADMIN_ERRORS.notFound
  }

  if (!project) {
    return <p className="text-destructive">{fetchError || ADMIN_ERRORS.notFound}</p>
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  )
}
