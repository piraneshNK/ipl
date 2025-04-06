"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TeamCard from "@/components/team-card"
import AuctioneerCard from "@/components/auctioneer-card"
import { teams } from "@/data/players"

export default function TeamSelectionPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [isAuctioneer, setIsAuctioneer] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [roomName, setRoomName] = useState("")
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would fetch this from a database or state management
    const storedRoomName = localStorage.getItem("roomName")

    if (!storedRoomName) {
      router.push("/")
      return
    }

    setRoomName(storedRoomName)
  }, [router])

  const handleTeamSelect = (teamId: number) => {
    setSelectedTeam(teamId)
    setIsAuctioneer(false)
    setIsReady(false)
  }

  const handleAuctioneerSelect = () => {
    setSelectedTeam(null)
    setIsAuctioneer(true)
    setIsReady(false)
  }

  const handleReady = () => {
    setIsReady(true)

    // Store the selected team ID in localStorage
    if (selectedTeam) {
      localStorage.setItem("selectedTeam", selectedTeam.toString())
      localStorage.setItem("isAuctioneer", "false")
    } else {
      localStorage.setItem("isAuctioneer", "true")
    }

    // In a real app, we would notify other users that this user is ready
    // For demo purposes, we'll just redirect after a short delay
    setTimeout(() => {
      if (isAuctioneer) {
        router.push("/auctioneer")
      } else {
        router.push("/auction")
      }
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Select Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Room: {roomName}</p>

          {/* Auctioneer Card */}
          <div className="mb-6">
            <AuctioneerCard isSelected={isAuctioneer} onSelect={handleAuctioneerSelect} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} isSelected={selectedTeam === team.id} onSelect={handleTeamSelect} />
            ))}
          </div>

          {(selectedTeam !== null || isAuctioneer) && (
            <div className="mt-6 text-center">
              <Button onClick={handleReady} disabled={isReady} className="w-full max-w-xs">
                {isReady ? "Waiting for others..." : "Ready"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

