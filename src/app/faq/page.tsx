import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ThemeSelector } from "@/components/theme-selector"

const FAQS = [
  {
    question: "What is Secret Politics?",
    answer:
      "Secret Politics is a social deduction game inspired by Secret Hitler, where players must work together to uncover hidden roles and agendas while navigating political intrigue.",
  },
  {
    question: "How many players are needed?",
    answer: "The game is designed for 5-10 players, with different role distributions based on the player count.",
  },
  {
    question: "How do the theme presets work?",
    answer:
      "Each theme preset provides a unique visual experience with custom animations, colors, and styling. You can choose from Game of Thrones, James Bond, Wendigoon, Alexander Vucic, or Trump & Vance themes, or create your own custom theme.",
  },
  {
    question: "Can I create my own custom theme?",
    answer:
      "Yes! You can customize faction names, colors, symbols, and spacing in the customize page to create your own unique theme.",
  },
  {
    question: "How do I save my custom theme?",
    answer:
      "Your custom theme settings are automatically saved to your account when you're logged in. You can switch between your custom theme and presets at any time.",
  },
]

export default function FAQPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <ThemeSelector />
    </div>
  )
}

