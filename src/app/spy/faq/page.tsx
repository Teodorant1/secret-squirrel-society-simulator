"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeSelector } from "@/components/theme-selector";
import { CRTScanlines } from "@/components/effects/crt-scanlines";
import { GlitchText } from "@/components/effects/glitch-text";

export default function FAQPage() {
  const [seed] = useState(Math.random() * 1000);

  return (
    <div className="container max-w-3xl py-12">
      <CRTScanlines seed={seed} />
      <GlitchText
        text="Frequently Asked Questions"
        as="h1"
        className="mb-8 text-4xl font-bold"
        seed={seed}
      />
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <GlitchText text="What is this website about?" seed={seed} />
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-lg leading-relaxed">
              This website is a collection of resources and tools for learning
              about and using generative AI. It is designed to be a helpful
              resource for both beginners and experienced users.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <GlitchText text="Who created this website?" seed={seed} />
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-lg leading-relaxed">
              This website was created by a passionate group of AI enthusiasts.
              We are dedicated to making generative AI more accessible and
              understandable.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <GlitchText text="How can I contribute?" seed={seed} />
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-lg leading-relaxed">
              We welcome contributions! If you have any suggestions, feedback,
              or would like to help improve the website, please reach out to us.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ThemeSelector />
    </div>
  );
}
