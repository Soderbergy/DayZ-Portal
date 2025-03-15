"use server"

import { revalidatePath } from "next/cache"
import { RconManager, type RconConnectionOptions, type RconResponse } from "@/lib/rcon"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL!)

// Schema for validating server connection details
const serverConnectionSchema = z.object({
  serverId: z.number(),
  host: z.string().min(1),
  port: z.number().min(1).max(65535),
  password: z.string().min(1),
})

// Schema for validating command input
const commandSchema = z.object({
  serverId: z.number(),
  command: z.string().min(1),
})

// Schema for validating player actions
const playerActionSchema = z.object({
  serverId: z.number(),
  playerId: z.union([z.string(), z.number()]),
  reason: z.string().optional(),
})

// Helper function to check if user has access to the server
async function checkServerAccess(userId: string, serverId: number): Promise<boolean> {
  try {
    // Check if the user owns the server or is a member of the team that owns the server
    const server = await sql`
      SELECT s.id, s.team_id
      FROM servers s
      WHERE s.id = ${serverId}
      AND (
        s.owner_id = ${userId}
        OR EXISTS (
          SELECT 1 FROM team_members tm
          WHERE tm.team_id = s.team_id
          AND tm.user_id = ${userId}
        )
      )
    `

    return server.length > 0
  } catch (error) {
    console.error("Error checking server access:", error)
    return false
  }
}

// Helper function to get server connection details
async function getServerConnectionDetails(serverId: number): Promise<RconConnectionOptions | null> {
  try {
    const server = await sql`
      SELECT hostname, port, rcon_password
      FROM servers
      WHERE id = ${serverId}
    `

    if (server.length === 0) {
      return null
    }

    return {
      host: server[0].hostname,
      port: server[0].port,
      password: server[0].rcon_password,
    }
  } catch (error) {
    console.error("Error getting server connection details:", error)
    return null
  }
}

// Test connection to a server
export async function testServerConnection(
  connectionDetails: z.infer<typeof serverConnectionSchema>,
): Promise<RconResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const { serverId, host, port, password } = serverConnectionSchema.parse(connectionDetails)

    // If serverId is provided, check access
    if (serverId) {
      const hasAccess = await checkServerAccess(session.user.id, serverId)
      if (!hasAccess) {
        return {
          success: false,
          message: "You do not have access to this server",
        }
      }
    }

    const rcon = new RconManager({ host, port, password })
    const result = await rcon.connect()

    if (result.success) {
      await rcon.disconnect()
    }

    return result
  } catch (error) {
    return {
      success: false,
      message: `Failed to test connection: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Send a command to a server
export async function sendCommand(commandData: z.infer<typeof commandSchema>): Promise<RconResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const { serverId, command } = commandSchema.parse(commandData)

    const hasAccess = await checkServerAccess(session.user.id, serverId)
    if (!hasAccess) {
      return {
        success: false,
        message: "You do not have access to this server",
      }
    }

    const connectionDetails = await getServerConnectionDetails(serverId)
    if (!connectionDetails) {
      return {
        success: false,
        message: "Server not found",
      }
    }

    const rcon = new RconManager(connectionDetails)
    const result = await rcon.sendCommand(command)

    // Log the command to the activity log
    await sql`
      INSERT INTO activity_logs (user_id, server_id, action_type, details)
      VALUES (${session.user.id}, ${serverId}, 'rcon_command', ${JSON.stringify({ command, result })})
    `

    return result
  } catch (error) {
    return {
      success: false,
      message: `Failed to send command: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Get players from a server
export async function getPlayers(serverId: number): Promise<RconResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const hasAccess = await checkServerAccess(session.user.id, serverId)
    if (!hasAccess) {
      return {
        success: false,
        message: "You do not have access to this server",
      }
    }

    const connectionDetails = await getServerConnectionDetails(serverId)
    if (!connectionDetails) {
      return {
        success: false,
        message: "Server not found",
      }
    }

    const rcon = new RconManager(connectionDetails)
    const result = await rcon.getPlayers()

    // Update the server_players table
    if (result.success && Array.isArray(result.data)) {
      // First, mark all players as offline for this server
      await sql`
        UPDATE server_players
        SET status = 'offline', last_seen = NOW()
        WHERE server_id = ${serverId} AND status = 'online'
      `

      // Then, update or insert the online players
      for (const player of result.data) {
        await sql`
          INSERT INTO server_players (server_id, steam_id, player_name, status, last_seen)
          VALUES (${serverId}, ${player.steamId}, ${player.name}, 'online', NOW())
          ON CONFLICT (server_id, steam_id)
          DO UPDATE SET
            player_name = ${player.name},
            status = 'online',
            last_seen = NOW()
        `
      }
    }

    revalidatePath(`/dashboard/servers/${serverId}`)

    return result
  } catch (error) {
    return {
      success: false,
      message: `Failed to get players: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Kick a player from a server
export async function kickPlayer(actionData: z.infer<typeof playerActionSchema>): Promise<RconResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const { serverId, playerId, reason } = playerActionSchema.parse(actionData)

    const hasAccess = await checkServerAccess(session.user.id, serverId)
    if (!hasAccess) {
      return {
        success: false,
        message: "You do not have access to this server",
      }
    }

    const connectionDetails = await getServerConnectionDetails(serverId)
    if (!connectionDetails) {
      return {
        success: false,
        message: "Server not found",
      }
    }

    const rcon = new RconManager(connectionDetails)
    const result = await rcon.kickPlayer(playerId, reason)

    // Log the action to the activity log
    await sql`
      INSERT INTO activity_logs (user_id, server_id, action_type, details)
      VALUES (${session.user.id}, ${serverId}, 'kick_player', ${JSON.stringify({ playerId, reason, result })})
    `

    revalidatePath(`/dashboard/servers/${serverId}`)

    return result
  } catch (error) {
    return {
      success: false,
      message: `Failed to kick player: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Ban a player from a server
export async function banPlayer(actionData: z.infer<typeof playerActionSchema>): Promise<RconResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const { serverId, playerId, reason } = playerActionSchema.parse(actionData)

    const hasAccess = await checkServerAccess(session.user.id, serverId)
    if (!hasAccess) {
      return {
        success: false,
        message: "You do not have access to this server",
      }
    }

    const connectionDetails = await getServerConnectionDetails(serverId)
    if (!connectionDetails) {
      return {
        success: false,
        message: "Server not found",
      }
    }

    const rcon = new RconManager(connectionDetails)
    const result = await rcon.banPlayer(playerId, reason)

    // Log the action to the activity log
    await sql`
      INSERT INTO activity_logs (user_id, server_id, action_type, details)
      VALUES (${session.user.id}, ${serverId}, 'ban_player', ${JSON.stringify({ playerId, reason, result })})
    `

    revalidatePath(`/dashboard/servers/${serverId}`)

    return result
  } catch (error) {
    return {
      success: false,
      message: `Failed to ban player: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Restart a server
export async function restartServer(serverId: number, seconds = 60): Promise<RconResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const hasAccess = await checkServerAccess(session.user.id, serverId)
    if (!hasAccess) {
      return {
        success: false,
        message: "You do not have access to this server",
      }
    }

    const connectionDetails = await getServerConnectionDetails(serverId)
    if (!connectionDetails) {
      return {
        success: false,
        message: "Server not found",
      }
    }

    const rcon = new RconManager(connectionDetails)
    const result = await rcon.restartServer(seconds)

    // Log the action to the activity log
    await sql`
      INSERT INTO activity_logs (user_id, server_id, action_type, details)
      VALUES (${session.user.id}, ${serverId}, 'restart_server', ${JSON.stringify({ seconds, result })})
    `

    revalidatePath(`/dashboard/servers/${serverId}`)

    return result
  } catch (error) {
    return {
      success: false,
      message: `Failed to restart server: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Get server info
export async function getServerInfo(serverId: number): Promise<RconResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    const hasAccess = await checkServerAccess(session.user.id, serverId)
    if (!hasAccess) {
      return {
        success: false,
        message: "You do not have access to this server",
      }
    }

    const connectionDetails = await getServerConnectionDetails(serverId)
    if (!connectionDetails) {
      return {
        success: false,
        message: "Server not found",
      }
    }

    const rcon = new RconManager(connectionDetails)
    const result = await rcon.getServerInfo()

    // Update the server stats
    if (result.success) {
      await sql`
        INSERT INTO server_stats (server_id, stats_data, collected_at)
        VALUES (${serverId}, ${JSON.stringify(result.data)}, NOW())
      `
    }

    revalidatePath(`/dashboard/servers/${serverId}`)

    return result
  } catch (error) {
    return {
      success: false,
      message: `Failed to get server info: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

