import { RconManager } from "./rcon"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function monitorServers() {
  try {
    // Get all active servers
    const servers = await sql`
      SELECT id, hostname, port, rcon_password
      FROM servers
      WHERE status = 'active'
    `

    for (const server of servers) {
      try {
        const rcon = new RconManager({
          host: server.hostname,
          port: server.port,
          password: server.rcon_password,
        })

        // Connect to the server
        const connectResult = await rcon.connect()
        if (!connectResult.success) {
          // Update server status to offline
          await sql`
            UPDATE servers
            SET status = 'offline', last_checked = NOW()
            WHERE id = ${server.id}
          `
          continue
        }

        // Get server info
        const infoResult = await rcon.getServerInfo()

        // Get players
        const playersResult = await rcon.getPlayers()

        // Update server status and stats
        await sql`
          UPDATE servers
          SET 
            status = 'online',
            last_checked = NOW(),
            player_count = ${playersResult.success && Array.isArray(playersResult.data) ? playersResult.data.length : 0}
          WHERE id = ${server.id}
        `

        // Store server stats
        if (infoResult.success) {
          await sql`
            INSERT INTO server_stats (server_id, stats_data, collected_at)
            VALUES (${server.id}, ${JSON.stringify(infoResult.data)}, NOW())
          `
        }

        // Update player information
        if (playersResult.success && Array.isArray(playersResult.data)) {
          // First, mark all players as offline for this server
          await sql`
            UPDATE server_players
            SET status = 'offline', last_seen = NOW()
            WHERE server_id = ${server.id} AND status = 'online'
          `

          // Then, update or insert the online players
          for (const player of playersResult.data) {
            await sql`
              INSERT INTO server_players (server_id, steam_id, player_name, status, last_seen)
              VALUES (${server.id}, ${player.steamId}, ${player.name}, 'online', NOW())
              ON CONFLICT (server_id, steam_id)
              DO UPDATE SET
                player_name = ${player.name},
                status = 'online',
                last_seen = NOW()
            `
          }
        }

        // Disconnect from the server
        await rcon.disconnect()
      } catch (error) {
        console.error(`Error monitoring server ${server.id}:`, error)

        // Update server status to error
        await sql`
          UPDATE servers
          SET status = 'error', last_checked = NOW()
          WHERE id = ${server.id}
        `
      }
    }
  } catch (error) {
    console.error("Error in server monitoring job:", error)
  }
}

