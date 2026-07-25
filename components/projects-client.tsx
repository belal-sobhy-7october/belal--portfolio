"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, Github, ChevronDown } from "lucide-react"
export type ProjectItem = {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  githubLink: string | null
  demoLink: string | null
}

type ProjectsClientProps = {
  projects: ProjectItem[]
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="projects" className="border-b border-border bg-card/40 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="section-label">
            Portfolio
          </Badge>
          <h2 className="section-title">Featured Projects</h2>
          <div className="mx-auto h-px w-20 bg-border" />
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects yet</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                variants={fadeIn}
              >
                <Card
                  className={`earth-card earth-card-hover group h-full cursor-pointer overflow-hidden ${
                    expandedProject === project.id ? "border-green ring-2 ring-green/20" : ""
                  }`}
                  onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative bg-muted">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      {project.tags.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute top-3 left-3 border border-border/60 bg-background/80 text-xs backdrop-blur-sm"
                        >
                          {project.tags[0]}
                        </Badge>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">{project.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    </div>

                    <AnimatePresence>
                      {expandedProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-border p-6"
                        >
                          <div className="space-y-4">
                            {project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="border border-border bg-background text-muted-foreground">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {project.description && (
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            )}

                            <div className="flex gap-4 pt-2 flex-wrap">
                              {project.githubLink && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-border bg-transparent text-foreground hover:border-brown hover:bg-transparent hover:text-brown"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(project.githubLink!, "_blank")
                                  }}
                                >
                                  <Github className="h-4 w-4 mr-2" />
                                  Code
                                </Button>
                              )}
                              {project.demoLink && (
                                <Button
                                  size="sm"
                                  className="group/link bg-green text-white hover:bg-[#3d6a4a]"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(project.demoLink!, "_blank")
                                  }}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover/link:translate-x-[3px] group-hover/link:-translate-y-[3px]" />
                                  Demo
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border bg-transparent text-foreground hover:border-brown hover:bg-transparent hover:text-brown"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedProject(project)
                                }}
                              >
                                Learn More
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4 text-center text-muted-foreground">
                      <ChevronDown
                        className={`mx-auto h-6 w-6 transition-all duration-300 group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-green ${
                          expandedProject === project.id ? "rotate-180 text-green" : ""
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-3xl border-border bg-card text-foreground">
            <div className="rounded-lg overflow-hidden bg-muted -mx-6 -mt-6 mb-6">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full max-h-96 object-contain"
              />
            </div>
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
              <DialogDescription asChild>
                <div>
                  {selectedProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                      {selectedProject.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="border border-border bg-background text-muted-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedProject.description}</p>
              <div className="flex justify-end gap-4 mt-4">
                {selectedProject.githubLink && (
                  <Button variant="outline" className="border-border bg-transparent text-foreground hover:border-brown hover:bg-transparent hover:text-brown" asChild>
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
                {selectedProject.demoLink && (
                  <Button className="bg-green text-white hover:bg-[#3d6a4a]" asChild>
                    <a href={selectedProject.demoLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
