"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlayerCard from "@/components/player-card"
import Timer from "@/components/timer"
import { formatPrice, type Player, type Team } from "@/data/players"
import { useAuth } from "@/hooks/use-auth"
import {
  subscribeToRoom,
  subscribeToTeams,
  subscribeToPlayers,
  subscribeToBids,
  subscribeToTimer,
  startAuction,
  handleTimerEnd,
  moveToNextPlayer,
  startTimer,
  stopTimer,
} from "@/services/auction-service"
import { useToast } from "@/components/ui/use-toast"

export default function AuctioneerPage() {
  const [roomId, setRoomId] = useState("")
  const [roomData, setRoomData] = useState<any>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [timerData, setTimerData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Get room ID from localStorage
    const storedRoomId = localStorage.getItem("roomId")
    const storedIsAuctioneer = localStorage.getItem("isAuctioneer") === "true"

    if (!storedRoomId || !storedIsAuctioneer) {
      router.push("/")
      return
    }

    setRoomId(storedRoomId)

    // Subscribe to room data
    const unsubscribeRoom = subscribeToRoom(storedRoomId, (data) => {
      setRoomData(data)
    })

    // Subscribe to teams
    const unsubscribeTeams = subscribeToTeams(storedRoomId, (teams) => {
      setAllTeams(teams)
    })

    // Subscribe to players
    const unsubscribePlayers = subscribeToPlayers(storedRoomId, (players) => {
      setAllPlayers(players)

      // Find current player
      const current = players.find((p) => p.status === "Current")
      if (current) {
        setCurrentPlayer(current)
      }
    })

    // Subscribe to bids
    const unsubscribeBids = subscribeToBids(storedRoomId, (bids) => {
      setBids(bids)
    })

    // Subscribe to timer
    const unsubscribeTimer = subscribeToTimer(storedRoomId, (data) => {
      setTimerData(data)
    })

    return () => {
      unsubscribeRoom()
      unsubscribeTeams()
      unsubscribePlayers()
      unsubscribeBids()
      unsubscribeTimer()
    }
  }, [router, user, loading])

  const handleStartAuction = async () => {
    if (!roomId) return

    setIsLoading(true)
    try {
      await startAuction(roomId)

      toast({
        title: "Auction Started",
        description: "The auction has begun!",
      })
    } catch (error) {
      console.error("Error starting auction:", error)
      toast({
        title: "Error",
        description: "Failed to start auction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextPlayer = async () => {
    if (!roomId) return

    setIsLoading(true)
    try {
      // First handle the current player's timer end if it's still running
      if (timerData?.timerRunning) {
        await handleTimerEnd(roomId)
      }

      // Then move to the next player
      const success = await moveToNextPlayer(roomId)

      if (success) {
        toast({
          title: "Next Player",
          description: "Moving to the next player",
        })
      } else {
        toast({
          title: "Auction Complete",
          description: "All players have been auctioned",
        })
      }
    } catch (error) {
      console.error("Error moving to next player:", error)
      toast({
        title: "Error",
        description: "Failed to move to next player",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopTimer = async () => {
    if (!roomId) return

    try {
      await stopTimer(roomId)

      toast({
        title: "Timer Stopped",
        description: "The timer has been paused",
      })
    } catch (error) {
      console.error("Error stopping timer:", error)
      toast({
        title: "Error",
        description: "Failed to stop timer",
        variant: "destructive",
      })
    }
  }

  const handleStartTimer = async () => {
    if (!roomId) return

    try {
      await startTimer(roomId)

      toast({
        title: "Timer Started",
        description: "The timer has been started",
      })
    } catch (error) {
      console.error("Error starting timer:", error)
      toast({
        title: "Error",
        description: "Failed to start timer",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">IPL Auctioneer Control Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Room ID: {roomId}</p>

          {!roomData?.auctionStarted ? (
            <div className="text-center">
              <Button onClick={handleStartAuction} size="lg" disabled={isLoading}>
                {isLoading ? "Starting..." : "Start Auction"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left column - Current player */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Player</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentPlayer ? (
                      <>
                        <PlayerCard player={currentPlayer} />

                        <div className="mt-4 flex justify-center">
                          <Timer
                            key={timerData?.timerKey}
                            seconds={timerData?.timerSeconds || 10}
                            onTimerEnd={() => handleTimerEnd(roomId)}
                            isRunning={timerData?.timerRunning || false}
                          />
                        </div>

                        <div className="mt-4 flex justify-center">
                          {roomData?.currentBidder ? (
                            <div className="text-center mb-4">
                              <p>
                                Current Bid: {roomData.currentBid} by {roomData.currentBidder}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center mb-4">
                              <p>Starting Bid: {currentPlayer.basePrice}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex justify-center space-x-2">
                          <Button onClick={handleNextPlayer} disabled={isLoading}>
                            {isLoading ? "Processing..." : "Next Player"}
                          </Button>

                          {timerData?.timerRunning ? (
                            <Button onClick={handleStopTimer} variant="outline">
                              Pause Timer
                            </Button>
                          ) : (
                            <Button onClick={handleStartTimer} variant="outline">
                              Resume Timer
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <p>Auction Complete</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Tabs */}
              <div>
                <Tabs defaultValue="live-bids">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="live-bids">Bids</TabsTrigger>
                    <TabsTrigger value="team-purse">Teams</TabsTrigger>
                  </TabsList>

                  <TabsContent value="live-bids">
                    <Card>
                      <CardHeader>
                        <CardTitle>Live Bids</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] overflow-y-auto space-y-2">
                          {bids.length > 0 ? (
                            bids.map((bid) => (
                              <div key={bid.id} className="p-2 border-b">
                                {bid.message}
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-muted-foreground">No bids yet</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="team-purse">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Purse</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] overflow-y-auto space-y-2">
                          {allTeams.map((team) => (
                            <div key={team.id} className="p-2 border-b flex justify-between">
                              <span>{team.shortName}</span>
                              <span>{formatPrice(team.purse - team.spent)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player list */}
      <Card>
        <CardHeader>
          <CardTitle>Player List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPlayers.slice(0, 50).map((player) => {
                  return (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{player.role}</TableCell>
                      <TableCell>{player.basePrice}</TableCell>
                      <TableCell>
                        {player.status === "Current" ? (
                          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                            Current
                          </Badge>
                        ) : player.status === "Unsold" ? (
                          <Badge variant="outline" className="bg-red-100 dark:bg-red-900">
                            Unsold
                          </Badge>
                        ) : player.status === "Sold" ? (
                          <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                            Sold
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

