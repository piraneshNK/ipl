import { supabase } from "@/lib/supabase"
import type { Player, Team } from "@/data/players"
import { v4 as uuidv4 } from "uuid"

// Room related functions
export const createRoom = async (roomName: string, password: string, createdBy: string) => {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .insert({
        id: uuidv4(),
        name: roomName,
        password: password, // In production, consider hashing this
        created_by: createdBy,
        status: "waiting", // waiting, active, completed
        auction_started: false,
        is_timer_running: false,
        current_bid: "",
        current_bid_value: 0,
        current_bidder: "",
      })
      .select("id")
      .single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error("Error creating room:", error)
    throw error
  }
}

export const joinRoom = async (roomId: string, password: string) => {
  try {
    const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).single()

    if (error) throw error
    if (!data) throw new Error("Room not found")
    if (data.password !== password) throw new Error("Incorrect password")

    return data
  } catch (error) {
    console.error("Error joining room:", error)
    throw error
  }
}

export const subscribeToRoom = (roomId: string, callback: (data: any) => void) => {
  const subscription = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()

  // Also fetch the initial data
  supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single()
    .then(({ data, error }) => {
      if (!error && data) {
        callback(data)
      }
    })

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription)
  }
}

// Team related functions
export const initializeTeams = async (roomId: string, teams: Team[]) => {
  try {
    const teamsToInsert = teams.map((team) => ({
      id: team.id,
      room_id: roomId,
      name: team.name,
      short_name: team.shortName,
      color: team.color,
      purse: team.purse,
      spent: 0,
    }))

    const { error } = await supabase.from("teams").insert(teamsToInsert)

    if (error) throw error
  } catch (error) {
    console.error("Error initializing teams:", error)
    throw error
  }
}

export const selectTeam = async (roomId: string, userId: string, teamId: number) => {
  try {
    // Check if user already exists in this room
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .eq("room_id", roomId)
      .single()

    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from("users")
        .update({
          team_id: teamId,
          is_auctioneer: false,
          is_ready: false,
        })
        .eq("id", userId)
        .eq("room_id", roomId)

      if (error) throw error
    } else {
      // Insert new user
      const { error } = await supabase.from("users").insert({
        id: userId,
        room_id: roomId,
        team_id: teamId,
        is_auctioneer: false,
        is_ready: false,
      })

      if (error) throw error
    }

    return true
  } catch (error) {
    console.error("Error selecting team:", error)
    throw error
  }
}

export const selectAuctioneer = async (roomId: string, userId: string) => {
  try {
    // Check if user already exists in this room
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .eq("room_id", roomId)
      .single()

    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from("users")
        .update({
          team_id: null,
          is_auctioneer: true,
          is_ready: false,
        })
        .eq("id", userId)
        .eq("room_id", roomId)

      if (error) throw error
    } else {
      // Insert new user
      const { error } = await supabase.from("users").insert({
        id: userId,
        room_id: roomId,
        team_id: null,
        is_auctioneer: true,
        is_ready: false,
      })

      if (error) throw error
    }

    return true
  } catch (error) {
    console.error("Error selecting auctioneer:", error)
    throw error
  }
}

export const setUserReady = async (roomId: string, userId: string) => {
  try {
    const { error } = await supabase.from("users").update({ is_ready: true }).eq("id", userId).eq("room_id", roomId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error setting user ready:", error)
    throw error
  }
}

export const subscribeToTeams = (roomId: string, callback: (teams: Team[]) => void) => {
  const subscription = supabase
    .channel(`teams:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "teams",
        filter: `room_id=eq.${roomId}`,
      },
      () => {
        // When changes occur, fetch the latest data
        supabase
          .from("teams")
          .select("*")
          .eq("room_id", roomId)
          .then(({ data, error }) => {
            if (!error && data) {
              callback(data as Team[])
            }
          })
      },
    )
    .subscribe()

  // Also fetch the initial data
  supabase
    .from("teams")
    .select("*")
    .eq("room_id", roomId)
    .then(({ data, error }) => {
      if (!error && data) {
        callback(data as Team[])
      }
    })

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription)
  }
}

// Player related functions
export const initializePlayers = async (roomId: string, players: Player[]) => {
  try {
    const playersToInsert = players.map((player) => ({
      id: player.id,
      room_id: roomId,
      name: player.name,
      role: player.role,
      base_price: player.basePrice,
      base_price_value: player.basePriceValue,
      status: "Pending",
    }))

    // Insert in batches to avoid payload size limits
    const batchSize = 100
    for (let i = 0; i < playersToInsert.length; i += batchSize) {
      const batch = playersToInsert.slice(i, i + batchSize)
      const { error } = await supabase.from("players").insert(batch)

      if (error) throw error
    }
  } catch (error) {
    console.error("Error initializing players:", error)
    throw error
  }
}

export const updatePlayerStatus = async (
  roomId: string,
  playerId: number,
  status: "Pending" | "Current" | "Sold" | "Unsold",
  teamId?: number,
  soldFor?: string,
  soldForValue?: number,
) => {
  try {
    const updateData: any = { status }

    if (status === "Sold" && teamId !== undefined) {
      updateData.team_id = teamId
      updateData.sold_for = soldFor
      updateData.sold_for_value = soldForValue

      // Also update the team
      if (teamId && soldForValue) {
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("spent, players")
          .eq("id", teamId)
          .eq("room_id", roomId)
          .single()

        if (teamError) throw teamError

        const { error: updateError } = await supabase
          .from("teams")
          .update({
            spent: (teamData.spent || 0) + soldForValue,
          })
          .eq("id", teamId)
          .eq("room_id", roomId)

        if (updateError) throw updateError
      }
    }

    const { error } = await supabase.from("players").update(updateData).eq("id", playerId).eq("room_id", roomId)

    if (error) throw error
  } catch (error) {
    console.error("Error updating player status:", error)
    throw error
  }
}

export const subscribeToPlayers = (roomId: string, callback: (players: Player[]) => void) => {
  const subscription = supabase
    .channel(`players:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "players",
        filter: `room_id=eq.${roomId}`,
      },
      () => {
        // When changes occur, fetch the latest data
        supabase
          .from("players")
          .select("*")
          .eq("room_id", roomId)
          .then(({ data, error }) => {
            if (!error && data) {
              callback(data as Player[])
            }
          })
      },
    )
    .subscribe()

  // Also fetch the initial data
  supabase
    .from("players")
    .select("*")
    .eq("room_id", roomId)
    .then(({ data, error }) => {
      if (!error && data) {
        callback(data as Player[])
      }
    })

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription)
  }
}

// Auction related functions
export const startAuction = async (roomId: string) => {
  try {
    // Get the first pending player
    const { data: pendingPlayers, error: playersError } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", roomId)
      .eq("status", "Pending")
      .order("id", { ascending: true })
      .limit(1)

    if (playersError) throw playersError
    if (!pendingPlayers || pendingPlayers.length === 0) {
      throw new Error("No pending players found")
    }

    const firstPlayer = pendingPlayers[0]

    // Update room state
    const { error: roomError } = await supabase
      .from("rooms")
      .update({
        auction_started: true,
        current_player_id: firstPlayer.id,
        current_bid: firstPlayer.base_price,
        current_bid_value: firstPlayer.base_price_value,
        current_bidder: "",
        is_timer_running: true,
      })
      .eq("id", roomId)

    if (roomError) throw roomError

    // Update player status
    await updatePlayerStatus(roomId, firstPlayer.id, "Current")

    // Add starting bid to bids collection
    const { error: bidError } = await supabase.from("bids").insert({
      room_id: roomId,
      message: `Starting bid for ${firstPlayer.name}: ${firstPlayer.base_price}`,
    })

    if (bidError) throw bidError

    // Initialize timer
    await setupTimer(roomId)

    return true
  } catch (error) {
    console.error("Error starting auction:", error)
    throw error
  }
}

export const placeBid = async (roomId: string, teamId: number, teamName: string, amount: string, bidValue: number) => {
  try {
    // Get current room data
    const { data: roomData, error: roomError } = await supabase.from("rooms").select("*").eq("id", roomId).single()

    if (roomError) throw roomError

    if (!roomData.is_timer_running || bidValue <= roomData.current_bid_value) {
      throw new Error("Invalid bid")
    }

    // Update room state
    const { error: updateError } = await supabase
      .from("rooms")
      .update({
        current_bid: amount,
        current_bid_value: bidValue,
        current_bidder: teamName,
        is_timer_running: true, // Reset timer
      })
      .eq("id", roomId)

    if (updateError) throw updateError

    // Add bid to bids collection
    const { error: bidError } = await supabase.from("bids").insert({
      room_id: roomId,
      message: `${teamName} bid ${amount}`,
      team_id: teamId,
      team_name: teamName,
      amount,
      bid_value: bidValue,
    })

    if (bidError) throw bidError

    // Reset timer
    await resetTimer(roomId)

    return true
  } catch (error) {
    console.error("Error placing bid:", error)
    throw error
  }
}

export const handleTimerEnd = async (roomId: string) => {
  try {
    // Get current room data
    const { data: roomData, error: roomError } = await supabase.from("rooms").select("*").eq("id", roomId).single()

    if (roomError) throw roomError

    const currentPlayerId = roomData.current_player_id

    if (!currentPlayerId) {
      throw new Error("No current player")
    }

    // Get current player
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("id", currentPlayerId)
      .eq("room_id", roomId)
      .single()

    if (playerError) throw playerError

    if (roomData.current_bidder) {
      // Player sold
      const soldMessage = `${playerData.name} sold to ${roomData.current_bidder} for ${roomData.current_bid}`

      // Add message to bids
      const { error: bidError } = await supabase.from("bids").insert({
        room_id: roomId,
        message: soldMessage,
      })

      if (bidError) throw bidError

      // Find team ID by name
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .eq("name", roomData.current_bidder)
        .eq("room_id", roomId)
        .single()

      if (teamError) throw teamError

      // Update player status
      await updatePlayerStatus(
        roomId,
        currentPlayerId,
        "Sold",
        teamData.id,
        roomData.current_bid,
        roomData.current_bid_value,
      )
    } else {
      // No bids, player unsold
      const unsoldMessage = `${playerData.name} unsold`

      // Add message to bids
      const { error: bidError } = await supabase.from("bids").insert({
        room_id: roomId,
        message: unsoldMessage,
      })

      if (bidError) throw bidError

      // Update player status
      await updatePlayerStatus(roomId, currentPlayerId, "Unsold")
    }

    // Stop timer
    const { error: timerError } = await supabase
      .from("rooms")
      .update({
        is_timer_running: false,
      })
      .eq("id", roomId)

    if (timerError) throw timerError

    await stopTimer(roomId)

    return true
  } catch (error) {
    console.error("Error handling timer end:", error)
    throw error
  }
}

export const moveToNextPlayer = async (roomId: string) => {
  try {
    // Get next pending player
    const { data: pendingPlayers, error: playersError } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", roomId)
      .eq("status", "Pending")
      .order("id", { ascending: true })
      .limit(1)

    if (playersError) throw playersError

    if (!pendingPlayers || pendingPlayers.length === 0) {
      // No more pending players, auction complete
      const { error: roomError } = await supabase
        .from("rooms")
        .update({
          status: "completed",
        })
        .eq("id", roomId)

      if (roomError) throw roomError

      const { error: bidError } = await supabase.from("bids").insert({
        room_id: roomId,
        message: "Auction complete!",
      })

      if (bidError) throw bidError

      return false
    }

    const nextPlayer = pendingPlayers[0]

    // Update room state
    const { error: roomError } = await supabase
      .from("rooms")
      .update({
        current_player_id: nextPlayer.id,
        current_bid: nextPlayer.base_price,
        current_bid_value: nextPlayer.base_price_value,
        current_bidder: "",
        is_timer_running: true,
      })
      .eq("id", roomId)

    if (roomError) throw roomError

    // Update player status
    await updatePlayerStatus(roomId, nextPlayer.id, "Current")

    // Add starting bid to bids collection
    const { error: bidError } = await supabase.from("bids").insert({
      room_id: roomId,
      message: `Starting bid for ${nextPlayer.name}: ${nextPlayer.base_price}`,
    })

    if (bidError) throw bidError

    // Reset timer
    await resetTimer(roomId)

    return true
  } catch (error) {
    console.error("Error moving to next player:", error)
    throw error
  }
}

export const subscribeToBids = (roomId: string, callback: (bids: any[]) => void) => {
  const subscription = supabase
    .channel(`bids:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bids",
        filter: `room_id=eq.${roomId}`,
      },
      () => {
        // When changes occur, fetch the latest data
        supabase
          .from("bids")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: false })
          .then(({ data, error }) => {
            if (!error && data) {
              callback(data)
            }
          })
      },
    )
    .subscribe()

  // Also fetch the initial data
  supabase
    .from("bids")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (!error && data) {
        callback(data)
      }
    })

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription)
  }
}

// Timer related functions
export const setupTimer = async (roomId: string) => {
  try {
    // Check if timer already exists
    const { data: existingTimer } = await supabase.from("timers").select("*").eq("room_id", roomId).single()

    if (existingTimer) {
      // Update existing timer
      const { error } = await supabase
        .from("timers")
        .update({
          timer_key: Date.now(),
          timer_running: true,
          timer_seconds: 10,
          last_updated: new Date().toISOString(),
        })
        .eq("room_id", roomId)

      if (error) throw error
    } else {
      // Create new timer
      const { error } = await supabase.from("timers").insert({
        id: uuidv4(),
        room_id: roomId,
        timer_key: Date.now(),
        timer_running: true,
        timer_seconds: 10,
        last_updated: new Date().toISOString(),
      })

      if (error) throw error
    }
  } catch (error) {
    console.error("Error setting up timer:", error)
    throw error
  }
}

export const resetTimer = async (roomId: string) => {
  try {
    const { error } = await supabase
      .from("timers")
      .update({
        timer_key: Date.now(),
        timer_running: true,
        timer_seconds: 10,
        last_updated: new Date().toISOString(),
      })
      .eq("room_id", roomId)

    if (error) throw error
  } catch (error) {
    console.error("Error resetting timer:", error)
    throw error
  }
}

export const startTimer = async (roomId: string) => {
  try {
    const { error: timerError } = await supabase
      .from("timers")
      .update({
        timer_running: true,
        last_updated: new Date().toISOString(),
      })
      .eq("room_id", roomId)

    if (timerError) throw timerError

    const { error: roomError } = await supabase
      .from("rooms")
      .update({
        is_timer_running: true,
      })
      .eq("id", roomId)

    if (roomError) throw roomError
  } catch (error) {
    console.error("Error starting timer:", error)
    throw error
  }
}

export const stopTimer = async (roomId: string) => {
  try {
    const { error: timerError } = await supabase
      .from("timers")
      .update({
        timer_running: false,
        last_updated: new Date().toISOString(),
      })
      .eq("room_id", roomId)

    if (timerError) throw timerError

    const { error: roomError } = await supabase
      .from("rooms")
      .update({
        is_timer_running: false,
      })
      .eq("id", roomId)

    if (roomError) throw roomError
  } catch (error) {
    console.error("Error stopping timer:", error)
    throw error
  }
}

export const subscribeToTimer = (roomId: string, callback: (data: any) => void) => {
  const subscription = supabase
    .channel(`timer:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "timers",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()

  // Also fetch the initial data
  supabase
    .from("timers")
    .select("*")
    .eq("room_id", roomId)
    .single()
    .then(({ data, error }) => {
      if (!error && data) {
        callback(data)
      }
    })

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription)
  }
}

export const setupRealtimeAuction = async (roomId: string) => {
  // This function might be empty as the realtime setup is already handled by the individual subscribe functions.
  // However, you can add any additional setup logic here if needed.
  console.log(`Setting up realtime auction for room: ${roomId}`)
}

