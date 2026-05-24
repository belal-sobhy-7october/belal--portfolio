"use client"

import { useState, useActionState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-browser"
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
      const thumbnailFile = formData.get("thumbnail") as File | null

      if (thumbnailFile && thumbnailFile.size > 0) {
        if (!thumbnailFile.type.startsWith("image/")) {
          return { error: "File must be an image." }
        }
        if (thumbnailFile.size > 2 * 1024 * 1024) {
          return { error: "Image must be less than 2MB." }
        }

        const supabase = createClient()
        const fileExt = thumbnailFile.name.split(".").pop() ?? "png"
        const fileName = `${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, thumbnailFile, {
            contentType: thumbnailFile.type,
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          return { error: "Failed to upload image." }
        }

        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName)

        formData.delete("thumbnail")
        formData.set("thumbnail_url", urlData.publicUrl)
      }

      const result = await saveProject(formData)
      return result ?? null
    },
    null,
  )
  const isEdit = Boolean(project?.id)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setFileError(null)

    if (!file) {
      setPreview(null)
      return
    }

    if (!file.type.startsWith("image/")) {
      setFileError("File must be an image.")
      setPreview(null)
      e.target.value = ""
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image must be less than 2MB.")
      setPreview(null)
      e.target.value = ""
      return
    }

    setPreview(URL.createObjectURL(file))
  }

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
        <Label htmlFor="thumbnail">Thumbnail</Label>
        <Input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {fileError && <p className="text-sm text-destructive">{fileError}</p>}
        {(preview || project?.thumbnail_url) && (
          <div className="relative mt-2 h-40 w-60 overflow-hidden rounded-md border">
            <Image
              src={preview ?? project!.thumbnail_url!}
              alt="Thumbnail preview"
              fill
              className="object-cover"
            />
          </div>
        )}
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
