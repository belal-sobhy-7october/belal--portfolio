"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { addContact, deleteContact } from "@/lib/admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ContactInfoRow } from "@/lib/types"

type ContactManagerProps = {
  contacts: ContactInfoRow[]
}

export default function ContactManager({ contacts }: ContactManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

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

      <section className="rounded-lg border border-border p-6">
        <h2 className="mb-4 text-xl font-semibold">Add Contact</h2>
        <form
          action={(fd) => runAction(() => addContact(fd))}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="space-y-2 min-w-[200px] flex-1">
            <Label htmlFor="platform">Platform</Label>
            <Input id="platform" name="platform" placeholder="WhatsApp" required />
          </div>
          <div className="space-y-2 min-w-[280px] flex-[2]">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" placeholder="https://wa.me/..." required />
          </div>
          <Button type="submit" disabled={isPending}>
            Add
          </Button>
        </form>
      </section>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No contact entries yet.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.platform_name}</TableCell>
                <TableCell className="max-w-md truncate">
                  <a
                    href={contact.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {contact.value}
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => {
                      if (confirm("Delete this contact?")) {
                        runAction(() => deleteContact(contact.id))
                      }
                    }}
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
