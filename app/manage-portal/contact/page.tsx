import ContactManager from "@/components/admin/contact-manager"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"
import type { ContactInfoRow } from "@/lib/types"

export default async function ContactPage() {
  let contacts: ContactInfoRow[] = []
  let fetchError = ""

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("contact_info").select("*").order("created_at", {
      ascending: true,
    })
    if (error) throw error
    contacts = (data ?? []) as ContactInfoRow[]
  } catch {
    fetchError = ADMIN_ERRORS.fetch
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Contact Info</h1>
      {fetchError && <p className="mb-4 text-sm text-destructive">{fetchError}</p>}
      <ContactManager contacts={contacts} />
    </div>
  )
}
