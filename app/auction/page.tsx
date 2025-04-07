"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlayerCard from "@/components/player-card"
import BidButton from "@/components/bid-button"
import Timer from "@/components/timer"
import TeamPurseCard from "@/components/team-purse-card"
import { formatPrice, type Player, type Team } from "@/data/players"
import { useAuth } from "@/hooks/use-auth"
import {
  subscribeToRoom,
  subscribeToTeams,
  subscribeToPlayers,
  subscribeToBids,
  subscribeToTimer,
  placeBid,
} from "@/services/auction-service"
import { useToast } from "@/components/ui/use-toast"

// Bid amounts
const bidAmounts = ["₹5L", "₹10L", "₹25L", "₹50L", "₹1Cr"]

export default function AuctionPage() {
  const [roomId, setRoomId] = useState("")
  const [roomData, setRoomData] = useState<any>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [bids, setBids] = useState<any[]>([])
  const [timerData, setTimerData] = useState<any>(null)
  const [userTeam, setUserTeam] = useState<Team | null>(null)
  const [teamId, setTeamId] = useState<number | null>(null)

  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  // Get bid value from string
  const getBidValue = (bidAmount: string): number => {
    if (bidAmount.includes("Cr")) {
      return Number.parseFloat(bidAmount.replace("₹", "").replace("Cr", "")) * 100
    } else if (bidAmount.includes("L")) {
      return Number.parseFloat(bidAmount.replace("₹", "").replace("L", ""))
    }
    return 0
  }

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Get room ID from localStorage
    const storedRoomId = localStorage.getItem("roomId")
    const storedTeamId = localStorage.getItem("selectedTeam")

    if (!storedRoomId) {
      router.push("/")
      return
    }

    setRoomId(storedRoomId)

    if (storedTeamId) {
      setTeamId(Number.parseInt(storedTeamId))
    }

    // Subscribe to room data
    const unsubscribeRoom = subscribeToRoom(storedRoomId, (data) => {
      setRoomData(data)
    })

    // Subscribe to teams
    const unsubscribeTeams = subscribeToTeams(storedRoomId, (teams) => {
      setAllTeams(teams)

      // Find user's team
      if (storedTeamId) {
        const teamId = Number.parseInt(storedTeamId)
        const team = teams.find((t) => t.id === teamId)
        if (team) {
          setUserTeam(team)
        }
      }
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

  const handleBid = async (amount: string) => {
    if (!user || !userTeam || !currentPlayer) return

    const bidValue = getBidValue(amount)

    // Check if user's team has enough purse left
    if (userTeam.purse - userTeam.spent < bidValue) {
      toast({
        title: "Insufficient Funds",
        description: `Not enough funds to bid ${amount}`,
        variant: "destructive",
      })
      return
    }

    // Check if bid is higher than current bid
    if (bidValue <= roomData?.currentBidValue) {
      toast({
        title: "Invalid Bid",
        description: "Your bid must be higher than the current bid",
        variant: "destructive",
      })
      return
    }

    try {
      await placeBid(roomId, userTeam.id, userTeam.name, amount, bidValue)

      toast({
        title: "Bid Placed",
        description: `You bid ${amount} for ${currentPlayer.name}`,
      })
    } catch (error) {
      console.error("Error placing bid:", error)
      toast({
        title: "Error",
        description: "Failed to place bid",
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Player info and bidding */}
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">IPL Player Auction</CardTitle>
            </CardHeader>
            <CardContent>
              {currentPlayer ? (
                <>
                  <PlayerCard player={currentPlayer} />

                  <div className="mt-4 flex justify-center">
                    <Timer
                      key={timerData?.timerKey}
                      seconds={timerData?.timerSeconds || 10}
                      onTimerEnd={() => {}} // Timer end is handled by the server
                      isRunning={timerData?.timerRunning || false}
                    />
                  </div>

                  <div className="mt-4 text-center">
                    {roomData?.currentBidder ? (
                      <p className="font-medium">
                        Current Bid: {roomData.currentBid} by {roomData.currentBidder}
                      </p>
                    ) : (
                      <p className="font-medium">Starting Bid: {currentPlayer.basePrice}</p>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-2">
                    {bidAmounts.map((amount, index) => {
                      const bidValue = getBidValue(amount)
                      const isDisabled =
                        !timerData?.timerRunning ||
                        bidValue <= roomData?.currentBidValue ||
                        (userTeam && userTeam.purse - userTeam.spent < bidValue)

                      return <BidButton key={index} amount={amount} onBid={handleBid} disabled={isDisabled} />
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <p>Waiting for auction to start...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs for Team Info, Live Bids, Bought Players, All Teams */}
        <div>
          <Tabs defaultValue="team-info" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="team-info">Team</TabsTrigger>
              <TabsTrigger value="live-bids">Bids</TabsTrigger>
              <TabsTrigger value="bought-players">Players</TabsTrigger>
              <TabsTrigger value="all-teams">All Teams</TabsTrigger>
            </TabsList>

            {/* Team Info Tab */}
            <TabsContent value="team-info">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Team Info</CardTitle>
                </CardHeader>
                <CardContent>
                  {userTeam ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Team:</span>
                        <span className="font-bold">{userTeam.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Purse Left:</span>
                        <span className="font-bold">{formatPrice(userTeam.purse - userTeam.spent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Spent:</span>
                        <span className="font-bold">{formatPrice(userTeam.spent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Players Bought:</span>
                        <span className="font-bold">{userTeam.players?.length || 0}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p>No team selected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Live Bids Tab */}
            <TabsContent value="live-bids">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Live Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] overflow-y-auto space-y-2">
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

            {/* Bought Players Tab */}
            <TabsContent value="bought-players">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Bought Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] overflow-y-auto space-y-2">
                    {allPlayers.filter((p) => p.status === "Sold").length > 0 ? (
                      allPlayers
                        .filter((p) => p.status === "Sold")
                        .map((player) => (
                          <div key={player.id} className="p-2 border-b flex justify-between">
                            <div>
                              <span className="font-medium">{player.name}</span>
                              <div className="text-sm text-muted-foreground">
                                {allTeams.find((t) => t.id === player.teamId)?.name}
                              </div>
                            </div>
                            <Badge>{player.soldFor}</Badge>
                          </div>
                        ))
                    ) : (
                      <div className="text-center text-muted-foreground">No players bought yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Teams Tab */}
            <TabsContent value="all-teams">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">All Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] overflow-y-auto space-y-4">
                    {allTeams.map((team) => (
                      <TeamPurseCard key={team.id} team={team} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

