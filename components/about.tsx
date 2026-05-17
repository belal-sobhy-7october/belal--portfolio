import { fetchExperiences } from "@/lib/data"
import AboutClient from "@/components/about-client"

export default async function About() {
  const experiences = await fetchExperiences()
  return <AboutClient experiences={experiences} />
}
