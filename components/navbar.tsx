"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  const navLinks = [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Tech Stack", href: "tech-stack" },
    { name: "Projects", href: "projects" },
    { name: "Contact", href: "contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-[12px] transition-all duration-300",
        scrolled ? "shadow-[0_10px_30px_rgba(59,47,32,0.06)]" : "shadow-none",
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => scrollToSection("home")} className="font-serif text-[1.2rem] font-semibold text-green">
            Belal<span className="text-brown"> Sobhy</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-green"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation Toggle */}
          <Button variant="ghost" size="icon" className="text-green hover:bg-green-light md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-[12px] md:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="py-2 text-left text-muted-foreground transition-colors hover:text-green"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
