import { fetchProjects } from "@/lib/data"
import ProjectsClient from "@/components/projects-client"

export default async function Projects() {
  const projects = await fetchProjects()
  return <ProjectsClient projects={projects} />
}
