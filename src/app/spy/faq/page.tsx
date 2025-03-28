import { CRTScanlines } from "@/components/effects/crt-scanlines";
import { GlitchText } from "@/components/effects/glitch-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeSelector } from "@/components/theme-selector";

const FAQS = [
  {
    question: "What is Secret Politics?",
    answer:
      "Secret Politics is a social deduction game inspired by Secret Hitler, where players must work together to uncover hidden roles and agendas while navigating political intrigue.",
  },
  {
    question: "How many players are needed?",
    answer:
      "The game is designed for 5-10 players, with different role distributions based on the player count.",
  },

  {
    question: "Can I create my own custom theme?",
    answer:
      "Yes! You can customize faction names , title names and flags/symbols in the customize page to create your own unique theme.",
  },
  // {
  //   question: "How do I save my custom theme?",
  //   answer:
  //     "You to your account when you're logged in. You can switch between your custom theme and presets at any time.",
  // },
];

export default function FAQPage() {
  return (
    <div className="container relative max-w-3xl py-12">
      <CRTScanlines />
      <h1 className="mb-8 text-center text-4xl font-bold">
        <GlitchText text={"Frequently Asked Questions"} />
      </h1>
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              <GlitchText text={faq.question} />
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-8 flex justify-center">
        <ThemeSelector />
      </div>
    </div>
  );
}
