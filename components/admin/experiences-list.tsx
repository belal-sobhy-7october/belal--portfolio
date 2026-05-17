"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteExperience } from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminExperience } from "@/components/admin/experience-form"

type ExperiencesListProps = {
  experiences: AdminExperience[]
}

export default function ExperiencesList({ experiences }: ExperiencesListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleDelete(id: string) {
    if (!confirm("Delete this experience?")) return
    setError("")
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteExperience(id)
      setDeletingId(null)
      if (!result.success) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No experiences yet.
              </TableCell>
            </TableRow>
          ) : (
            experiences.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell className="font-medium">{exp.title}</TableCell>
                <TableCell>{exp.company}</TableCell>
                <TableCell>{exp.start_date?.slice(0, 10) ?? "—"}</TableCell>
                <TableCell>{exp.end_date?.slice(0, 10) ?? "Present"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/manage-portal/experiences?edit=${exp.id}`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending && deletingId === exp.id}
                    onClick={() => handleDelete(exp.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
