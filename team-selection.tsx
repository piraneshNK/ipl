"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { teams } from "./players"

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
            <Card className={`overflow-hidden transition-all ${isAuctioneer ? "ring-2 ring-primary" : ""}`}>
              <div className="h-2 bg-amber-500" />
              <CardContent className="pt-4 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 mb-2"
                >
                  <path d="m22 8-6 4 6 4V8Z"></path>
                  <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                </svg>
                <h3 className="font-medium text-center text-lg">Auctioneer</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">Control the auction</p>
              </CardContent>
              <CardContent className="pb-4">
                <Button
                  onClick={handleAuctioneerSelect}
                  variant={isAuctioneer ? "default" : "outline"}
                  className="w-full"
                >
                  {isAuctioneer ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {teams.map((team) => (
              <Card
                key={team.id}
                className={`overflow-hidden transition-all ${selectedTeam === team.id ? "ring-2 ring-primary" : ""}`}
              >
                <div className={`h-2 bg-${team.color}-500`} />
                <CardContent className="pt-4">
                  <h3 className="font-medium text-center">{team.name}</h3>
                </CardContent>
                <CardContent className="pb-4">
                  <Button
                    onClick={() => handleTeamSelect(team.id)}
                    variant={selectedTeam === team.id ? "default" : "outline"}
                    className="w-full"
                  >
                    {selectedTeam === team.id ? "Selected" : "Select"}
                  </Button>
                </CardContent>
              </Card>
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

