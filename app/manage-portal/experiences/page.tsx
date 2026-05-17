import ExperienceForm, { type AdminExperience } from "@/components/admin/experience-form"
import ExperiencesList from "@/components/admin/experiences-list"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"

type ExperiencesPageProps = {
  searchParams: Promise<{ edit?: string; new?: string }>
}

export default async function ExperiencesPage({ searchParams }: ExperiencesPageProps) {
  const { edit: editId, new: isNew } = await searchParams
  let experiences: AdminExperience[] = []
  let editing: AdminExperience | null = null
  let fetchError = ""

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("experiences")
      .select("id, title, company, start_date, end_date, description")
      .order("start_date", { ascending: false })

    if (error) throw error
    experiences = (data ?? []) as AdminExperience[]

    if (editId) {
      editing = experiences.find((e) => e.id === editId) ?? null
    }
  } catch {
    fetchError = ADMIN_ERRORS.fetch
  }

  const showAddForm = isNew === "1" && !editId
  const showEditForm = Boolean(editId && editing)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Experiences</h1>
        {!showAddForm && !showEditForm && (
          <a
            href="/manage-portal/experiences?new=1"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add Experience
          </a>
        )}
      </div>

      {fetchError && <p className="text-sm text-destructive">{fetchError}</p>}

      {showAddForm && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Add Experience</h2>
          <ExperienceForm cancelHref="/manage-portal/experiences" />
        </div>
      )}

      {editId && !editing && !fetchError && (
        <p className="text-destructive">{ADMIN_ERRORS.notFound}</p>
      )}

      {showEditForm && editing && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Edit Experience</h2>
          <ExperienceForm experience={editing} cancelHref="/manage-portal/experiences" />
        </div>
      )}

      <ExperiencesList experiences={experiences} />
    </div>
  )
}
