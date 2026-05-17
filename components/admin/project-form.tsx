"use client"

import { useActionState } from "react"
import Link from "next/link"
import { saveProject } from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectRow } from "@/lib/types"

type ProjectFormProps = {
  project?: ProjectRow
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await saveProject(formData)
      return result ?? null
    },
    null,
  )
  const isEdit = Boolean(project?.id)

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {project?.id && <input type="hidden" name="project_id" value={project.id} />}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={project?.title ?? ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={project?.description ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" defaultValue={project?.tags?.join(", ") ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input id="github_url" name="github_url" defaultValue={project?.github_url ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="live_url">Live URL</Label>
        <Input id="live_url" name="live_url" defaultValue={project?.live_url ?? ""} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEdit ? "Update Project" : "Add Project"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/manage-portal/projects">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
