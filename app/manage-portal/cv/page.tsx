"use client"

import { useEffect, useState } from "react"
import CvUpload from "@/components/admin/cv-upload"
import { Toaster } from "@/components/ui/sonner"
import type { CvFile } from "@/lib/types"

export default function CvPage() {
  const [cv, setCv] = useState<CvFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data: CvFile[]) => {
        if (data.length > 0) {
          setCv(data[0])
        }
      })
      .catch(() => {
        setError("تعذر تحميل البيانات. حاول مرة أخرى.")
      })
      .finally(() => setLoading(false))
  }, [])

  const handleUploaded = (file: CvFile) => {
    setCv(file)
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">CV / Resume</h1>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <CvUpload cv={cv} onUploaded={handleUploaded} />
      )}
      <Toaster />
    </div>
  )
}
