"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Play, Pause, RefreshCw, Settings, Trash2, Users, Clock } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/dashboard/empty-state"

// Mock data - in a real app, this would come from the database
const mockServers = [
  {
    id: 1,
    name: "DayZ Chernarus",
    hostname: "dayz1.example.com",
    port: 2302,
    status: "online",
    players: 42,
    maxPlayers: 60,
    uptime: "3d 12h",
    team: "Main Team",
    lastUpdated: "2 minutes ago",
  },
  {
    id: 2,
    name: "DayZ Livonia",
    hostname: "dayz2.example.com",
    port: 2302,
    status: "online",
    players: 28,
    maxPlayers: 50,
    uptime: "1d 8h",
    team: "Main Team",
    lastUpdated: "5 minutes ago",
  },
  {
    id: 3,
    name: "DayZ Namalsk",
    hostname: "dayz3.example.com",
    port: 2302,
    status: "offline",
    players: 0,
    maxPlayers: 40,
    uptime: "0h",
    team: "Test Servers",
    lastUpdated: "1 hour ago",
  },
]

export function ServersList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter servers based on search query and active tab
  const filteredServers = mockServers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.team.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "online") return matchesSearch && server.status === "online"
    if (activeTab === "offline") return matchesSearch && server.status === "offline"

    return matchesSearch
  })

  const handleViewServer = (serverId: number) => {
    router.push(`/dashboard/servers/${serverId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Servers</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
            <TabsTrigger value="offline">Offline</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-full sm:w-auto sm:max-w-xs">
          <Input
            placeholder="Search servers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {filteredServers.length === 0 ? (
        <EmptyState
          title="No servers found"
          description="No servers match your search criteria or you haven't added any servers yet."
          action={
            <Button asChild>
              <a href="/dashboard/servers/new">Add Server</a>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServers.map((server) => (
            <Card key={server.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{server.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {server.hostname}:{server.port}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewServer(server.id)}>View Details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        {server.status === "online" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            <span>Stop Server</span>
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            <span>Start Server</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Restart Server</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge variant={server.status === "online" ? "default" : "secondary"} className="mt-2 w-fit">
                  {server.status === "online" ? "Online" : "Offline"}
                </Badge>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {server.players}/{server.maxPlayers} Players
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Uptime: {server.uptime}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between text-xs text-muted-foreground">
                <span>Team: {server.team}</span>
                <span>Updated: {server.lastUpdated}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

