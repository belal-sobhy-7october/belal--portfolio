import ProfileForm from "@/components/admin/profile-form"
import { Toaster } from "@/components/ui/sonner"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"
import type { ProfileSettings } from "@/lib/types"

export default async function ProfilePage() {
  let profile: ProfileSettings & { id?: string } = {
    full_name: "",
    title: "",
    bio: "",
    profile_image_url: "",
  }
  let fetchError = ""

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("profile_settings").select("*").limit(1).single()
    if (error && error.code !== "PGRST116") throw error
    if (data) {
      profile = {
        id: data.id,
        full_name: data.full_name ?? "",
        title: data.title ?? "",
        bio: data.bio ?? "",
        profile_image_url: data.profile_image_url ?? "",
      }
    }
  } catch {
    fetchError = ADMIN_ERRORS.fetch
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Profile</h1>
      {fetchError && <p className="mb-4 text-sm text-destructive">{fetchError}</p>}
      <ProfileForm profile={profile} />
      <Toaster />
    </div>
  )
}
