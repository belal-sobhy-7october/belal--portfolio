"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteProject } from "@/lib/admin-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ProjectRow } from "@/lib/types"

type ProjectsTableProps = {
  projects: ProjectRow[]
}

export default function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return
    setError("")
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteProject(id)
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
            <TableHead>Tags</TableHead>
            <TableHead>Live URL</TableHead>
            <TableHead>GitHub</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No projects yet.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <ProjectTags tags={project.tags} />
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {project.live_url ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.live_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {project.github_url}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/manage-portal/projects/${project.id}/edit`}>Edit</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending && deletingId === project.id}
                    onClick={() => handleDelete(project.id)}
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

function ProjectTags({ tags }: { tags: string[] | null }) {
  if (!tags?.length) return <span className="text-muted-foreground">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
