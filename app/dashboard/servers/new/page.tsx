import { DashboardLayout } from "@/components/dashboard/layout"
import { NewServerForm } from "@/components/dashboard/servers/new-server-form"

export default function NewServerPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Add New Server</h1>
        <p className="text-muted-foreground">Connect a new DayZ server to your DayZ Portal account.</p>
        <NewServerForm />
      </div>
    </DashboardLayout>
  )
}

