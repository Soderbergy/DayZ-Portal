"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ServerSettingsProps {
  serverId: number
}

export function ServerSettings({ serverId }: ServerSettingsProps) {
  const [formState, setFormState] = useState({
    name: "DayZ Chernarus",
    hostname: "dayz1.example.com",
    port: "2302",
    rconPassword: "••••••••••••",
    maxPlayers: "60",
    restartInterval: "4",
    enableBackups: true,
    backupInterval: "24",
    description: "Our main Chernarus server with custom mods and active admins.",
    welcomeMessage: "Welcome to our DayZ server! Follow the rules and have fun!",
    discordWebhook: "https://discord.com/api/webhooks/123456789/abcdef",
    enableLogging: true,
    logRetentionDays: "30",
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the settings to the database
    console.log("Saving settings:", formState)
    // Show success message
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the basic settings for your DayZ server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Server Name</Label>
                  <Input id="name" value={formState.name} onChange={(e) => handleChange("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostname">Hostname</Label>
                  <Input
                    id="hostname"
                    value={formState.hostname}
                    onChange={(e) => handleChange("hostname", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" value={formState.port} onChange={(e) => handleChange("port", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rconPassword">RCON Password</Label>
                  <Input
                    id="rconPassword"
                    type="password"
                    value={formState.rconPassword}
                    onChange={(e) => handleChange("rconPassword", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Max Players</Label>
                  <Input
                    id="maxPlayers"
                    value={formState.maxPlayers}
                    onChange={(e) => handleChange("maxPlayers", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restartInterval">Restart Interval (hours)</Label>
                  <Input
                    id="restartInterval"
                    value={formState.restartInterval}
                    onChange={(e) => handleChange("restartInterval", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Server Description</Label>
                <Textarea
                  id="description"
                  value={formState.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={formState.welcomeMessage}
                  onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
              <CardDescription>Configure performance-related settings for your server</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Performance settings will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle>Backup Settings</CardTitle>
              <CardDescription>Configure automatic backups for your server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableBackups"
                  checked={formState.enableBackups as boolean}
                  onCheckedChange={(checked) => handleChange("enableBackups", checked)}
                />
                <Label htmlFor="enableBackups">Enable Automatic Backups</Label>
              </div>

              {formState.enableBackups && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="backupInterval">Backup Interval (hours)</Label>
                    <Input
                      id="backupInterval"
                      value={formState.backupInterval}
                      onChange={(e) => handleChange("backupInterval", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupRetention">Backup Retention</Label>
                    <Select value="7days" onValueChange={(value) => console.log(value)}>
                      <SelectTrigger id="backupRetention">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1day">1 Day</SelectItem>
                        <SelectItem value="3days">3 Days</SelectItem>
                        <SelectItem value="7days">7 Days</SelectItem>
                        <SelectItem value="14days">14 Days</SelectItem>
                        <SelectItem value="30days">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notifications for server events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                <Input
                  id="discordWebhook"
                  value={formState.discordWebhook}
                  onChange={(e) => handleChange("discordWebhook", e.target.value)}
                />
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-medium">Notification Events</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyServerStart" defaultChecked />
                    <Label htmlFor="notifyServerStart">Server Start/Stop</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyPlayerJoin" defaultChecked />
                    <Label htmlFor="notifyPlayerJoin">Player Join/Leave</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyHighCpu" defaultChecked />
                    <Label htmlFor="notifyHighCpu">High CPU Usage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyErrors" defaultChecked />
                    <Label htmlFor="notifyErrors">Server Errors</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifyBackups" defaultChecked />
                    <Label htmlFor="notifyBackups">Backup Completion</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced settings for your server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableLogging"
                  checked={formState.enableLogging as boolean}
                  onCheckedChange={(checked) => handleChange("enableLogging", checked)}
                />
                <Label htmlFor="enableLogging">Enable Detailed Logging</Label>
              </div>

              {formState.enableLogging && (
                <div className="space-y-2">
                  <Label htmlFor="logRetentionDays">Log Retention (days)</Label>
                  <Input
                    id="logRetentionDays"
                    value={formState.logRetentionDays}
                    onChange={(e) => handleChange("logRetentionDays", e.target.value)}
                  />
                </div>
              )}

              <div className="pt-4">
                <Button variant="destructive">Reset Server Configuration</Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

