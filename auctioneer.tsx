"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { players, teams, formatPrice, type Player, type Team } from "./players"

export default function AuctioneerPage() {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1)
  const [auctionStarted, setAuctionStarted] = useState(false)
  const [currentBid, setCurrentBid] = useState("")
  const [currentBidValue, setCurrentBidValue] = useState(0)
  const [currentBidder, setCurrentBidder] = useState("")
  const [bids, setBids] = useState<string[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>(teams)
  const [soldPlayers, setSoldPlayers] = useState<Player[]>([])
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([])
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [selectedTeamForSale, setSelectedTeamForSale] = useState("")
  const [customBidAmount, setCustomBidAmount] = useState("")
  const [timerKey, setTimerKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would fetch this from a database or state management
    const storedRoomName = localStorage.getItem("roomName")
    const storedIsAuctioneer = localStorage.getItem("isAuctioneer") === "true"

    if (!storedRoomName || !storedIsAuctioneer) {
      router.push("/")
      return
    }

    setRoomName(storedRoomName)
  }, [router])

  const startAuction = () => {
    setAuctionStarted(true)
    setCurrentPlayerIndex(0)

    // Set initial bid to base price
    const startingBid = formatPrice(players[0].basePriceValue)
    setCurrentBid(startingBid)
    setCurrentBidValue(players[0].basePriceValue)

    setIsTimerRunning(true)
    setBids(["Auction started!", `Starting bid for ${players[0].name}: ${startingBid}`])
  }

  const handleSkipPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      const skipMessage = `${players[currentPlayerIndex].name} skipped`
      setBids((prevBids) => [skipMessage, ...prevBids])
      moveToNextPlayer()
    }
  }

  const handleStopAuction = () => {
    setIsTimerRunning(false)
    setBids((prevBids) => ["Auction paused", ...prevBids])
  }

  const handleResumeAuction = () => {
    setIsTimerRunning(true)
    setBids((prevBids) => ["Auction resumed", ...prevBids])
  }

  const handleMarkAsSold = () => {
    if (!currentBidder || !selectedTeamForSale) {
      return
    }

    const currentPlayer = players[currentPlayerIndex]
    let bidValue = currentBidValue

    // If custom bid amount is provided, use it
    if (customBidAmount) {
      if (customBidAmount.includes("Cr")) {
        bidValue = Number.parseFloat(customBidAmount.replace("Cr", "")) * 100
      } else if (customBidAmount.includes("L")) {
        bidValue = Number.parseFloat(customBidAmount.replace("L", ""))
      } else {
        bidValue = Number.parseFloat(customBidAmount)
      }
    }

    const formattedBid = formatPrice(bidValue)
    const soldMessage = `${currentPlayer.name} sold to ${selectedTeamForSale} for ${formattedBid}`
    setBids((prevBids) => [soldMessage, ...prevBids])

    // Update team data
    setAllTeams((prevTeams) => {
      return prevTeams.map((team) => {
        if (team.name === selectedTeamForSale) {
          // Add player to team and update spent amount
          const updatedPlayer = {
            ...currentPlayer,
            team: team.name,
            soldFor: formattedBid,
            soldForValue: bidValue,
            status: "Sold" as const,
          }

          return {
            ...team,
            spent: team.spent + bidValue,
            players: [...team.players, updatedPlayer],
          }
        }
        return team
      })
    })

    // Add to sold players
    const soldPlayer = {
      ...currentPlayer,
      soldFor: formattedBid,
      soldForValue: bidValue,
      team: selectedTeamForSale,
      status: "Sold" as const,
    }

    setSoldPlayers((prevPlayers) => [...prevPlayers, soldPlayer])

    // Reset fields and move to next player
    setSelectedTeamForSale("")
    setCustomBidAmount("")
    moveToNextPlayer()
  }

  const handleMarkAsUnsold = () => {
    const currentPlayer = players[currentPlayerIndex]
    const unsoldMessage = `${currentPlayer.name} unsold`
    setBids((prevBids) => [unsoldMessage, ...prevBids])

    // Add to unsold players
    setUnsoldPlayers((prevPlayers) => [
      ...prevPlayers,
      {
        ...currentPlayer,
        status: "Unsold" as const,
      },
    ])

    moveToNextPlayer()
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

      // Add to sold players
      const soldPlayer = {
        ...currentPlayer,
        soldFor: currentBid,
        soldForValue: currentBidValue,
        team: currentBidder,
        status: "Sold" as const,
      }

      setSoldPlayers((prevPlayers) => [...prevPlayers, soldPlayer])
    } else {
      // No bids, player unsold
      const unsoldMessage = `${players[currentPlayerIndex].name} unsold`
      setBids((prevBids) => [unsoldMessage, ...prevBids])
    }

    setIsTimerRunning(false)
  }, [currentBidder, currentBid, currentBidValue, currentPlayerIndex])

  const moveToNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      const nextIndex = currentPlayerIndex + 1
      setCurrentPlayerIndex(nextIndex)

      // Set initial bid to base price
      const startingBid = formatPrice(players[nextIndex].basePriceValue)
      setCurrentBid(startingBid)
      setCurrentBidValue(players[nextIndex].basePriceValue)

      setCurrentBidder("")
      setTimerKey((prev) => prev + 1)
      setIsTimerRunning(true)

      // Add starting bid message
      setBids((prevBids) => [`Starting bid for ${players[nextIndex].name}: ${startingBid}`, ...prevBids])
    } else {
      // Auction complete
      setBids((prevBids) => ["Auction complete!", ...prevBids])
    }
  }

  // Simulate receiving bids (in a real app, this would come from a websocket)
  useEffect(() => {
    if (!isTimerRunning || currentPlayerIndex < 0) return

    const teamNames = allTeams.map((t) => t.name)
    const amounts = ["₹5L", "₹10L", "₹25L", "₹50L", "₹1Cr"]
    const bidValues = [5, 10, 25, 50, 100]

    const bidInterval = setInterval(() => {
      // Randomly select a team that has enough funds
      const eligibleTeams = allTeams.filter((team) => team.purse - team.spent >= currentBidValue)

      if (eligibleTeams.length === 0) {
        clearInterval(bidInterval)
        return
      }

      const randomTeam = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)]

      // Find a valid bid amount (higher than current bid)
      const validBidIndices = bidValues.findIndex((value) => value > currentBidValue)
      if (validBidIndices === -1) return

      const randomBidIndex = validBidIndices + Math.floor(Math.random() * (bidValues.length - validBidIndices))
      const randomAmount = amounts[randomBidIndex]
      const randomBidValue = bidValues[randomBidIndex]

      // Only place a bid if it's higher than the current bid and team has enough funds
      if (
        randomBidValue > currentBidValue &&
        randomTeam.purse - randomTeam.spent >= randomBidValue &&
        Math.random() > 0.7
      ) {
        // 30% chance to bid

        const newBid = `${randomTeam.name} bid ${randomAmount}`
        setBids((prevBids) => [newBid, ...prevBids])
        setCurrentBid(randomAmount)
        setCurrentBidValue(randomBidValue)
        setCurrentBidder(randomTeam.name)

        // Reset timer when a bid is placed
        setTimerKey((prev) => prev + 1)
      }
    }, 2000)

    return () => clearInterval(bidInterval)
  }, [isTimerRunning, currentPlayerIndex, currentBidValue, allTeams])

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Auctioneer Control Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Room: {roomName}</p>

          {!auctionStarted ? (
            <div className="text-center">
              <Button onClick={startAuction} size="lg">
                Start Auction
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
                    {currentPlayerIndex < players.length ? (
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

                        <div className="mt-4 flex justify-center">
                          <div className="w-full max-w-xs">
                            <div className="text-center mb-2">
                              <span className="text-2xl font-bold">10</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: "100%" }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-center">
                          {currentBidder ? (
                            <div className="text-center mb-4">
                              <p>
                                Current Bid: {currentBid} by {currentBidder}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center mb-4">
                              <p>Starting Bid: {currentBid}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex justify-center">
                          <Button onClick={moveToNextPlayer} disabled={isTimerRunning}>
                            Next Player
                          </Button>
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

                  <TabsContent value="team-purse">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Purse</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] overflow-y-auto space-y-2">
                          {allTeams.map((team) => (
                            <div key={team.id} className="p-2 border-b flex justify-between">
                              <span>{team.name}</span>
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
                  <TableHead>Role</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => {
                  const soldPlayer = soldPlayers.find((p) => p.id === player.id)
                  let status = "Pending"

                  if (index < currentPlayerIndex) {
                    status = soldPlayer ? `Sold to ${soldPlayer.team} for ${soldPlayer.soldFor}` : "Unsold"
                  } else if (index === currentPlayerIndex) {
                    status = "Current"
                  }

                  return (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.role}</TableCell>
                      <TableCell>{player.basePrice}</TableCell>
                      <TableCell>
                        {status === "Current" ? (
                          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                            Current
                          </Badge>
                        ) : status === "Unsold" ? (
                          <Badge variant="outline" className="bg-red-100 dark:bg-red-900">
                            Unsold
                          </Badge>
                        ) : status.startsWith("Sold") ? (
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

