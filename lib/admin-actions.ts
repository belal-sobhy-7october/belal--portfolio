"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ADMIN_ERRORS } from "@/lib/admin-messages"
import { createClient } from "@/lib/supabase-server"

function formatDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
  const end = endDate
    ? new Date(endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Present"
  return `${start} - ${end}`
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

export async function deleteProject(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/manage-portal/projects")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.delete }
  }
}

export async function saveProject(formData: FormData) {
  try {
    const supabase = await createClient()
    const id = String(formData.get("project_id") ?? "").trim() || undefined

    const payload: Record<string, unknown> = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      tags: parseTags(String(formData.get("tags") ?? "")),
      github_url: String(formData.get("github_url") ?? "") || null,
      live_url: String(formData.get("live_url") ?? "") || null,
    }

    const thumbnailUrl = formData.get("thumbnail_url")
    if (thumbnailUrl) {
      payload.thumbnail_url = String(thumbnailUrl)
    } else if (!id) {
      payload.thumbnail_url = null
    }

    if (id) {
      const { error } = await supabase.from("projects").update(payload).eq("id", id)
      if (error) throw error
    } else {
      const { error } = await supabase.from("projects").insert(payload)
      if (error) throw error
    }

    revalidatePath("/manage-portal/projects")
    redirect("/manage-portal/projects")
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err) throw err
    return { success: false as const, error: ADMIN_ERRORS.save }
  }
}

export async function addSkill(formData: FormData) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("skills").insert({
      name: String(formData.get("name") ?? ""),
      category_id: String(formData.get("category_id") ?? ""),
    })
    if (error) throw error
    revalidatePath("/manage-portal/skills")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.save }
  }
}

export async function deleteSkill(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("skills").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/manage-portal/skills")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.delete }
  }
}

export async function addCategory(formData: FormData) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("categories").insert({
      name: String(formData.get("name") ?? ""),
    })
    if (error) throw error
    revalidatePath("/manage-portal/skills")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.save }
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await createClient()
    const { count, error: countError } = await supabase
      .from("skills")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id)

    if (countError) throw countError
    if (count && count > 0) {
      return { success: false as const, error: ADMIN_ERRORS.categoryInUse }
    }

    const { error } = await supabase.from("categories").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/manage-portal/skills")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.delete }
  }
}

export async function deleteExperience(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("experiences").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/manage-portal/experiences")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.delete }
  }
}

export async function saveExperience(formData: FormData) {
  try {
    const supabase = await createClient()
    const id = String(formData.get("experience_id") ?? "").trim() || undefined
    const startDate = String(formData.get("start_date") ?? "")
    const endDateRaw = String(formData.get("end_date") ?? "")
    const endDate = endDateRaw.trim() ? endDateRaw : null

    const payload = {
      title: String(formData.get("title") ?? ""),
      company: String(formData.get("company") ?? ""),
      start_date: startDate,
      end_date: endDate,
      description: String(formData.get("description") ?? "") || null,
      duration: formatDuration(startDate, endDate),
    }

    if (id) {
      const { error } = await supabase.from("experiences").update(payload).eq("id", id)
      if (error) throw error
    } else {
      const { error } = await supabase.from("experiences").insert(payload)
      if (error) throw error
    }

    revalidatePath("/manage-portal/experiences")
    redirect("/manage-portal/experiences")
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err) throw err
    return { success: false as const, error: ADMIN_ERRORS.save }
  }
}

export async function saveProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    const id = String(formData.get("id") ?? "")
    const payload = {
      full_name: String(formData.get("full_name") ?? ""),
      title: String(formData.get("title") ?? ""),
      bio: String(formData.get("bio") ?? ""),
    }

    if (id) {
      const { error } = await supabase.from("profile_settings").update(payload).eq("id", id)
      if (error) throw error
    } else {
      const { error } = await supabase.from("profile_settings").insert(payload)
      if (error) throw error
    }

    revalidatePath("/manage-portal/profile")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.save }
  }
}

export async function addContact(formData: FormData) {
  try {
    const supabase = await createClient()
    const platform = String(formData.get("platform") ?? "")
    const { error } = await supabase.from("contact_info").insert({
      platform_name: platform,
      value: String(formData.get("url") ?? ""),
      icon_class: platform.toLowerCase().replace(/\s+/g, "-"),
    })
    if (error) throw error
    revalidatePath("/manage-portal/contact")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.save }
  }
}

export async function deleteContact(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("contact_info").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/manage-portal/contact")
    return { success: true as const }
  } catch {
    return { success: false as const, error: ADMIN_ERRORS.delete }
  }
}
