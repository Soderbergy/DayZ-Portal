"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Pause, RefreshCw, Settings, Users, Clock, Activity, Database } from "lucide-react"
import { ServerPlayersList } from "@/components/dashboard/servers/server-players-list"
import { ServerPerformance } from "@/components/dashboard/servers/server-performance"
import { ServerLogs } from "@/components/dashboard/servers/server-logs"
import { ServerSettings } from "@/components/dashboard/servers/server-settings"
import { getServerInfo, restartServer } from "@/app/api/rcon/actions"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { neon } from "@neondatabase/serverless"

interface ServerDetailsProps {
  serverId: number
}

export function ServerDetails({ serverId }: ServerDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [server, setServer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restartDialogOpen, setRestartDialogOpen] = useState(false)
  const [restartCountdown, setRestartCountdown] = useState(60)
  const [isRestarting, setIsRestarting] = useState(false)
  const { toast } = useToast()

  const fetchServerDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch server details from the database
      const sql = neon(process.env.DATABASE_URL!)
      const serverData = await sql`
        SELECT 
          s.*,
          t.name as team_name,
          (SELECT COUNT(*) FROM server_players sp WHERE sp.server_id = s.id AND sp.status = 'online') as online_players
        FROM servers s
        LEFT JOIN teams t ON s.team_id = t.id
        WHERE s.id = ${serverId}
      `

      if (serverData.length === 0) {
        setError("Server not found")
        return
      }

      // Fetch server stats
      const statsData = await sql`
        SELECT stats_data, collected_at
        FROM server_stats
        WHERE server_id = ${serverId}
        ORDER BY collected_at DESC
        LIMIT 1
      `

      const serverInfo = {
        ...serverData[0],
        stats: statsData.length > 0 ? statsData[0].stats_data : null,
        lastUpdated: statsData.length > 0 ? new Date(statsData[0].collected_at).toLocaleString() : "Never",
      }

      setServer(serverInfo)

      // Fetch real-time server info via RCON
      const rconResponse = await getServerInfo(serverId)

      if (!rconResponse.success) {
        console.warn("Failed to get real-time server info:", rconResponse.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServerDetails()

    // Set up polling every 60 seconds
    const interval = setInterval(fetchServerDetails, 60000)

    return () => clearInterval(interval)
  }, [serverId])

  const handleRestartServer = async () => {
    setIsRestarting(true)

    try {
      const response = await restartServer(serverId, restartCountdown)

      if (response.success) {
        toast({
          title: "Server restart initiated",
          description: `Server will restart in ${restartCountdown} seconds`,
          variant: "default",
        })
        setRestartDialogOpen(false)
      } else {
        toast({
          title: "Failed to restart server",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsRestarting(false)
    }
  }

  if (loading && !server) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Error loading server</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild>
          <Link href="/dashboard/servers">Back to Servers</Link>
        </Button>
      </div>
    )
  }

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Server not found</h2>
        <Button asChild>
          <Link href="/dashboard/servers">Back to Servers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/servers">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{server.name}</h1>
          <Badge variant={server.status === "online" ? "default" : "secondary"} className="ml-2">
            {server.status === "online" ? "Online" : "Offline"}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            {server.status === "online" ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
          <AlertDialog open={restartDialogOpen} onOpenChange={setRestartDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Restart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restart Server</AlertDialogTitle>
                <AlertDialogDescription>
                  This will restart the server after a countdown. All players will be disconnected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="countdown" className="text-sm font-medium">
                    Countdown (seconds):
                  </label>
                  <input
                    id="countdown"
                    type="number"
                    min="10"
                    max="300"
                    value={restartCountdown}
                    onChange={(e) => setRestartCountdown(Number.parseInt(e.target.value))}
                    className="w-20 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestartServer} disabled={isRestarting}>
                  {isRestarting ? "Restarting..." : "Restart Server"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/servers/${serverId}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Players</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {server.online_players || 0}/{server.max_players || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {server.max_players
                    ? `${Math.round((server.online_players / server.max_players) * 100)}% capacity`
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.uptime || "N/A"}</div>
                <p className="text-xs text-muted-foreground">Next restart in {server.next_restart || "N/A"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.stats?.cpu || "N/A"}</div>
                <p className="text-xs text-muted-foreground">{server.stats?.cpu_trend || "No data"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{server.stats?.memory || "N/A"}</div>
                <p className="text-xs text-muted-foreground">{server.stats?.memory_percent || "No data"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Server Performance</CardTitle>
                <CardDescription>CPU, Memory, and Network usage over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">Performance Chart</p>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Server Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Hostname</p>
                      <p className="font-medium">{server.hostname}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Port</p>
                      <p className="font-medium">{server.port}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Map</p>
                      <p className="font-medium">{server.map || "Unknown"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-medium">{server.version || "Unknown"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Mods</p>
                      <p className="font-medium">{server.mods_count || "Unknown"} installed</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Team</p>
                      <p className="font-medium">{server.team_name || "None"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Restart Schedule</p>
                      <p className="font-medium">{server.restart_schedule || "Not configured"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{server.lastUpdated}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="players">
          <ServerPlayersList serverId={serverId} />
        </TabsContent>

        <TabsContent value="performance">
          <ServerPerformance serverId={serverId} />
        </TabsContent>

        <TabsContent value="logs">
          <ServerLogs serverId={serverId} />
        </TabsContent>

        <TabsContent value="settings">
          <ServerSettings serverId={serverId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

