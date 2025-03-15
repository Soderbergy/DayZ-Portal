import { Rcon } from "rcon-client"

export interface RconConnectionOptions {
  host: string
  port: number
  password: string
  timeout?: number
}

export interface RconResponse {
  success: boolean
  message: string
  data?: any
}

export class RconManager {
  private options: RconConnectionOptions
  private client: Rcon | null = null
  private isConnected = false

  constructor(options: RconConnectionOptions) {
    this.options = {
      ...options,
      timeout: options.timeout || 5000,
    }
  }

  async connect(): Promise<RconResponse> {
    try {
      this.client = await Rcon.connect({
        host: this.options.host,
        port: this.options.port,
        password: this.options.password,
        timeout: this.options.timeout,
      })

      this.isConnected = true

      return {
        success: true,
        message: "Connected to RCON server successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to connect to RCON server: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  async disconnect(): Promise<RconResponse> {
    if (!this.client) {
      return {
        success: false,
        message: "Not connected to any RCON server",
      }
    }

    try {
      await this.client.end()
      this.isConnected = false
      this.client = null

      return {
        success: true,
        message: "Disconnected from RCON server successfully",
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to disconnect from RCON server: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  async sendCommand(command: string): Promise<RconResponse> {
    if (!this.client || !this.isConnected) {
      try {
        const connectResult = await this.connect()
        if (!connectResult.success) {
          return connectResult
        }
      } catch (error) {
        return {
          success: false,
          message: `Failed to connect to RCON server: ${error instanceof Error ? error.message : String(error)}`,
        }
      }
    }

    try {
      if (!this.client) {
        throw new Error("RCON client is not initialized")
      }

      const response = await this.client.send(command)

      return {
        success: true,
        message: "Command executed successfully",
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to execute command: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  // DayZ specific commands
  async getPlayers(): Promise<RconResponse> {
    const response = await this.sendCommand("players")

    if (!response.success) {
      return response
    }

    try {
      // Parse the player list from the response
      // Format varies by server, this is a common format
      const playerData = response.data as string

      if (!playerData || playerData.trim() === "Players:" || playerData.includes("No players")) {
        return {
          success: true,
          message: "No players online",
          data: [],
        }
      }

      const lines = playerData.split("\n").filter((line) => line.trim() !== "" && !line.includes("Players:"))

      const players = lines
        .map((line) => {
          // Example format: "1 PlayerName (123456789) 192.168.1.1:2302"
          const match = line.match(/(\d+)\s+(.*?)\s+$$(.*?)$$/)

          if (match) {
            return {
              id: Number.parseInt(match[1], 10),
              name: match[2].trim(),
              steamId: match[3].trim(),
            }
          }

          return null
        })
        .filter(Boolean)

      return {
        success: true,
        message: "Players retrieved successfully",
        data: players,
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to parse player data: ${error instanceof Error ? error.message : String(error)}`,
        data: response.data,
      }
    }
  }

  async kickPlayer(playerId: string | number, reason = "Kicked by admin"): Promise<RconResponse> {
    return this.sendCommand(`kick ${playerId} ${reason}`)
  }

  async banPlayer(playerId: string | number, reason = "Banned by admin"): Promise<RconResponse> {
    return this.sendCommand(`ban ${playerId} ${reason}`)
  }

  async getServerInfo(): Promise<RconResponse> {
    return this.sendCommand("serverinfo")
  }

  async restartServer(seconds = 60): Promise<RconResponse> {
    // First announce the restart
    await this.sendCommand(`say -1 "Server will restart in ${seconds} seconds"`)

    // Then schedule the restart
    return this.sendCommand(`#shutdown ${seconds}`)
  }
}

// Singleton instance for server-wide use
let rconInstance: RconManager | null = null

export function getRconManager(options?: RconConnectionOptions): RconManager {
  if (!rconInstance && options) {
    rconInstance = new RconManager(options)
  } else if (!rconInstance && !options) {
    throw new Error("RCON manager not initialized. Provide connection options.")
  }

  return rconInstance as RconManager
}

