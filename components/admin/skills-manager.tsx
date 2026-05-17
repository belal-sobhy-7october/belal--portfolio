"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  addCategory,
  addSkill,
  deleteCategory,
  deleteSkill,
} from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CategoryRow = { id: string; name: string }
export type AdminSkillRow = { id: string; name: string; category_id: string | null }

type SkillsManagerProps = {
  categories: CategoryRow[]
  skills: AdminSkillRow[]
}

export default function SkillsManager({ categories, skills }: SkillsManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "")

  const grouped = categories.map((cat) => ({
    ...cat,
    skills: skills.filter((s) => s.category_id === cat.id),
  }))
  const uncategorized = skills.filter((s) => !s.category_id)

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    setError("")
    startTransition(async () => {
      const result = await action()
      if (!result.success) {
        setError(result.error ?? "حدث خطأ. حاول مرة أخرى.")
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="rounded-lg border border-border p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Category</h2>
        <form
          action={(fd) => runAction(() => addCategory(fd))}
          className="flex flex-wrap gap-3 items-end"
        >
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label htmlFor="category_name">Category name</Label>
            <Input id="category_name" name="name" required />
          </div>
          <Button type="submit" disabled={isPending}>
            Add Category
          </Button>
        </form>
      </section>

      <section className="rounded-lg border border-border p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Skill</h2>
        <form
          action={(fd) => {
            fd.set("category_id", categoryId)
            runAction(() => addSkill(fd))
          }}
          className="flex flex-wrap gap-3 items-end"
        >
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label htmlFor="skill_name">Skill name</Label>
            <Input id="skill_name" name="name" required />
          </div>
          <div className="space-y-2 min-w-[200px]">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending || !categoryId}>
            Add Skill
          </Button>
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Skills by Category</h2>
        {grouped.map((group) => (
          <div key={group.id} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium text-primary">{group.name}</h3>
              <Button
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={() => runAction(() => deleteCategory(group.id))}
              >
                Delete Category
              </Button>
            </div>
            {group.skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills in this category.</p>
            ) : (
              <ul className="space-y-2">
                {group.skills.map((skill) => (
                  <li key={skill.id} className="flex items-center justify-between">
                    <span>{skill.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => runAction(() => deleteSkill(skill.id))}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {uncategorized.length > 0 && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-3 font-medium">Uncategorized</h3>
            <ul className="space-y-2">
              {uncategorized.map((skill) => (
                <li key={skill.id} className="flex items-center justify-between">
                  <span>{skill.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => runAction(() => deleteSkill(skill.id))}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
