import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DiscordLogoIcon } from "@radix-ui/react-icons"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Manage Your DayZ Server Like Never Before
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                The all-in-one platform for DayZ server owners, admins, and modding teams to collaborate, manage, and
                scale their server operations.
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
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-muted md:h-[450px] lg:h-[500px]">
              {/* Placeholder for hero image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-muted-foreground">
                <span className="text-lg font-medium">DayZ Server Dashboard Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

