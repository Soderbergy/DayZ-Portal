"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ServerPerformanceProps {
  serverId: number
}

export function ServerPerformance({ serverId }: ServerPerformanceProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>CPU & Memory Usage</CardTitle>
          <CardDescription>Server resource utilization over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center bg-muted/50 rounded-md">
          <p className="text-muted-foreground">Performance Chart (CPU & Memory)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Network Traffic</CardTitle>
          <CardDescription>Incoming and outgoing network traffic</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center bg-muted/50 rounded-md">
          <p className="text-muted-foreground">Network Traffic Chart</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Disk Usage</CardTitle>
            <CardDescription>Server storage utilization</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
            <p className="text-muted-foreground">Disk Usage Chart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Player Count</CardTitle>
            <CardDescription>Player count over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
            <p className="text-muted-foreground">Player Count Chart</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

