"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, RefreshCw } from "lucide-react"

// Mock data - in a real app, this would come from the database
const mockLogs = [
  { timestamp: "2023-06-15 14:32:45", level: "INFO", message: "Server started successfully" },
  { timestamp: "2023-06-15 14:33:12", level: "INFO", message: "Player 'SurvivorDude' connected (76561198012345678)" },
  { timestamp: "2023-06-15 14:35:28", level: "INFO", message: "Player 'ZombieHunter' connected (76561198087654321)" },
  { timestamp: "2023-06-15 14:40:15", level: "WARNING", message: "High CPU usage detected (85%)" },
  {
    timestamp: "2023-06-15 14:42:33",
    level: "INFO",
    message: "Player 'ApocalypseSurvivor' connected (76561198055555555)",
  },
  { timestamp: "2023-06-15 14:45:10", level: "ERROR", message: "Failed to load mod 'CustomWeapons' - file missing" },
  { timestamp: "2023-06-15 14:50:22", level: "INFO", message: "Scheduled restart in 10 minutes" },
  { timestamp: "2023-06-15 14:55:18", level: "INFO", message: "Scheduled restart in 5 minutes" },
  { timestamp: "2023-06-15 14:59:45", level: "INFO", message: "Scheduled restart in 1 minute" },
  { timestamp: "2023-06-15 15:00:00", level: "INFO", message: "Server restarting..." },
  { timestamp: "2023-06-15 15:01:30", level: "INFO", message: "Server started successfully" },
  { timestamp: "2023-06-15 15:02:15", level: "INFO", message: "Player 'SurvivorDude' connected (76561198012345678)" },
  { timestamp: "2023-06-15 15:03:42", level: "INFO", message: "Player 'ZombieHunter' connected (76561198087654321)" },
  {
    timestamp: "2023-06-15 15:05:10",
    level: "INFO",
    message: "Player 'ApocalypseSurvivor' connected (76561198055555555)",
  },
]

interface ServerLogsProps {
  serverId: number
}

export function ServerLogs({ serverId }: ServerLogsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [logLevel, setLogLevel] = useState("all")

  // Filter logs based on search query and log level
  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = logLevel === "all" || log.level.toLowerCase() === logLevel.toLowerCase()
    return matchesSearch && matchesLevel
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={logLevel} onValueChange={setLogLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select log level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Server Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] overflow-auto rounded border bg-muted/20 p-4 font-mono text-sm">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  log.level === "ERROR"
                    ? "text-red-500"
                    : log.level === "WARNING"
                      ? "text-yellow-500"
                      : "text-foreground"
                }`}
              >
                <span className="text-muted-foreground">[{log.timestamp}]</span>{" "}
                <span className="font-semibold">[{log.level}]</span> {log.message}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

