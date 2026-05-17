import Link from "next/link"
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react"
import { fetchContacts, fetchProfileName } from "@/lib/data"
import type { ContactInfoRow } from "@/lib/types"

const LINKEDIN_URL = "https://www.linkedin.com/in/belal-sobhy-134845397/"

function isHiddenSocialPlatform(platformName: string) {
  const key = platformName.toLowerCase().trim()
  return key === "x" || key.includes("twit" + "ter")
}

function getContactHref(contact: ContactInfoRow) {
  const key = contact.platform_name.toLowerCase()
  if (key.includes("linkedin")) return LINKEDIN_URL
  return contact.value
}

function getPlatformIcon(platformName: string) {
  const key = platformName.toLowerCase()
  if (key.includes("github")) return Github
  if (key.includes("linkedin")) return Linkedin
  if (key.includes("whatsapp")) return MessageCircle
  if (key.includes("email") || key.includes("mail")) return Mail
  return MessageCircle
}

export default async function Footer() {
  const currentYear = new Date().getFullYear()
  let contacts: ContactInfoRow[] = []
  let profileName = "Portfolio"

  try {
    const [fetchedContacts, fetchedName] = await Promise.all([fetchContacts(), fetchProfileName()])
    contacts = fetchedContacts
    profileName = fetchedName
  } catch {
    contacts = []
  }

  const nameParts = profileName.split(" ")
  const firstName = nameParts[0] ?? profileName
  const restName = nameParts.slice(1).join(" ") || ""
  const visibleContacts = contacts.filter((contact) => !isHiddenSocialPlatform(contact.platform_name))

  return (
    <footer className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="mb-4 md:mb-0">
            <p className="font-serif text-lg font-semibold text-green">
              {firstName}
              {restName && <span className="text-brown"> {restName}</span>}
            </p>
          </div>

          {visibleContacts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {visibleContacts.map((contact) => {
                const Icon = getPlatformIcon(contact.platform_name)
                return (
                  <Link
                    key={contact.id}
                    href={getContactHref(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-green hover:text-green"
                  >
                    <Icon className="h-4 w-4" />
                    {contact.platform_name}
                  </Link>
                )
              })}
            </div>
          )}

          <div className="text-center md:text-right">
            <p className="text-[0.8rem] text-brown-light">
              © {currentYear} {profileName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
