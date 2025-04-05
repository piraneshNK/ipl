"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PlayerCard from "@/components/player-card"
import BidButton from "@/components/bid-button"
import Timer from "@/components/timer"

// Sample player data
const samplePlayers = [
  { id: 1, name: "Virat Kohli", basePrice: "2Cr", role: "Batter" },
  { id: 2, name: "Jasprit Bumrah", basePrice: "2Cr", role: "Bowler" },
  { id: 3, name: "Ravindra Jadeja", basePrice: "1.5Cr", role: "All-rounder" },
  { id: 4, name: "KL Rahul", basePrice: "1Cr", role: "Batter" },
  { id: 5, name: "Yuzvendra Chahal", basePrice: "75L", role: "Bowler" },
]

// Bid amounts
const bidAmounts = ["₹5L", "₹10L", "₹25L", "₹50L", "₹1Cr"]

export default function AuctionPage() {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentBid, setCurrentBid] = useState("")
  const [currentBidder, setCurrentBidder] = useState("")
  const [bids, setBids] = useState<string[]>([])
  const [purseLeft, setPurseLeft] = useState("10Cr")
  const [boughtPlayers, setBoughtPlayers] = useState<any[]>([])
  const [totalSpent, setTotalSpent] = useState("0")
  const [timerKey, setTimerKey] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [teamName, setTeamName] = useState("")
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would fetch this from a database or state management
    const storedRoomName = localStorage.getItem("roomName")

    if (!storedRoomName) {
      router.push("/")
      return
    }

    // For demo purposes, we'll use a fixed team name
    setTeamName("Mumbai Warriors")
  }, [router])

  const handleBid = (amount: string) => {
    const newBid = `${teamName} bid ${amount}`
    setBids([newBid, ...bids])
    setCurrentBid(amount)
    setCurrentBidder(teamName)

    // Reset timer when a bid is placed
    setTimerKey((prev) => prev + 1)
    setIsTimerRunning(true)
  }

  // Use useCallback to memoize the function to prevent unnecessary re-renders
  const handleTimerEnd = useCallback(() => {
    if (currentBidder) {
      // Player sold
      const soldMessage = `${samplePlayers[currentPlayerIndex].name} sold to ${currentBidder} for ${currentBid}`
      setBids((prevBids) => [soldMessage, ...prevBids])

      // Add to bought players
      setBoughtPlayers((prevPlayers) => [
        ...prevPlayers,
        {
          ...samplePlayers[currentPlayerIndex],
          soldFor: currentBid,
          soldTo: currentBidder,
        },
      ])

      // Move to next player
      setTimeout(() => {
        if (currentPlayerIndex < samplePlayers.length - 1) {
          setCurrentPlayerIndex((prevIndex) => prevIndex + 1)
          setCurrentBid("")
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
      const unsoldMessage = `${samplePlayers[currentPlayerIndex].name} unsold`
      setBids((prevBids) => [unsoldMessage, ...prevBids])

      // Move to next player
      setTimeout(() => {
        if (currentPlayerIndex < samplePlayers.length - 1) {
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
  }, [currentBidder, currentBid, currentPlayerIndex])

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
              {currentPlayerIndex < samplePlayers.length && (
                <>
                  <PlayerCard player={samplePlayers[currentPlayerIndex]} />

                  <div className="mt-4 flex justify-center">
                    <Timer key={timerKey} seconds={10} onTimerEnd={handleTimerEnd} isRunning={isTimerRunning} />
                  </div>

                  <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-2">
                    {bidAmounts.map((amount, index) => (
                      <BidButton
                        key={index}
                        amount={amount}
                        onBid={handleBid}
                        disabled={!isTimerRunning || amount === currentBid}
                      />
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Bids, team info */}
        <div>
          <Card className="mb-4">
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
                  <span className="font-bold">{purseLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent:</span>
                  <span className="font-bold">{totalSpent}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Bought Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] overflow-y-auto space-y-2">
                {boughtPlayers.length > 0 ? (
                  boughtPlayers.map((player) => (
                    <div key={player.id} className="p-2 border-b flex justify-between">
                      <span>{player.name}</span>
                      <Badge>{player.soldFor}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">No players bought yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

