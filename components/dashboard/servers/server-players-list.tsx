"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MoreHorizontal, Ban, UserX, Clock, Shield, RefreshCw } from "lucide-react"
import { getPlayers, kickPlayer, banPlayer } from "@/app/api/rcon/actions"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/dashboard/empty-state"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Player {
  id: string | number
  name: string
  steamId: string
  status: string
  lastSeen: string
  playtime?: string
  sessionTime?: string
}

interface ServerPlayersListProps {
  serverId: number
}

export function ServerPlayersList({ serverId }: ServerPlayersListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [actionType, setActionType] = useState<"kick" | "ban" | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  const fetchPlayers = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getPlayers(serverId)

      if (response.success) {
        if (Array.isArray(response.data)) {
          setPlayers(
            response.data.map((player) => ({
              ...player,
              status: "online",
              lastSeen: "Online now",
            })),
          )
        } else {
          setPlayers([])
        }
      } else {
        setError(response.message)
        toast({
          title: "Error fetching players",
          description: response.message,
          variant: "destructive",
        })
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
    fetchPlayers()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchPlayers, 30000)

    return () => clearInterval(interval)
  }, [serverId])

  // Filter players based on search query
  const filteredPlayers = players.filter(
    (player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()) || player.steamId.includes(searchQuery),
  )

  const handlePlayerAction = async (type: "kick" | "ban") => {
    if (!selectedPlayer) return

    setActionLoading(true)

    try {
      const action = type === "kick" ? kickPlayer : banPlayer
      const response = await action({
        serverId,
        playerId: selectedPlayer.id,
        reason: actionReason || `${type === "kick" ? "Kicked" : "Banned"} by admin`,
      })

      if (response.success) {
        toast({
          title: `Player ${type === "kick" ? "kicked" : "banned"}`,
          description: `Successfully ${type === "kick" ? "kicked" : "banned"} ${selectedPlayer.name}`,
          variant: "default",
        })

        // Refresh the player list
        fetchPlayers()
      } else {
        toast({
          title: `Failed to ${type} player`,
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
      setActionLoading(false)
      setActionType(null)
      setSelectedPlayer(null)
      setActionReason("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-sm">
          <Input placeholder="Search players..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchPlayers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredPlayers.filter((p) => p.status === "online").length} online / {filteredPlayers.length} total
          </span>
        </div>
      </div>

      {error ? (
        <EmptyState
          title="Error loading players"
          description={error}
          action={<Button onClick={fetchPlayers}>Try Again</Button>}
        />
      ) : loading && players.length === 0 ? (
        <Card className="p-8">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Card>
      ) : filteredPlayers.length === 0 ? (
        <EmptyState
          title="No players found"
          description={searchQuery ? "No players match your search criteria." : "There are no players on this server."}
          action={
            <Button onClick={fetchPlayers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Steam ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.steamId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${player.status === "online" ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      {player.name}
                    </div>
                  </TableCell>
                  <TableCell>{player.steamId}</TableCell>
                  <TableCell>{player.status === "online" ? "Online" : "Offline"}</TableCell>
                  <TableCell>{player.lastSeen}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPlayer(player)
                            setActionType("kick")
                          }}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          <span>Kick</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Clock className="mr-2 h-4 w-4" />
                          <span>View History</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Permissions</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedPlayer(player)
                            setActionType("ban")
                          }}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          <span>Ban Player</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Kick Player Dialog */}
      <Dialog
        open={actionType === "kick" && !!selectedPlayer}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null)
            setSelectedPlayer(null)
            setActionReason("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kick Player</DialogTitle>
            <DialogDescription>
              Are you sure you want to kick {selectedPlayer?.name}? This will disconnect them from the server.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason
              </label>
              <Textarea
                id="reason"
                placeholder="Reason for kicking (optional)"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null)
                setSelectedPlayer(null)
                setActionReason("")
              }}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={() => handlePlayerAction("kick")} disabled={actionLoading}>
              {actionLoading ? "Kicking..." : "Kick Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Player Dialog */}
      <Dialog
        open={actionType === "ban" && !!selectedPlayer}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null)
            setSelectedPlayer(null)
            setActionReason("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban Player</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedPlayer?.name}? This will prevent them from rejoining the server.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="banReason" className="text-sm font-medium">
                Reason
              </label>
              <Textarea
                id="banReason"
                placeholder="Reason for banning (optional)"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null)
                setSelectedPlayer(null)
                setActionReason("")
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handlePlayerAction("ban")} disabled={actionLoading}>
              {actionLoading ? "Banning..." : "Ban Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

