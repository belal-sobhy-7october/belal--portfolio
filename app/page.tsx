import type { Metadata } from "next"
import Hero from "@/components/hero"
import About from "@/components/about"
import TechStack from "@/components/tech-stack"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Belal Sobhy | Portfolio",
  description: "Full-stack developer building scalable backend architectures, robust database systems, and fast, clean web interfaces with Node.js, Next.js, and PostgreSQL.",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

