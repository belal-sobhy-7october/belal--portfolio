"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { CvFile } from "@/lib/types"

interface Props {
  cv: CvFile | null
  onUploaded: (file: CvFile) => void
}

export default function CvUpload({ cv, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Upload failed.")
        return
      }

      toast.success("CV uploaded successfully!")
      onUploaded(data)
      form.reset()
    } catch {
      toast.error("تعذر حفظ البيانات. حاول مرة أخرى.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {cv && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-1 text-sm text-muted-foreground">Current CV:</p>
          <a
            href={cv.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-green hover:underline"
          >
            {cv.file_name ?? "Download CV"}
          </a>
          <p className="mt-1 text-xs text-muted-foreground">
            Uploaded: {new Date(cv.uploaded_at).toLocaleString()}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file" className="mb-1 block text-sm font-medium">
            Upload PDF file
          </label>
          <Input
            id="file"
            name="file"
            type="file"
            accept=".pdf,application/pdf"
            required
          />
        </div>
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload CV"}
        </Button>
      </form>
    </div>
  )
}
