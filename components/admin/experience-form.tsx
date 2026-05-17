"use client"

import { useActionState } from "react"
import Link from "next/link"
import { saveExperience } from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type AdminExperience = {
  id: string
  title: string
  company: string
  start_date: string
  end_date: string | null
  description: string | null
}

type ExperienceFormProps = {
  experience?: AdminExperience
  cancelHref?: string
}

export default function ExperienceForm({
  experience,
  cancelHref = "/manage-portal/experiences",
}: ExperienceFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await saveExperience(formData)
      return result ?? null
    },
    null,
  )
  const isEdit = Boolean(experience?.id)

  return (
    <form action={formAction} className="max-w-2xl space-y-6 rounded-lg border border-border p-6">
      {experience?.id && <input type="hidden" name="experience_id" value={experience.id} />}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={experience?.title ?? ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" defaultValue={experience?.company ?? ""} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={experience?.start_date?.slice(0, 10) ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End date (optional)</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={experience?.end_date?.slice(0, 10) ?? ""}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={experience?.description ?? ""}
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEdit ? "Update Experience" : "Add Experience"}
        </Button>
        <Button variant="outline" asChild>
          <Link href={cancelHref}>Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
