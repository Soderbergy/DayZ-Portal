import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "How does DayZ Portal connect to my server?",
      answer:
        "DayZ Portal uses a secure VPS that communicates with your DayZ server via RCON. This allows us to fetch real-time stats and information without compromising your server's security.",
    },
    {
      question: "Can I manage multiple DayZ servers?",
      answer:
        "Yes! Depending on your subscription tier, you can connect and manage multiple DayZ servers from a single dashboard. The Basic plan supports 1 server, Pro supports 3 servers, and Enterprise supports unlimited servers.",
    },
    {
      question: "How do team permissions work?",
      answer:
        "You can create custom roles with specific permissions for each team member. This allows you to control who can view server stats, manage tasks, invite new members, and more, giving you complete control over your team's access.",
    },
    {
      question: "Is my server data secure?",
      answer:
        "Absolutely. We use industry-standard encryption and security practices to protect your data. Our VPS connection to your server is secure, and we never store sensitive server credentials on our main platform.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
    },
    {
      question: "Do you offer custom solutions for large communities?",
      answer:
        "Yes! Our Enterprise plan includes custom integrations and solutions tailored to your specific needs. Contact our sales team to discuss your requirements.",
    },
  ]

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

