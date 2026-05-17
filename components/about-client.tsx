"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Lightbulb, Rocket } from "lucide-react"
export type Experience = {
  id: string
  title: string
  company: string
  duration: string
  description: string | null
}

type AboutClientProps = {
  experiences: Experience[]
}

export default function AboutClient({ experiences }: AboutClientProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="about" className="border-b border-border bg-card/40 py-20">
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
            About Me
          </Badge>
          <h2 className="section-title">Who I Am</h2>
          <div className="mx-auto h-px w-20 bg-border" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            variants={fadeIn}
          >
            <h3 className="mb-4 font-serif text-2xl font-semibold text-foreground">A Passionate Developer</h3>
            <p className="text-muted-foreground mb-6">
              I&apos;m a software developer with a passion for creating clean, efficient, and user-friendly
              applications. With experience across full-stack and systems work, I focus on building reliable products.
            </p>
            <p className="text-muted-foreground mb-6">
              My journey in software development began in college, where I discovered my love for solving complex
              problems through code. Since then, I&apos;ve been continuously learning and improving my skills.
            </p>
            <p className="text-muted-foreground">
              When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects,
              or sharing knowledge with the community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              variants={fadeIn}
            >
              <Card className="earth-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-light p-3">
                      <Code className="h-6 w-6 text-green" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-serif text-xl font-semibold text-foreground">Clean Code</h4>
                      <p className="text-muted-foreground">
                        I write maintainable, scalable, and efficient code following best practices and industry
                        standards.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              variants={fadeIn}
            >
              <Card className="earth-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-light p-3">
                      <Lightbulb className="h-6 w-6 text-green" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-serif text-xl font-semibold text-foreground">Problem Solver</h4>
                      <p className="text-muted-foreground">
                        I enjoy tackling complex challenges and finding elegant solutions through creative thinking.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              variants={fadeIn}
            >
              <Card className="earth-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-light p-3">
                      <Rocket className="h-6 w-6 text-green" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-serif text-xl font-semibold text-foreground">Fast Learner</h4>
                      <p className="text-muted-foreground">
                        I quickly adapt to new technologies and environments, constantly expanding my skill set.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          variants={fadeIn}
          className="mt-16"
        >
          <h3 className="mb-8 text-center font-serif text-2xl font-semibold text-foreground">Experience</h3>

          {experiences.length === 0 ? null : (
            <div className="mx-auto max-w-2xl space-y-0">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                  variants={fadeIn}
                  className="relative border-b border-border py-6 last:border-b-0"
                >
                  <div className="absolute left-0 top-8 h-1 w-1 rounded-full bg-brown-light" />
                  <h4 className="pl-5 text-[0.95rem] font-semibold text-foreground">{exp.title}</h4>
                  <p className="pl-5 text-sm font-medium text-green">
                    {exp.company} · {exp.duration}
                  </p>
                  {exp.description && (
                    <p className="mt-2 pl-5 text-[0.82rem] text-muted-foreground">{exp.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
