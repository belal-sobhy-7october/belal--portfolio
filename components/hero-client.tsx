"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import type { ProfileSettings } from "@/lib/types"

type HeroClientProps = {
  profile: ProfileSettings
}

export default function HeroClient({ profile }: HeroClientProps) {
  const [text, setText] = useState("")

  useEffect(() => {
    const fullText = profile.title || ""
    let i = 0
    setText("")

    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [profile.title])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  const displayName = profile.full_name || "Developer"
  const bio = profile.bio || ""
  const imageUrl = profile.profile_image_url || "/placeholder.svg?height=400&width=400"

  return (
    <section id="home" className="relative border-b border-border pt-32 pb-20 md:pt-40 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <p className="mb-3 text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-green">Hello, I&apos;m</p>
            <h1 className="mb-4 font-serif text-[clamp(2.2rem,4.5vw,3.4rem)] font-semibold leading-tight text-foreground">
              <span>{displayName}</span>
            </h1>
            <h2 className="mb-6 font-serif text-2xl font-semibold text-green md:text-3xl">
              <span>{text}</span>
              <span className="animate-blink">|</span>
            </h2>
            <p className="mb-8 max-w-[540px] text-lg text-muted-foreground">{bio}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group bg-green text-white hover:bg-[#3d6a4a]" onClick={() => scrollToSection("projects")}>
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-border bg-transparent text-foreground hover:border-brown hover:bg-transparent hover:text-brown" onClick={() => scrollToSection("contact")}>
                Contact Me
              </Button>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-green-light hover:text-green" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:bg-green-light hover:text-green" asChild>
                <a href="https://www.linkedin.com/in/belal-sobhy-134845397/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-full border border-brown-light bg-green-light"></div>
            <div className="absolute inset-4 overflow-hidden rounded-full bg-card">
              <img
                src={imageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block">
        <button onClick={() => scrollToSection("about")} className="animate-bounce text-brown-light transition-colors hover:text-green">
          <ArrowRight className="h-6 w-6 transform rotate-90" />
        </button>
      </div>
    </section>
  )
}
