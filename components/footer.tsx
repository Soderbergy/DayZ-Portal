import Link from "next/link"
import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold">DayZ Portal</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} DayZ Portal. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <nav className="flex gap-4 md:gap-6">
            <Link
              href="/terms"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="https://discord.gg/dayzportal" target="_blank" rel="noopener noreferrer">
              <DiscordLogoIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
              <span className="sr-only">Discord</span>
            </Link>
            <Link href="https://twitter.com/dayzportal" target="_blank" rel="noopener noreferrer">
              <TwitterLogoIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

