import { fetchTechnologies } from "@/lib/data"
import TechStackClient from "@/components/tech-stack-client"

export default async function TechStack() {
  const technologies = await fetchTechnologies()
  return <TechStackClient technologies={technologies} />
}
