import SkillsManager, { type AdminSkillRow, type CategoryRow } from "@/components/admin/skills-manager"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"

export default async function SkillsPage() {
  let categories: CategoryRow[] = []
  let skills: AdminSkillRow[] = []
  let fetchError = ""

  try {
    const supabase = await createClient()
    const [categoriesRes, skillsRes] = await Promise.all([
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("skills").select("id, name, category_id").order("name"),
    ])
    if (categoriesRes.error) throw categoriesRes.error
    if (skillsRes.error) throw skillsRes.error
    categories = (categoriesRes.data ?? []) as CategoryRow[]
    skills = (skillsRes.data ?? []) as AdminSkillRow[]
  } catch {
    fetchError = ADMIN_ERRORS.fetch
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Skills</h1>
      {fetchError && <p className="mb-4 text-sm text-destructive">{fetchError}</p>}
      <SkillsManager categories={categories} skills={skills} />
    </div>
  )
}
