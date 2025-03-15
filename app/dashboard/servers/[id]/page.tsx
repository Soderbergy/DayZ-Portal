import { DashboardLayout } from "@/components/dashboard/layout"
import { ServerDetails } from "@/components/dashboard/servers/server-details"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default function ServerPage({ params }: ServerPageProps) {
  return (
    <DashboardLayout>
      <ServerDetails serverId={Number.parseInt(params.id)} />
    </DashboardLayout>
  )
}

