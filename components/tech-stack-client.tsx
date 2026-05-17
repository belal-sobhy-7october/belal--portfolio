"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"
import { Code2, Layout, Server, Wrench, Binary } from "lucide-react"

type SkillItem = { name: string; level: number }

export type TechCategory = {
  slug: string
  title: string
  description: string
  icon: ReactNode
  skills: SkillItem[]
}

const CATEGORY_META: Record<string, { description: string; icon: ReactNode }> = {
  frontend: {
    description: "Modern web development technologies",
    icon: <Layout className="h-6 w-6" />,
  },
  backend: {
    description: "Server-side frameworks and technologies",
    icon: <Server className="h-6 w-6" />,
  },
  devops: {
    description: "Tools and environments for deployment",
    icon: <Wrench className="h-6 w-6" />,
  },
  "ai-ml": {
    description: "AI and intelligent systems",
    icon: <Binary className="h-6 w-6" />,
  },
}

const DEFAULT_META = {
  description: "Technical skills and tools",
  icon: <Code2 className="h-6 w-6" />,
}

function getCategoryMeta(slug: string) {
  return CATEGORY_META[slug] ?? DEFAULT_META
}

export type TechStackData = Record<string, TechCategory>

type TechStackClientProps = {
  technologies: TechStackData
}

export default function TechStackClient({ technologies }: TechStackClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  }

  const categoryEntries = Object.entries(technologies)

  return (
    <section id="tech-stack" className="border-b border-border py-20">
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
            Skills
          </Badge>
          <h2 className="section-title">Technical Expertise</h2>
          <div className="mx-auto h-px w-20 bg-border" />
        </motion.div>

        {categoryEntries.length === 0 ? null : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
            {categoryEntries.map(([key, category]) => (
              <motion.div
                key={key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                variants={scaleUp}
              >
                <Card
                  className={`earth-card earth-card-hover h-full cursor-pointer ${
                    selectedCategory === key ? "border-green ring-2 ring-green/20" : ""
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="rounded-full bg-green-light p-3 text-green">{category.icon}</div>
                      <div>
                        <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-brown">{category.title}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedCategory === key && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-wrap gap-2"
                        >
                          {category.skills.map((skill, index) => (
                            <motion.div
                              key={skill.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="inline-flex"
                            >
                              <Badge variant="secondary" className="border-transparent bg-green-light text-green">
                                {skill.name}
                              </Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {selectedCategory !== key && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {category.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="border-transparent bg-green-light text-green">
                            {skill.name}
                          </Badge>
                        ))}
                        {category.skills.length > 3 && (
                          <Badge variant="secondary" className="border-transparent bg-green-light text-green">+{category.skills.length - 3} more</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          variants={fadeIn}
          className="mt-12 text-center text-muted-foreground"
        >
          <p className="max-w-2xl mx-auto">
            With extensive experience in both low-level systems programming and modern web development, I bring a
            comprehensive understanding of software engineering principles to every project.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
