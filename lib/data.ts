import { createElement } from "react"
import { Code2, Layout, Server, Wrench, Binary } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type {
  ContactInfoRow,
  CvFile,
  ExperienceRow,
  ProfileSettings,
  ProjectRow,
  SkillRow,
} from "@/lib/types"
import type { ProjectItem } from "@/components/projects-client"
import type { TechStackData } from "@/components/tech-stack-client"
import type { Experience } from "@/components/about-client"

const FALLBACK_PROFILE: ProfileSettings = {
  full_name: "",
  title: "",
  bio: "",
  profile_image_url: "/placeholder.svg?height=400&width=400",
}

const CATEGORY_META: Record<string, { description: string; icon: typeof Layout }> = {
  frontend: { description: "Modern web development technologies", icon: Layout },
  backend: { description: "Server-side frameworks and technologies", icon: Server },
  devops: { description: "Tools and environments for deployment", icon: Wrench },
  "ai-ml": { description: "AI and intelligent systems", icon: Binary },
  "frontend development": { description: "Modern web development technologies", icon: Layout },
  "backend development": { description: "Server-side frameworks and technologies", icon: Server },
  "devops & infrastructure": { description: "Tools and environments for deployment", icon: Wrench },
  "ai & intelligent systems": { description: "AI and intelligent systems", icon: Binary },
}

function getCategoryMeta(slugOrName: string) {
  const key = slugOrName.toLowerCase()
  return (
    CATEGORY_META[key] ?? {
      description: "Technical skills and tools",
      icon: Code2,
    }
  )
}

function resolveCategoryName(categories: SkillRow["categories"]): string | null {
  if (!categories) return null
  const cat = Array.isArray(categories) ? categories[0] : categories
  return cat?.name ?? null
}

export async function fetchProfile(): Promise<ProfileSettings> {
  try {
    const { data, error } = await supabase.from("profile_settings").select("*").limit(1).single()
    if (error) throw error
    if (!data) return FALLBACK_PROFILE

    return {
      full_name: data.full_name ?? "",
      title: data.title ?? "",
      bio: data.bio ?? "",
      profile_image_url: data.profile_image_url ?? FALLBACK_PROFILE.profile_image_url,
    }
  } catch {
    return FALLBACK_PROFILE
  }
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const { data, error } = await supabase.from("projects").select("*")
    if (error) throw error

    return ((data ?? []) as ProjectRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      image: row.thumbnail_url ?? "/placeholder.svg?height=400&width=600",
      tags: row.tags ?? [],
      githubLink: row.github_url,
      demoLink: row.live_url,
    }))
  } catch {
    return []
  }
}

export async function fetchTechnologies(): Promise<TechStackData> {
  try {
    const { data, error } = await supabase.from("skills").select("*, categories(name)")
    if (error) throw error

    const grouped: TechStackData = {}
    const flatSkills: { name: string; level: number }[] = []

    for (const skill of (data ?? []) as SkillRow[]) {
      const categoryName = resolveCategoryName(skill.categories)

      if (!categoryName) {
        flatSkills.push({ name: skill.name, level: 85 })
        continue
      }

      const key = categoryName
      const meta = getCategoryMeta(categoryName)

      if (!grouped[key]) {
        grouped[key] = {
          slug: key,
          title: categoryName,
          description: meta.description,
          icon: createElement(meta.icon, { className: "h-6 w-6" }),
          skills: [],
        }
      }

      grouped[key].skills.push({ name: skill.name, level: 85 })
    }

    if (Object.keys(grouped).length === 0 && flatSkills.length > 0) {
      const meta = getCategoryMeta("skills")
      grouped.Skills = {
        slug: "skills",
        title: "Skills",
        description: meta.description,
        icon: createElement(meta.icon, { className: "h-6 w-6" }),
        skills: flatSkills,
      }
    }

    return grouped
  } catch {
    return {}
  }
}

export async function fetchExperiences(): Promise<Experience[]> {
  try {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return (data ?? []) as ExperienceRow[]
  } catch {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false })

      if (error) throw error
      return (data ?? []) as ExperienceRow[]
    } catch {
      return []
    }
  }
}

export async function fetchContacts(): Promise<ContactInfoRow[]> {
  try {
    const { data, error } = await supabase.from("contact_info").select("*")
    if (error) throw error
    return (data ?? []) as ContactInfoRow[]
  } catch {
    return []
  }
}

export async function fetchCvUrl(): Promise<string | null> {
  try {
    const { data, error } = await supabase.from("cv_files").select("file_url").limit(1).single()
    if (error) throw error
    return data?.file_url ?? null
  } catch {
    return null
  }
}

export async function fetchProfileName(): Promise<string> {
  try {
    const { data, error } = await supabase.from("profile_settings").select("full_name").limit(1).single()
    if (error) throw error
    return data?.full_name ?? "Portfolio"
  } catch {
    return "Portfolio"
  }
}
