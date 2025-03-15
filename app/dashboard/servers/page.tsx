import { ServersList } from "@/components/dashboard/servers/servers-list"
import { DashboardLayout } from "@/components/dashboard/layout"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ServersPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
          <Button asChild>
            <Link href="/dashboard/servers/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Server
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">Manage your DayZ servers and monitor their performance.</p>
        <ServersList />
      </div>
    </DashboardLayout>
  )
}

