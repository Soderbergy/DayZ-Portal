import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Basic",
      description: "Essential tools for small DayZ servers",
      price: "$9.99",
      duration: "per month",
      features: [
        "1 DayZ server connection",
        "Basic server stats",
        "Up to 5 team members",
        "Task management",
        "Discord authentication",
        "Email support",
      ],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      description: "Advanced features for growing communities",
      price: "$24.99",
      duration: "per month",
      features: [
        "3 DayZ server connections",
        "Advanced server stats & monitoring",
        "Up to 15 team members",
        "Task management with assignments",
        "Full activity logging",
        "Custom roles & permissions",
        "Priority support",
      ],
      popular: true,
      buttonText: "Get Started",
    },
    {
      name: "Enterprise",
      description: "Complete solution for large communities",
      price: "$49.99",
      duration: "per month",
      features: [
        "Unlimited DayZ server connections",
        "Comprehensive stats & analytics",
        "Unlimited team members",
        "Advanced task management",
        "Detailed activity logging & reports",
        "Custom roles with granular permissions",
        "Contractor support",
        "24/7 priority support",
        "Custom integrations",
      ],
      popular: false,
      buttonText: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that fits your needs. All plans include core features.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                  {plan.price}
                  <span className="ml-1 text-2xl font-medium text-muted-foreground">{plan.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="grid flex-1 gap-4">
                <ul className="grid gap-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/api/auth/discord">{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

