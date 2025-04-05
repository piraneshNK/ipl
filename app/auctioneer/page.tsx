"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PlayerCard from "@/components/player-card"
import Timer from "@/components/timer"

// Sample player data
const samplePlayers = [
  { id: 1, name: "Virat Kohli", basePrice: "2Cr", role: "Batter" },
  { id: 2, name: "Jasprit Bumrah", basePrice: "2Cr", role: "Bowler" },
  { id: 3, name: "Ravindra Jadeja", basePrice: "1.5Cr", role: "All-rounder" },
  { id: 4, name: "KL Rahul", basePrice: "1Cr", role: "Batter" },
  { id: 5, name: "Yuzvendra Chahal", basePrice: "75L", role: "Bowler" },
  { id: 6, name: "Rishabh Pant", basePrice: "1.5Cr", role: "Batter" },
  { id: 7, name: "Hardik Pandya", basePrice: "1.5Cr", role: "All-rounder" },
  { id: 8, name: "Rohit Sharma", basePrice: "2Cr", role: "Batter" },
  { id: 9, name: "Mohammed Shami", basePrice: "1Cr", role: "Bowler" },
  { id: 10, name: "Shreyas Iyer", basePrice: "1Cr", role: "Batter" },
]

export default function AuctioneerPage() {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1)
  const [auctionStarted, setAuctionStarted] = useState(false)
  const [currentBid, setCurrentBid] = useState("")
  const [currentBidder, setCurrentBidder] = useState("")
  const [bids, setBids] = useState<string[]>([])
  const [soldPlayers, setSoldPlayers] = useState<any[]>([])
  const [timerKey, setTimerKey] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [roomName, setRoomName] = useState("")
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
    setIsTimerRunning(true)
    setBids(["Auction started!", ...bids])
  }

  // Use useCallback to memoize the function to prevent unnecessary re-renders
  const handleTimerEnd = useCallback(() => {
    if (currentBidder) {
      // Player sold
      const soldMessage = `${samplePlayers[currentPlayerIndex].name} sold to ${currentBidder} for ${currentBid}`
      setBids((prevBids) => [soldMessage, ...prevBids])

      // Add to sold players
      setSoldPlayers((prevPlayers) => [
        ...prevPlayers,
        {
          ...samplePlayers[currentPlayerIndex],
          soldFor: currentBid,
          soldTo: currentBidder,
        },
      ])
    } else {
      // No bids, player unsold
      const unsoldMessage = `${samplePlayers[currentPlayerIndex].name} unsold`
      setBids((prevBids) => [unsoldMessage, ...prevBids])
    }

    setIsTimerRunning(false)
  }, [currentBidder, currentBid, currentPlayerIndex])

  const moveToNextPlayer = () => {
    if (currentPlayerIndex < samplePlayers.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setCurrentBid("")
      setCurrentBidder("")
      setTimerKey((prev) => prev + 1)
      setIsTimerRunning(true)
    } else {
      // Auction complete
      setBids(["Auction complete!", ...bids])
    }
  }

  // Simulate receiving bids (in a real app, this would come from a websocket)
  useEffect(() => {
    if (!isTimerRunning || currentPlayerIndex < 0) return

    const teams = ["Chennai Kings", "Mumbai Warriors", "Madurai Fighters", "Trichy Blasters"]
    const amounts = ["₹5L", "₹10L", "₹25L", "₹50L", "₹1Cr"]

    const bidInterval = setInterval(() => {
      const randomTeam = teams[Math.floor(Math.random() * teams.length)]
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)]

      // Only place a bid if it's higher than the current bid or there's no current bid
      if (!currentBid || Math.random() > 0.5) {
        const newBid = `${randomTeam} bid ${randomAmount}`
        setBids((prevBids) => [newBid, ...prevBids])
        setCurrentBid(randomAmount)
        setCurrentBidder(randomTeam)

        // Reset timer when a bid is placed
        setTimerKey((prev) => prev + 1)
      }
    }, 2000)

    return () => clearInterval(bidInterval)
  }, [isTimerRunning, currentPlayerIndex, currentBid])

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
                    {currentPlayerIndex < samplePlayers.length ? (
                      <>
                        <PlayerCard player={samplePlayers[currentPlayerIndex]} />

                        <div className="mt-4 flex justify-center">
                          <Timer key={timerKey} seconds={10} onTimerEnd={handleTimerEnd} isRunning={isTimerRunning} />
                        </div>

                        <div className="mt-4 flex justify-center">
                          {currentBidder && (
                            <div className="text-center mb-4">
                              <p>
                                Current Bid: {currentBid} by {currentBidder}
                              </p>
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

              {/* Right column - Bids */}
              <div>
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
              {samplePlayers.map((player, index) => {
                const soldPlayer = soldPlayers.find((p) => p.id === player.id)
                let status = "Pending"
                if (index < currentPlayerIndex) {
                  status = soldPlayer ? `Sold to ${soldPlayer.soldTo} for ${soldPlayer.soldFor}` : "Unsold"
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
        </CardContent>
      </Card>
    </div>
  )
}

