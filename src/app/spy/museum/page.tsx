"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe2, Clock, FileText, Map } from "lucide-react"

export default function MuseumPage() {
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Intelligence Archive</h1>
          <p className="text-lg text-muted-foreground">Declassified operations and historical records</p>
        </motion.div>

        <Tabs defaultValue="timeline" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="map">Global Theater</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-8">
            <div className="relative">
              <div className="absolute left-1/2 h-full w-px bg-border" />
              {TIMELINE_EVENTS.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex items-start gap-8 mb-8 ${index % 2 ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex-1">
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">{event.year}</Badge>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </Card>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary mt-8 relative z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {OPERATIONS.map((operation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline">{operation.period}</Badge>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{operation.name}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{operation.summary}</p>
                    <Button variant="ghost" className="mt-4" onClick={() => setSelectedOperation(operation.name)}>
                      View Details
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Global Operations Map</h3>
                <Globe2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-[url('/map-bg.svg')] opacity-50"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                {LOCATIONS.map((location, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    style={{
                      left: `${location.x}%`,
                      top: `${location.y}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="archive" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {ARCHIVE_DOCUMENTS.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline">{doc.classification}</Badge>
                      <Map className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Reference: {doc.reference}</span>
                      <span>Date: {doc.date}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {selectedOperation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedOperation(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="container mx-auto max-w-2xl mt-20"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-4">{selectedOperation}</h2>
                  <p className="text-muted-foreground">Detailed operation information would be displayed here.</p>
                  <Button className="mt-6" onClick={() => setSelectedOperation(null)}>
                    Close
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const TIMELINE_EVENTS = [
  {
    year: "1945",
    title: "Operation Paperclip",
    description: "Scientific intelligence gathering operation in post-war Europe.",
  },
  {
    year: "1960",
    title: "U-2 Incident",
    description: "High-altitude reconnaissance mission over foreign territory.",
  },
  {
    year: "1962",
    title: "Cuban Missile Crisis",
    description: "Intelligence operations during the October Crisis.",
  },
  {
    year: "1985",
    title: "Project RYAN",
    description: "Strategic intelligence assessment operation.",
  },
]

const OPERATIONS = [
  {
    name: "Operation Gold",
    period: "1950s",
    summary: "Underground tunnel operation for intelligence gathering in Berlin.",
  },
  {
    name: "Project Corona",
    period: "1960s",
    summary: "Satellite reconnaissance program using specialized cameras.",
  },
  {
    name: "Operation Ivy Bells",
    period: "1970s",
    summary: "Underwater surveillance operation in strategic waters.",
  },
]

const LOCATIONS = [
  { x: 25, y: 40 },
  { x: 45, y: 35 },
  { x: 65, y: 45 },
  { x: 75, y: 30 },
  { x: 35, y: 60 },
]

const ARCHIVE_DOCUMENTS = [
  {
    title: "Field Report: Berlin Station",
    classification: "Declassified",
    description: "Analysis of intelligence gathering operations in divided Berlin.",
    reference: "DOC-1960-0531",
    date: "1960-05-31",
  },
  {
    title: "Technical Assessment: SIGINT Capabilities",
    classification: "Declassified",
    description: "Evaluation of signal intelligence gathering systems.",
    reference: "DOC-1975-0892",
    date: "1975-08-15",
  },
  {
    title: "Operation Summary: Nordic Region",
    classification: "Declassified",
    description: "Overview of intelligence activities in Scandinavia.",
    reference: "DOC-1982-1104",
    date: "1982-11-04",
  },
  {
    title: "Analysis: Submarine Detection Systems",
    classification: "Declassified",
    description: "Technical review of underwater surveillance methods.",
    reference: "DOC-1988-0723",
    date: "1988-07-23",
  },
]

