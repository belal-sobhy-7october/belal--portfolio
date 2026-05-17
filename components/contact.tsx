"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Github, Linkedin } from "lucide-react"

export default function Contact() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-green" />,
      title: "Email",
      value: "zaidsobhy2000@gmail.com",
      link: "mailto:zaidsobhy2000@gmail.com",
    },
    {
      icon: <Phone className="h-6 w-6 text-green" />,
      title: "Phone",
      value: "01060911823",
      link: "tel:01060911823",
    },
    {
      icon: <MapPin className="h-6 w-6 text-green" />,
      title: "Location",
      value: "Egypt",
      link: null,
    },
  ]

  return (
    <section id="contact" className="border-b border-border py-20">
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
            Contact
          </Badge>
          <h2 className="section-title">Get In Touch</h2>
          <div className="mx-auto h-px w-20 bg-border"></div>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            variants={fadeIn}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {contactInfo.map((info, index) => (
                <Card key={index} className="earth-card transition-colors hover:border-green">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-green-light p-3">{info.icon}</div>
                      <div>
                        <h4 className="mb-1 font-serif text-lg font-semibold text-foreground">{info.title}</h4>
                        {info.link ? (
                          <a href={info.link} className="text-muted-foreground transition-colors hover:text-green">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="earth-card transition-colors hover:border-green">
                <CardContent className="p-6">
                  <h4 className="mb-4 font-serif text-lg font-semibold text-foreground">Follow Me</h4>
                  <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent text-muted-foreground hover:border-green hover:bg-transparent hover:text-green" asChild>
                      <a href="https://www.linkedin.com/in/belal-sobhy-134845397/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent text-muted-foreground hover:border-green hover:bg-transparent hover:text-green" asChild>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
