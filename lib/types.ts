export interface ProfileSettings {
  id?: string
  full_name: string
  title: string
  bio: string
  profile_image_url: string
  created_at?: string
  updated_at?: string
}

export interface ProjectRow {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  tags: string[] | null
  github_url: string | null
  live_url: string | null
  created_at?: string
  updated_at?: string
}

export interface CategoryRef {
  name: string
}

export interface SkillRow {
  id: string
  name: string
  category_id?: string
  categories: CategoryRef | CategoryRef[] | null
}

export interface ExperienceRow {
  id: string
  title: string
  company: string
  duration: string
  description: string | null
  created_at?: string
}

export interface ContactInfoRow {
  id: string
  platform_name: string
  value: string
  icon_class: string
  created_at?: string
}

export interface GroupedTechCategory {
  name: string
  skills: { name: string; level: number }[]
}
