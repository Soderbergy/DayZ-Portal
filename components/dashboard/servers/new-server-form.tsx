"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function NewServerForm() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    name: "",
    hostname: "",
    port: "2302",
    rconPassword: "",
    maxPlayers: "60",
    team: "",
    description: "",
    enableAutoRestart: true,
    restartInterval: "4",
    enableBackups: true,
    backupInterval: "24",
  })

  const [formStatus, setFormStatus] = useState<{
    status: "idle" | "testing" | "success" | "error"
    message: string
  }>({
    status: "idle",
    message: "",
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const testConnection = () => {
    // In a real app, you would test the connection to the server
    setFormStatus({ status: "testing", message: "Testing connection..." })

    // Simulate a connection test
    setTimeout(() => {
      if (formState.hostname && formState.rconPassword) {
        setFormStatus({
          status: "success",
          message: "Connection successful! Server is online and accessible.",
        })
      } else {
        setFormStatus({
          status: "error",
          message: "Connection failed. Please check your server details and ensure the server is online.",
        })
      }
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would save the server to the database
    console.log("Adding server:", formState)

    // Redirect to the servers page
    router.push("/dashboard/servers")
  }

  // Mock teams for the select dropdown
  const teams = [
    { id: "1", name: "Main Team" },
    { id: "2", name: "Test Servers" },
    { id: "3", name: "Development" },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Server Information</CardTitle>
              <CardDescription>Enter the basic information for your DayZ server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name</Label>
                  <Input
                    id="name"
                    placeholder="My DayZ Server"
                    value={formState.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team</Label>
                  <Select value={formState.team} onValueChange={(value) => handleChange("team", value)} required>
                    <SelectTrigger id="team">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Server Description</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your server"
                  value={formState.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hostname">Hostname or IP Address</Label>
                  <Input
                    id="hostname"
                    placeholder="example.com or 123.456.789.0"
                    value={formState.hostname}
                    onChange={(e) => handleChange("hostname", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    value={formState.port}
                    onChange={(e) => handleChange("port", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rconPassword">RCON Password</Label>
                <Input
                  id="rconPassword"
                  type="password"
                  placeholder="Your server's RCON password"
                  value={formState.rconPassword}
                  onChange={(e) => handleChange("rconPassword", e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="button" variant="outline" onClick={testConnection}>
                  Test Connection
                </Button>
              </div>

              {formStatus.status !== "idle" && (
                <Alert
                  variant={
                    formStatus.status === "error"
                      ? "destructive"
                      : formStatus.status === "success"
                        ? "default"
                        : "default"
                  }
                >
                  {formStatus.status === "error" && <AlertCircle className="h-4 w-4" />}
                  {formStatus.status === "success" && <CheckCircle2 className="h-4 w-4" />}
                  <AlertTitle>
                    {formStatus.status === "testing"
                      ? "Testing Connection"
                      : formStatus.status === "success"
                        ? "Connection Successful"
                        : "Connection Failed"}
                  </AlertTitle>
                  <AlertDescription>{formStatus.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard/servers")}>
                Cancel
              </Button>
              <Button type="submit">Add Server</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure additional settings for your server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Max Players</Label>
                <Input
                  id="maxPlayers"
                  value={formState.maxPlayers}
                  onChange={(e) => handleChange("maxPlayers", e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="enableAutoRestart"
                  checked={formState.enableAutoRestart as boolean}
                  onCheckedChange={(checked) => handleChange("enableAutoRestart", checked)}
                />
                <Label htmlFor="enableAutoRestart">Enable Automatic Restarts</Label>
              </div>

              {formState.enableAutoRestart && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="restartInterval">Restart Interval (hours)</Label>
                  <Input
                    id="restartInterval"
                    value={formState.restartInterval}
                    onChange={(e) => handleChange("restartInterval", e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="enableBackups"
                  checked={formState.enableBackups as boolean}
                  onCheckedChange={(checked) => handleChange("enableBackups", checked)}
                />
                <Label htmlFor="enableBackups">Enable Automatic Backups</Label>
              </div>

              {formState.enableBackups && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="backupInterval">Backup Interval (hours)</Label>
                  <Input
                    id="backupInterval"
                    value={formState.backupInterval}
                    onChange={(e) => handleChange("backupInterval", e.target.value)}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard/servers")}>
                Cancel
              </Button>
              <Button type="submit">Add Server</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

