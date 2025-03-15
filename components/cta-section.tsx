import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DiscordLogoIcon } from "@radix-ui/react-icons"

export function CTASection() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Ready to Transform Your DayZ Server Management?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of DayZ server owners who are streamlining their operations with DayZ Portal.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" asChild>
              <Link href="/api/auth/discord" className="gap-2">
                <DiscordLogoIcon className="h-5 w-5" />
                Get Started with Discord
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:contact@dayzportal.com">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

