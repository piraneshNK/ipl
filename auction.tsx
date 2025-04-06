"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { players, teams, formatPrice, type Player, type Team } from "./players"

// Bid amounts
const bidAmounts = ["₹5L", "₹10L", "₹25L", "₹50L", "₹1Cr"]

export default function AuctionPage() {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentBid, setCurrentBid] = useState("")
  const [currentBidValue, setCurrentBidValue] = useState(0)
  const [currentBidder, setCurrentBidder] = useState("")
  const [bids, setBids] = useState<string[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>(teams)
  const [boughtPlayers, setBoughtPlayers] = useState<Player[]>([])
  const [timerKey, setTimerKey] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [teamName, setTeamName] = useState("")
  const [userTeam, setUserTeam] = useState<Team | null>(null)
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would fetch this from a database or state management
    const storedRoomName = localStorage.getItem("roomName")
    const storedTeamId = localStorage.getItem("selectedTeam")

    if (!storedRoomName) {
      router.push("/")
      return
    }

    // Find the user's team
    if (storedTeamId) {
      const teamId = Number.parseInt(storedTeamId)
      const team = allTeams.find((t) => t.id === teamId)
      if (team) {
        setUserTeam(team)
        setTeamName(team.name)
      } else {
        // Default team if not found
        setTeamName("Mumbai")
      }
    } else {
      // Default team if not selected
      setTeamName("Mumbai")
    }

    // Initialize with base price as current bid
    const startingBid = formatPrice(players[currentPlayerIndex].basePriceValue)
    setCurrentBid(startingBid)
    setCurrentBidValue(players[currentPlayerIndex].basePriceValue)
    setBids([`Starting bid: ${startingBid}`])
  }, [router, currentPlayerIndex, allTeams])

  // Convert bid amount string to number value
  const getBidValue = (bidAmount: string): number => {
    if (bidAmount.includes("Cr")) {
      return Number.parseFloat(bidAmount.replace("₹", "").replace("Cr", "")) * 100
    } else if (bidAmount.includes("L")) {
      return Number.parseFloat(bidAmount.replace("₹", "").replace("L", ""))
    }
    return 0
  }

  const handleBid = (amount: string) => {
    const bidValue = getBidValue(amount)

    // Check if user's team has enough purse left
    if (userTeam && userTeam.purse - userTeam.spent < bidValue) {
      setBids([`Not enough funds to bid ${amount}`, ...bids])
      return
    }

    const newBid = `${teamName} bid ${amount}`
    setBids([newBid, ...bids])
    setCurrentBid(amount)
    setCurrentBidValue(bidValue)
    setCurrentBidder(teamName)

    // Reset timer when a bid is placed
    setTimerKey((prev) => prev + 1)
    setIsTimerRunning(true)
  }

  // Use useCallback to memoize the function to prevent unnecessary re-renders
  const handleTimerEnd = useCallback(() => {
    if (currentBidder) {
      // Player sold
      const currentPlayer = players[currentPlayerIndex]
      const soldMessage = `${currentPlayer.name} sold to ${currentBidder} for ${currentBid}`
      setBids((prevBids) => [soldMessage, ...prevBids])

      // Update team data
      setAllTeams((prevTeams) => {
        return prevTeams.map((team) => {
          if (team.name === currentBidder) {
            // Add player to team and update spent amount
            const updatedPlayer = {
              ...currentPlayer,
              team: team.name,
              soldFor: currentBid,
              soldForValue: currentBidValue,
              status: "Sold" as const,
            }

            return {
              ...team,
              spent: team.spent + currentBidValue,
              players: [...team.players, updatedPlayer],
            }
          }
          return team
        })
      })

      // Add to bought players
      const soldPlayer = {
        ...currentPlayer,
        soldFor: currentBid,
        soldForValue: currentBidValue,
        team: currentBidder,
        status: "Sold" as const,
      }

      setBoughtPlayers((prevPlayers) => [...prevPlayers, soldPlayer])

      // Move to next player
      setTimeout(() => {
        if (currentPlayerIndex < players.length - 1) {
          setCurrentPlayerIndex((prevIndex) => prevIndex + 1)
          setCurrentBid("")
          setCurrentBidValue(0)
          setCurrentBidder("")
          setTimerKey((prev) => prev + 1)
          setIsTimerRunning(true)
        } else {
          // Auction complete
          setBids((prevBids) => ["Auction complete!", ...prevBids])
          setIsTimerRunning(false)
        }
      }, 2000)
    } else {
      // No bids, player unsold
      const unsoldMessage = `${players[currentPlayerIndex].name} unsold`
      setBids((prevBids) => [unsoldMessage, ...prevBids])

      // Move to next player
      setTimeout(() => {
        if (currentPlayerIndex < players.length - 1) {
          setCurrentPlayerIndex((prevIndex) => prevIndex + 1)
          setTimerKey((prev) => prev + 1)
          setIsTimerRunning(true)
        } else {
          // Auction complete
          setBids((prevBids) => ["Auction complete!", ...prevBids])
          setIsTimerRunning(false)
        }
      }, 2000)
    }
  }, [currentBidder, currentBid, currentBidValue, currentPlayerIndex])

  // Format purse amount for display
  const formatPurseDisplay = (amount: number) => {
    return `${(amount / 100).toFixed(2)}Cr`
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Player info and bidding */}
        <div className="lg:col-span-2">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Player Auction</CardTitle>
            </CardHeader>
            <CardContent>
              {currentPlayerIndex < players.length && (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <h2 className="text-2xl font-bold">{players[currentPlayerIndex].name}</h2>
                        <div className="flex justify-center space-x-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          >
                            {players[currentPlayerIndex].role}
                          </Badge>
                          <Badge variant="outline">Base Price: {players[currentPlayerIndex].basePrice}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-4 text-center">
                    <div className="text-center mb-2">
                      <span className="text-2xl font-bold">10</span>
                    </div>
                    <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    {currentBidder ? (
                      <p className="font-medium">
                        Current Bid: {currentBid} by {currentBidder}
                      </p>
                    ) : (
                      <p className="font-medium">Starting Bid: {currentBid}</p>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-2">
                    {bidAmounts.map((amount, index) => {
                      const bidValue = getBidValue(amount)
                      const isDisabled =
                        !isTimerRunning ||
                        bidValue <= currentBidValue ||
                        (userTeam && userTeam.purse - userTeam.spent < bidValue)

                      return (
                        <Button
                          key={index}
                          onClick={() => handleBid(amount)}
                          disabled={isDisabled}
                          variant={isDisabled ? "outline" : "default"}
                          className="w-full"
                        >
                          {amount}
                        </Button>
                      )
                    })}
                  </div>
                </>
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
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Team:</span>
                      <span className="font-bold">{teamName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purse Left:</span>
                      <span className="font-bold">
                        {userTeam ? formatPurseDisplay(userTeam.purse - userTeam.spent) : "100.00Cr"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spent:</span>
                      <span className="font-bold">{userTeam ? formatPurseDisplay(userTeam.spent) : "0.00Cr"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Players Bought:</span>
                      <span className="font-bold">{userTeam ? userTeam.players.length : 0}</span>
                    </div>
                  </div>
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
                      bids.map((bid, index) => (
                        <div key={index} className="p-2 border-b">
                          {bid}
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
                    {boughtPlayers.length > 0 ? (
                      boughtPlayers.map((player) => (
                        <div key={player.id} className="p-2 border-b flex justify-between">
                          <div>
                            <span className="font-medium">{player.name}</span>
                            <div className="text-sm text-muted-foreground">{player.team}</div>
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
                      <Card key={team.id} className="overflow-hidden">
                        <div className={`h-2 bg-${team.color}-500`} />
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{team.name}</h3>
                            <span className="text-sm">{team.players.length} Players</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Purse Left:</span>
                              <span className="font-medium">{formatPurseDisplay(team.purse - team.spent)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Total Spent:</span>
                              <span className="font-medium">{formatPurseDisplay(team.spent)}</span>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full"
                                style={{ width: `${(team.spent / team.purse) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>0%</span>
                              <span>Spent: {((team.spent / team.purse) * 100).toFixed(1)}%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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

