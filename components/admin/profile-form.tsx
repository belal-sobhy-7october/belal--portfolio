"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { saveProfile } from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileSettings } from "@/lib/types"

type ProfileFormProps = {
  profile: ProfileSettings & { id?: string }
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      return (await saveProfile(formData)) ?? null
    },
    null,
  )

  useEffect(() => {
    if (state?.success) {
      toast.success("تم حفظ الملف الشخصي بنجاح")
    }
  }, [state?.success])

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {profile.id && <input type="hidden" name="id" value={profile.id} />}
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={profile.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={6} defaultValue={profile.bio} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}
